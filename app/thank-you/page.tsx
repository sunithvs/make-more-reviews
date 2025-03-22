import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function ThankYou({
  searchParams,
}: {
  searchParams: { 
    rating?: string;
    message?: string;
  };
}) {
  const rating = parseInt(searchParams.rating || '0');
  const message = searchParams.message || 'We appreciate your feedback. It helps us improve our service.';

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-lg mx-auto text-center">
        <CardHeader>
          <CardTitle>Thank You for Your Review!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-4xl">
              {rating > 0 && (
                <span className="text-yellow-500">{'★'.repeat(rating)}</span>
              )}
              {rating > 0 && rating < 5 && (
                <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
              )}
            </div>
            <p className="text-muted-foreground">
              {decodeURIComponent(message)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
