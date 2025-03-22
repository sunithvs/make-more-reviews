import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const headersList = headers();
  
  try {
    const { portalId, rating, reviewText, metadata } = await request.json();

    // Add IP address and additional headers
    const enrichedMetadata = {
      ...metadata,
      ip_address: headersList.get('x-forwarded-for') || headersList.get('x-real-ip'),
      // Add geolocation data if available from Cloudflare or similar service
      country: headersList.get('cf-ipcountry'),
      city: headersList.get('cf-ipcity'),
      region: headersList.get('cf-region'),
    };

    // Call the stored procedure using rpc
    const { data, error } = await supabase.rpc('insert_review_with_metadata', {
      p_portal_id: portalId,
      p_review_text: reviewText || '',
      p_rating: rating,
      p_metadata: enrichedMetadata
    });

    if (error) {
      console.error('Error from stored procedure:', error);
      // Check for specific error types
      if (error.message.includes('Invalid portal_id')) {
        return NextResponse.json(
          { error: 'Invalid portal ID' },
          { status: 400 }
        );
      }
      if (error.message.includes('Rating must be between')) {
        return NextResponse.json(
          { error: 'Invalid rating value' },
          { status: 400 }
        );
      }
      if (error.message.includes('Invalid metadata fields')) {
        return NextResponse.json(
          { error: 'Invalid metadata provided' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Error processing review submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
