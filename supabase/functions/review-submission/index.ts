// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ReviewSubmission {
  portalId: string
  rating: number
  reviewText?: string
  metadata?: {
    url?: string
    referrer_url?: string
    userAgent?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    landing_page?: string
    device_type?: string
    browser?: string
    browser_version?: string
    os?: string
    os_version?: string
    country?: string
    region?: string
    city?: string
    ip_address?: string
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

function parseBrowserInfo(userAgent: string) {
  // Basic browser and OS detection - you might want to use a more robust solution
  const ua = userAgent.toLowerCase()
  let browser = 'unknown'
  let os = 'unknown'
  let device_type = 'desktop'

  // Browser detection
  if (ua.includes('firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('chrome')) {
    browser = 'Chrome'
  } else if (ua.includes('safari')) {
    browser = 'Safari'
  } else if (ua.includes('edge')) {
    browser = 'Edge'
  }

  // OS detection
  if (ua.includes('windows')) {
    os = 'Windows'
  } else if (ua.includes('mac os')) {
    os = 'MacOS'
  } else if (ua.includes('linux')) {
    os = 'Linux'
  } else if (ua.includes('android')) {
    os = 'Android'
    device_type = 'mobile'
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS'
    device_type = ua.includes('ipad') ? 'tablet' : 'mobile'
  }

  // Version extraction (basic implementation)
  const browserVersion = ua.match(/(?:chrome|firefox|safari|edge)\/(\d+(\.\d+)?)/)?.[1] || ''
  const osVersion = ua.match(/(?:windows nt|mac os x|android|ios) (\d+(\.\d+)?)/)?.[1] || ''

  return {
    browser,
    browser_version: browserVersion,
    os,
    os_version: osVersion,
    device_type
  }
}

Deno.serve(async (req) => {
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

    // Get client info from request
    const clientIp = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const country = req.headers.get('cf-ipcountry')
    const region = req.headers.get('cf-region')
    const city = req.headers.get('cf-ipcity')

    // Parse user agent for browser and OS info
    const browserInfo = parseBrowserInfo(userAgent)
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Prepare metadata in the correct format
    const metadata = {
      ip_address: clientIp,
      user_agent: userAgent,
      country,
      region,
      city,
      ...browserInfo,
      referrer_url: requestData.metadata?.referrer_url,
      landing_page: requestData.metadata?.url,
      utm_source: requestData.metadata?.utm_source,
      utm_medium: requestData.metadata?.utm_medium,
      utm_campaign: requestData.metadata?.utm_campaign,
      utm_term: requestData.metadata?.utm_term,
      utm_content: requestData.metadata?.utm_content
    }

    // Call the database procedure
    const { data, error: dbError } = await supabaseClient.rpc('insert_review_with_metadata', {
      p_portal_id: requestData.portalId,
      p_review_text: requestData.reviewText || '',
      p_rating: requestData.rating,
      p_metadata: metadata
    })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(dbError.message || 'Failed to save review')
    }

    // Return success response
    const response: SuccessResponse = {
      success: true,
      message: 'Review submitted successfully',
      data
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      status,
    })
  }
})
