'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        rotate: {
          duration: 0.5,
          ease: "easeInOut"
        }
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={cn("flex items-center gap-2", className)}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        variants={iconVariants}
        className="relative"
      >
        <Star className="w-8 h-8 text-primary" strokeWidth={2.5} />
        <motion.div
          className="absolute inset-0 text-primary"
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Star className="w-8 h-8" strokeWidth={2.5} />
        </motion.div>
      </motion.div>
      {showText && (
        <motion.div variants={textVariants} className="flex items-center">
          <span className="text-xl font-bold">Make</span>
          <span className="text-xl font-bold text-primary">More</span>
          <span className="text-xl font-bold ml-1">Reviews</span>
        </motion.div>
      )}
    </motion.div>
  );
}
