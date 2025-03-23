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
          initial={{ opacity: 0, scale: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            filter: index < 4 ? "grayscale(0)" : "grayscale(1)"
          }}
          transition={{
            delay: index * 0.2,
            duration: 0.5
          }}
        >
          <Star 
            className={`w-8 h-8 md:w-12 md:h-12 ${index < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}
