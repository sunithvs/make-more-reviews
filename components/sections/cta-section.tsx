'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignInModal } from "@/components/auth/sign-in-modal";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function CTASection() {
  return (
    <section className="py-20" id="pricing">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-6">
            Start Collecting Reviews Today
          </motion.h2>
          <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8">
            Join thousands of businesses using Make More Reviews to grow their online presence.
          </motion.p>
          <motion.div variants={fadeIn} className="flex gap-4 justify-center">
            <SignInModal>
              <Button
                size="lg"
                className="group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </SignInModal>
            <Button
              variant="outline"
              size="lg"
              className="group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Pricing
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
