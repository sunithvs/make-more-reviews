'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type Portal = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  default_language: string;
  plan: string;
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadPortals = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch active portals for the user
      const { data, error } = await supabase
        .from('portals')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching portals:', error);
      } else {
        console.log('Portals:', data);
        setPortals(data || []);
      }
      setLoading(false);
    };

    checkAuthAndLoadPortals();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Portals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Portals</h1>
        <Button onClick={() => router.push('/portals/new')}>
          Create New Portal
        </Button>
      </div>

      {portals.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <p className="text-muted-foreground mb-4">
            You haven&#39;t created any portals yet.
          </p>
          <Button onClick={() => router.push('/portals/new')}>
            Create Your First Portal
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
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/portals/${portal.id}/settings`)}
                >
                  Settings
                </Button>
                <Button onClick={() => router.push(`/portals/${portal.id}`)}>
                  View Portal
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
