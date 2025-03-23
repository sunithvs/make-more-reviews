'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";

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

  const getFeedbackMessage = (value: number) => {
    if (!value) return null;
    
    const messages = {
      1: { emoji: '😢', message: "We're sorry to hear that" },
      2: { emoji: '😕', message: "We'll work on improving" },
      3: { emoji: '😊', message: "Thanks for your feedback" },
      4: { emoji: '🌟', message: "We're glad you had a good experience" },
      5: { emoji: '🎉', message: "Fantastic! Thank you so much" }
    };

    // Scale the rating to 1-5 range for feedback
    const scaledRating = Math.ceil((value / ratingScale) * 5);
    return messages[scaledRating as keyof typeof messages];
  };

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

  const getPlaceholder = (rating: number) => {
    if (!rating) return "Tell us about your experience";
    if (requireTextReview) return "Please share your experience (required)";

    // Scale the rating to 1-5 range for consistent messaging
    const scaledRating = Math.ceil((rating / ratingScale) * 5);
    
    const placeholders = {
      1: [
        "What went wrong? Help us improve",
        "What could we have done better?",
        "Share your concerns with us"
      ],
      2: [
        "What aspects need improvement?",
        "Tell us how we can do better",
        "What didn't meet your expectations?"
      ],
      3: [
        "What could make your experience better?",
        "Share your thoughts with us",
        "What would you like to see improved?"
      ],
      4: [
        "What did you enjoy most?",
        "Tell us what worked well for you",
        "Share your positive experience"
      ],
      5: [
        "What made your experience exceptional?",
        "Tell us what you loved most",
        "Share what impressed you"
      ]
    };

    // Get random placeholder for variety
    const options = placeholders[scaledRating as keyof typeof placeholders];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (requireTextReview && !review.trim()) {
      toast.error('Please provide a review');
      return;
    }

    setLoading(true);
    try {
      const metadata = getMetadata();
      const { data, error } = await supabase.rpc('insert_review_with_metadata', {
        p_portal_id: portalId,
        p_review_text: review || '',
        p_rating: rating,
        p_metadata: metadata
      });

      if (error) {
        console.error('Error submitting review:', error);
        if (error.message.includes('Invalid portal_id')) {
          toast.error('Invalid portal ID');
        } else if (error.message.includes('Rating must be between')) {
          toast.error('Invalid rating value');
        } else {
          toast.error('Failed to submit review. Please try again.');
        }
        return;
      }

      toast.success('Thank you for your review!');

      // Redirect based on settings
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push(`/thank-you?rating=${rating}&message=${encodeURIComponent(thankYouMessage || '')}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingOption = (value: number) => {
    const isSelected = rating === value;
    const baseClasses = "transition-all duration-200 ease-in-out transform hover:scale-110";
    
    switch (ratingType) {
      case 'stars':
        return (
          <span className={`text-2xl ${baseClasses} ${isSelected ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        );
      case 'emojis':
        const getEmoji = (val: number) => {
          const scaledValue = Math.ceil((val / ratingScale) * 5);
          return ['😢', '😕', '😐', '😊', '🎉'][scaledValue - 1] || '😐';
        };
        return (
          <span className={`text-2xl ${baseClasses}`}>
            {getEmoji(value)}
          </span>
        );
      default:
        return value;
    }
  };

  const getRatingLabel = () => {
    if (!rating) return 'Select your rating';
    
    switch (ratingType) {
      case 'stars':
        return `${rating} star${rating !== 1 ? 's' : ''}`;
      case 'emojis':
        return rating <= 2 ? 'Poor' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent';
      default:
        return `Rating: ${rating}/${ratingScale}`;
    }
  };

  const feedback = getFeedbackMessage(rating);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>Your feedback helps us improve our service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-2">
              {Array.from({ length: ratingScale }).map((_, i) => (
                <Button
                  key={i}
                  variant={rating === i + 1 ? "default" : "outline"}
                  size="lg"
                  onClick={() => setRating(i + 1)}
                  className={`w-12 h-12 ${rating === i + 1 ? 'ring-2 ring-primary' : ''}`}
                >
                  {renderRatingOption(i + 1)}
                </Button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col items-center space-y-2 mt-4"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl"
                  >
                    {feedback.emoji}
                  </motion.span>
                  <p className="text-sm font-medium text-primary">
                    {feedback.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-sm text-muted-foreground mt-2">{getRatingLabel()}</p>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder={getPlaceholder(rating)}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[120px] resize-none"
              required={requireTextReview}
            />
            {requireTextReview && (
              <p className="text-xs text-muted-foreground">
                * Required field
              </p>
            )}
          </div>
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
