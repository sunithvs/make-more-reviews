'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from './utils';

type Review = {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
};

interface ReviewsGridProps {
  reviews: Review[];
}

export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-lg">{review.rating}</span>
              <span className="text-yellow-500">★</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {formatDate(review.created_at)}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {review.review_text || 'No comment provided'}
            </p>
          </CardContent>
        </Card>
      ))}
      {reviews.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No reviews found</p>
        </div>
      )}
    </div>
  );
}
