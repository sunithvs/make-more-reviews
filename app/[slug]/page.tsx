import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReviewForm from './review-form';

interface PortalSettings {
  portal_id: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  custom_css: string | null;
  rating_type: string;
  rating_scale: number;
  require_text_review: boolean;
  thank_you_message: string | null;
  redirect_url: string | null;
  modal_trigger: string | null;
  modal_delay_seconds: number | null;
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const supabase = createClient();


  // Get review details using RPC
  const { data: settings, error } = await supabase
    .rpc('get_review_details', {
      p_portal_id: params.slug
    });

  if (error) {
    console.error('Error fetching review details:', error);
    throw new Error('Failed to load review settings');
  }

  // Add custom CSS if provided
  const customStyle = settings?.custom_css ? (
    <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
  ) : null;

  return (
    <>
      {customStyle}
      <div 
        className="container mx-auto p-6"
        style={{
          '--primary-color': settings?.primary_color,
          '--secondary-color': settings?.secondary_color,
        } as React.CSSProperties}
      >
        {settings?.logo_url && (
          <div className="flex justify-center mb-6">
            <img 
              src={settings.logo_url} 
              alt={settings.portal_id}
              className="max-h-16 w-auto"
            />
          </div>
        )}
        <ReviewForm 
          portalId={params.slug}
          ratingScale={settings?.rating_scale || 5}
          requireTextReview={settings?.require_text_review || false}
          thankYouMessage={settings?.thank_you_message}
          redirectUrl={settings?.redirect_url}
          ratingType={settings?.rating_type || 'numeric'}
        />
      </div>
    </>
  );
}
