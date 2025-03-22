import { serve } from 'https://deno.fresh.dev/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ReviewSubmission {
  portalId: string
  rating: number
  reviewText?: string
  metadata: {
    url?: string
    referrer?: string
    userAgent?: string
    language?: string
    screenSize?: string
    browser?: string
    timestamp?: string
    utmParams?: {
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
      utm_term?: string
      utm_content?: string
    }
  }
}

interface ErrorResponse {
  success: false
  error: string
  code?: string
}

interface SuccessResponse {
  success: true
  message: string
  data?: any
}

type ApiResponse = ErrorResponse | SuccessResponse

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Get request data
    const requestData: ReviewSubmission = await req.json()
    
    // Validate request data
    if (!requestData) {
      throw new Error('Invalid request: Missing request body')
    }

    if (!requestData.portalId) {
      throw new Error('Invalid request: Missing portalId')
    }

    if (typeof requestData.rating !== 'number' || requestData.rating < 1 || requestData.rating > 5) {
      throw new Error('Invalid request: Rating must be a number between 1 and 5')
    }

    // Get client info
    const clientIp = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    const country = req.headers.get('cf-ipcountry')
    const region = req.headers.get('cf-region')
    const city = req.headers.get('cf-ipcity')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Server configuration error: Missing Supabase credentials')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Enrich metadata with IP and location info
    const enrichedMetadata = {
      ...requestData.metadata,
      ip_address: clientIp,
      location: {
        country,
        region,
        city,
      },
      submission_timestamp: new Date().toISOString(),
    }

    // Insert review into database
    const { data, error: dbError } = await supabaseClient.rpc('insert_review_with_metadata', {
      p_portal_id: requestData.portalId,
      p_review_text: requestData.reviewText || '',
      p_rating: requestData.rating,
      p_metadata: enrichedMetadata
    })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save review')
    }

    // Return success response
    const response: SuccessResponse = {
      success: true,
      message: 'Review submitted successfully',
      data
    }

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing request:', error)

    // Determine appropriate status code
    let status = 500
    if (error.message.includes('Method not allowed')) {
      status = 405
    } else if (
      error.message.includes('Invalid request') ||
      error.message.includes('Rating must be')
    ) {
      status = 400
    }

    // Create error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.message,
      code: status.toString()
    }

    return new Response(JSON.stringify(errorResponse), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status,
    })
  }
})
