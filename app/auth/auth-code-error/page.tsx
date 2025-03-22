'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function AuthError() {
  const router = useRouter();

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Authentication Error</h1>
          <p className="text-muted-foreground text-center">
            There was an error during the authentication process.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Please try signing in again. If the problem persists, contact support.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/signin')} className="w-full max-w-xs">
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
