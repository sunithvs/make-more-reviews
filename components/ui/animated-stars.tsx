'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function AnimatedStars() {
  const stars = Array(5).fill(0);

  return (
    <div className="flex items-center justify-center gap-2">
      {stars.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            filter: index < 2 ? "grayscale(1)" : "grayscale(0)"
          }}
          transition={{
            delay: index * 0.2,
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
            repeatType: "reverse"
          }}
        >
          <Star 
            className="w-8 h-8 md:w-12 md:h-12" 
            fill="#FFD700" 
            stroke="#FFD700"
          />
        </motion.div>
      ))}
    </div>
  );
}
