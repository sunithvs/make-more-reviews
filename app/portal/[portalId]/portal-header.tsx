'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, LayoutGrid, Table as TableIcon, Share2, Filter, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface PortalHeaderProps {
  userEmail: string;
  portalId: string;
}

export default function PortalHeader({ userEmail, portalId }: PortalHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get('view') || 'table';

  const handleViewChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('view', value);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <div className="bg-background">
      <div className="flex flex-col space-y-4 p-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form action="/api/auth/signout" method="post">
                  <button className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <Tabs value={viewMode} onValueChange={handleViewChange} className="w-full max-w-[280px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table" className="flex items-center justify-center gap-2">
                <TableIcon className="h-4 w-4" />
                <span className="hidden md:inline">Table</span>
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center justify-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden md:inline">Grid</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
              <Link href={`/portal/${portalId}/share`}>
                <Share2 className="h-4 w-4" />
                Share
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10">
                      {userEmail?.charAt(0).toUpperCase()}
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
                  <form action="/api/auth/signout" method="post">
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

        {/* Mobile Action Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-10 text-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 h-10 text-sm">
            <Link href={`/portal/${portalId}/share`} className="flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Link>
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="p-4 bg-white/50 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">14</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
