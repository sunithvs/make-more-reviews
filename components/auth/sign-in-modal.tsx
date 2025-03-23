'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@/lib/supabase/client';
import { useState } from "react";
import { Icons } from "@/components/ui/icons";

interface SignInModalProps {
  children: React.ReactNode;
}

export function SignInModal({ children }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function signInWithGoogle() {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <AnimatePresence>
        <DialogContent className="sm:max-w-[425px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome Back</DialogTitle>
              <DialogDescription>
                Sign in to your account to continue
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}
                Sign in with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="/terms" className="underline hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </a>
            </div>
          </motion.div>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
}
