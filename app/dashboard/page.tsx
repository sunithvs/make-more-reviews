import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Portal = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  default_language: string;
  plan: string;
};

export default async function Dashboard() {
  const supabase = createClient();
  
  // Check auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch active portal
  const { data: portals, error } = await supabase
    .from('portals')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('Error fetching portal:', error);
    throw new Error('Failed to fetch portal');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Portals</h1>
        <Button asChild>
          <Link href="/portal/new">Create New Portal</Link>
        </Button>
      </div>

      {(!portals || portals.length === 0) ? (
        <Card className="w-full p-6 text-center">
          <p className="text-muted-foreground mb-4">
            You haven&#39;t created any portals yet.
          </p>
          <Button asChild>
            <Link href="/app/portal/new">Create Your First Portal</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => (
            <Card key={portal.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{portal.name}</h2>
                  <Badge variant="secondary">{portal.plan}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {portal.description || 'No description provided'}
                </p>
                <div className="mt-2">
                  <Badge variant="outline">{portal.default_language}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/portal/${portal.id}/settings`}>Settings</Link>
                </Button>
                <Button asChild>
                  <Link href={`/portal/${portal.id}`}>View Portal</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
