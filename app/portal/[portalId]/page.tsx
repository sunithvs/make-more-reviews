import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PortalHeader from './portal-header';
import ReviewsTable from './reviews-table';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    portalId: string;
  };
}

export default async function PortalReviews({ params }: PageProps) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  const { data: portal } = await supabase
    .from('portals')
    .select('*')
    .eq('id', params.portalId)
    .single();

  if (!portal) {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold">MakeMoreReviews</h1>
          </Link>
        </div>
        <div className="p-4">
          <h2 className="font-semibold mb-2">{portal.name}</h2>
          <p className="text-sm text-muted-foreground">{portal.description || 'No description'}</p>
        </div>
        <div className="p-4 border-t mt-auto sticky bottom-0 bg-background">
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <PortalHeader 
          userEmail={session.user.email || ''} 
          portalId={params.portalId} 
        />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <ReviewsTable portalId={params.portalId} />
          </div>
        </div>
      </div>
    </div>
  );
}
