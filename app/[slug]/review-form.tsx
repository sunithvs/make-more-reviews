'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  portalId: string;
  ratingScale: number;
  requireTextReview: boolean;
  thankYouMessage?: string | null;
  redirectUrl?: string | null;
  ratingType: 'numeric' | 'stars' | 'emojis';
}

export default function ReviewForm({ 
  portalId, 
  ratingScale,
  requireTextReview,
  thankYouMessage,
  redirectUrl,
  ratingType 
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const getMetadata = () => {
    // Simple device detection
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
    const isTablet = /Tablet|iPad/i.test(userAgent);
    
    // Browser detection
    const browserData = {
      chrome: /Chrome/.test(userAgent),
      safari: /Safari/.test(userAgent),
      firefox: /Firefox/.test(userAgent),
      edge: /Edg/.test(userAgent),
      ie: /Trident/.test(userAgent),
    };

    const browser = Object.keys(browserData).find(key => browserData[key as keyof typeof browserData]) || 'other';

    // OS detection
    const osData = {
      windows: /Windows/.test(userAgent),
      mac: /Mac/.test(userAgent),
      ios: /iPhone|iPad|iPod/.test(userAgent),
      android: /Android/.test(userAgent),
      linux: /Linux/.test(userAgent),
    };

    const os = Object.keys(osData).find(key => osData[key as keyof typeof osData]) || 'other';

    // Get UTM parameters from URL
    const utmParams = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
    };

    return {
      user_agent: userAgent,
      referrer_url: document.referrer || null,
      landing_page: window.location.href,
      device_type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      browser,
      browser_version: userAgent.match(new RegExp(browser + '/([0-9.]+)'))?.[1] || '',
      os,
      os_version: userAgent.match(new RegExp(os + ' ([0-9._]+)'))?.[1] || '',
      ...utmParams
    };
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (requireTextReview && !review.trim()) {
      alert('Please provide a review');
      return;
    }

    setLoading(true);
    try {
      const metadata = getMetadata();
      console.log('Submitting with:', {
        portalId,
        review,
        rating,
        metadata
      });
      const { data, error } = await supabase.rpc('insert_review_with_metadata', {
        p_portal_id: portalId,
        p_review_text: review || '',
        p_rating: rating,
        p_metadata: metadata
      });

      if (error) {
        console.error('Error submitting review:', error);
        if (error.message.includes('Invalid portal_id')) {
          alert('Invalid portal ID');
        } else if (error.message.includes('Rating must be between')) {
          alert('Invalid rating value');
        } else {
          alert('Failed to submit review. Please try again.');
        }
        return;
      }

      // Redirect based on settings
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push(`/thank-you?rating=${rating}&message=${encodeURIComponent(thankYouMessage || '')}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingOption = (value: number) => {
    switch (ratingType) {
      case 'stars':
        return <span className="text-2xl">★</span>;
      case 'emojis':
        return <span className="text-2xl">{
          value <= 2 ? '😞' : 
          value === 3 ? '😐' : 
          value === 4 ? '😊' : '😃'
        }</span>;
      default:
        return value;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {Array.from({ length: ratingScale }).map((_, i) => (
              <Button
                key={i}
                variant={rating === i + 1 ? "default" : "outline"}
                size="lg"
                onClick={() => setRating(i + 1)}
                className="w-12 h-12"
              >
                {renderRatingOption(i + 1)}
              </Button>
            ))}
          </div>
          <Textarea
            placeholder={requireTextReview ? "Please share your experience (required)" : "Tell us about your experience..."}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[100px]"
            required={requireTextReview}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || rating === 0 || (requireTextReview && !review.trim())} 
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </CardFooter>
    </Card>
  );
}
