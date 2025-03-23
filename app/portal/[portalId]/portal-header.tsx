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
import { Separator } from "@/components/ui/separator";

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
    <div className="border-b">
      <div className="flex flex-col md:flex-row md:h-16 items-start md:items-center px-4 md:px-6 py-3 md:py-0 gap-3 md:gap-0 justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h2 className="text-xl md:text-2xl font-bold">Reviews</h2>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <Tabs value={viewMode} onValueChange={handleViewChange} className="w-auto md:w-[400px]">
            <TabsList className="grid w-[160px] md:w-[200px] grid-cols-2">
              <TabsTrigger value="table" className="flex items-center gap-2 text-xs md:text-sm">
                <TableIcon className="h-3 w-3 md:h-4 md:w-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2 text-xs md:text-sm">
                <LayoutGrid className="h-3 w-3 md:h-4 md:w-4" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Link href={`/portal/${portalId}/share`}>
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
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
              <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
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
    </div>
  );
}
