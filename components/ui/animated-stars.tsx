'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function AnimatedStars() {
  const stars = Array(4).fill(0);

  return (
    <div className="flex items-center justify-center gap-2">
      {stars.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, x: -100 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            filter: "grayscale(0)"
          }}
          transition={{
            delay: index * 0.2,
            duration: 0.5
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
