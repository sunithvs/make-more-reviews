'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedStars } from "@/components/ui/animated-stars";
import { TextCarousel } from "@/components/ui/text-carousel";
import { FloatingReviews } from "@/components/ui/floating-reviews";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { useRef } from "react";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function HeroContent() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"
        style={{ y: backgroundY }}
      />
      <FloatingReviews />
      <div className="container relative px-4 mx-auto z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            className="mb-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <AnimatedStars />
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="text-4xl md:text-6xl font-bold mb-6 space-y-4"
            style={{ y: textY }}
          >
            <div className="bg-background/80 backdrop-blur-sm py-4 rounded-lg">
              <div>Make More</div>
              <TextCarousel />
            </div>
          </motion.div>
          <motion.p
            variants={fadeIn}
            className="text-xl text-muted-foreground mb-8 bg-background/80 backdrop-blur-sm py-4 px-6 rounded-lg inline-block"
          >
            Automate, analyze, and showcase customer feedback with Make More Reviews.
            Simplify integration and gain valuable insights.
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
              className="group bg-background/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See How It Works
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
