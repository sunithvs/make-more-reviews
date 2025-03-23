import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const dynamic = 'force-dynamic';

type Portal = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  default_language: string;
  plan: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default async function Dashboard() {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  const { data: portals, error } = await supabase
    .from('portals')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('Error fetching portal:', error);
    throw new Error('Failed to fetch portal');
  }

  const handleLogout = async () => {
    'use server'
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">MakeMoreReviews</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Portals
            </h2>
            <div className="space-y-1">
              {portals?.map((portal) => (
                <Link
                  key={portal.id}
                  href={`/portal/${portal.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {getInitials(portal.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{portal.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t mt-auto sticky bottom-0 bg-background">
          <Button asChild className="w-full" size="sm">
            <Link href="/portal/new" className="flex items-center gap-2">
              <PlusCircle size={16} />
              Create Portal
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b">
          <div className="flex h-16 items-center px-6 justify-between">
            <h2 className="text-2xl font-bold">Your Portals</h2>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form action={handleLogout}>
                      <button className="flex items-center gap-2 w-full">
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          {(!portals || portals.length === 0) ? (
            <Card className="w-full p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven&#39;t created any portals yet.
              </p>
              <Button asChild>
                <Link href="/portal/new">Create Your First Portal</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portals.map((portal) => (
                <Link key={portal.id} href={`/portal/${portal.id}`}>
                  <Card className="w-full h-full hover:bg-accent/5 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10">
                            {getInitials(portal.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{portal.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {portal.plan}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {portal.description || 'No description provided'}
                      </p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {portal.default_language}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
