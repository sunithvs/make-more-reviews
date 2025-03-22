import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import ReviewsTable from './reviews-table';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    portalId: string;
  };
}

export default async function PortalReviews({ params }: PageProps) {
  const supabase = createClient();

  // Check auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Verify portal access
  const { data: portal } = await supabase
    .from('portals')
    .select('name')
    .eq('id', params.portalId)
    .single();

  if (!portal) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reviews for {portal.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewsTable portalId={params.portalId} />
        </CardContent>
      </Card>
    </div>
  );
}
