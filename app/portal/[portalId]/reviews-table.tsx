'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewsGrid from './reviews-grid';
import { formatDate } from './utils';

const ITEMS_PER_PAGE = 10;

type Review = {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
};

interface ReviewsTableProps {
  portalId: string;
}

export default function ReviewsTable({ portalId }: ReviewsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const supabase = createClient();

  const currentPage = Number(searchParams.get('page')) || 1;
  const ratingFilter = searchParams.get('rating');
  const viewMode = searchParams.get('view') || 'table';

  const fetchReviews = async () => {
    setLoading(true);
    
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('portal_id', portalId);

    if (ratingFilter && ratingFilter !== 'all') {
      query = query.eq('rating', ratingFilter);
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, ratingFilter, portalId]);

  const updateSearchParams = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value && value !== 'all') {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    
    // Reset to first page when filter changes
    if (key === 'rating') {
      current.delete('page');
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginationLinks = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted mb-2 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Select
            value={ratingFilter || 'all'}
            onValueChange={(value) => updateSearchParams('rating', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          Total Reviews: {totalCount}
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[50%]">Review</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{review.rating}</span>
                      <span className="ml-1 text-yellow-500">★</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.review_text || 'No comment'}</TableCell>
                  <TableCell>
                    {formatDate(review.created_at)}
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No reviews found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <ReviewsGrid reviews={reviews} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {paginationLinks.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => updateSearchParams('page', page.toString())}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
