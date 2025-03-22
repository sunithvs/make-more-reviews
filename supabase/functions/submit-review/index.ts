import { serve } from 'https://deno.fresh.dev/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ReviewSubmission {
  portalId: string
  rating: number
  reviewText?: string
  metadata: {
    user_agent?: string
    referrer_url?: string
    landing_page?: string
    device_type?: string
    browser?: string
    browser_version?: string
    os?: string
    os_version?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
}

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
    const clientIp = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Validate required fields
    if (!requestData.portalId || !requestData.rating) {
      throw new Error('Missing required fields: portalId and rating are required')
    }

    // Enrich metadata with IP and headers
    const enrichedMetadata = {
      ...requestData.metadata,
      ip_address: clientIp,
      country: req.headers.get('cf-ipcountry'),
      region: req.headers.get('cf-region'),
      city: req.headers.get('cf-ipcity'),
    }

    // Call the stored procedure
    const { data, error } = await supabaseClient.rpc('insert_review_with_metadata', {
      p_portal_id: requestData.portalId,
      p_review_text: requestData.reviewText || '',
      p_rating: requestData.rating,
      p_metadata: enrichedMetadata
    })

    if (error) {
      throw error
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Review submitted successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )

  } catch (error) {
    // Handle different types of errors
    const status = error.message.includes('Invalid portal_id') ? 400 :
                  error.message.includes('Rating must be between') ? 400 :
                  error.message.includes('Method not allowed') ? 405 : 500

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status,
      }
    )
  }
})
