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
    <section className="py-20 bg-muted/50" id="pricing">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-6">
            Start Collecting Reviews Today
          </motion.h2>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-8 px-4">
            Join thousands of businesses using Make More Reviews to grow their online presence.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <SignInModal>
              <Button
                size="lg"
                className="group w-full sm:w-auto text-base md:min-w-[200px]"
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
              className="group w-full sm:w-auto text-base md:min-w-[200px]"
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
