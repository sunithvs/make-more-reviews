import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReviewForm from './review-form';
import { Skeleton } from "@/components/ui/skeleton";

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
  portal_name: string | null;
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

  // If no settings found, the portal doesn't exist
  if (!settings) {
    notFound();
  }

  // Add custom CSS if provided
  const customStyle = settings?.custom_css ? (
    <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
  ) : null;

  return (
    <>
      {customStyle}
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-background"
        style={{
          '--primary-color': settings.primary_color || '#000000',
          '--secondary-color': settings.secondary_color || '#666666',
        } as React.CSSProperties}
      >
        <div className="w-full max-w-lg mx-auto space-y-6">
          {/* Logo and Portal Name */}
          <div className="text-center space-y-4">
            {settings.logo_url && (
              <div className="flex justify-center">
                <img 
                  src={settings.logo_url} 
                  alt={settings.portal_name || settings.portal_id}
                  className="max-h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {settings.portal_name && (
              <h1 className="text-2xl font-semibold tracking-tight">
                {settings.portal_name}
              </h1>
            )}
          </div>

          {/* Review Form */}
          <ReviewForm 
            portalId={params.slug}
            ratingScale={settings.rating_scale || 5}
            requireTextReview={settings.require_text_review || false}
            thankYouMessage={settings.thank_you_message}
            redirectUrl={settings.redirect_url}
            ratingType={settings.rating_type || 'numeric'}
          />
        </div>
      </div>
    </>
  );
}

// Loading state
export function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-32 mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

// Not Found state
export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Review Form Not Found</h1>
        <p className="text-muted-foreground">
          The review form you're looking for doesn't exist or has been removed.
        </p>
      </div>
    </div>
  );
}
