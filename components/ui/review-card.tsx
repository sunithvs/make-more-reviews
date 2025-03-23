'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface ReviewCardProps {
  content: string;
  author: string;
  rating: number;
  color: string;
  delay: number;
}

export function ReviewCard({ content, author, rating, color, delay }: ReviewCardProps) {
  return (
    <motion.div
      className={`${color} p-6 rounded-lg shadow-lg max-w-[260px] backdrop-blur-sm bg-opacity-90 border border-white/20`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05,
        rotate: [0, -1, 1, 0],
        transition: {
          rotate: {
            duration: 0.5,
            repeat: 0
          }
        }
      }}
    >
      <div className="flex gap-0.5 mb-3">
        {Array(4).fill(0).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.1 }}
          >
            <Star
              className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              strokeWidth={1.5}
            />
          </motion.div>
        ))}
      </div>
      <p className="text-sm mb-3 text-gray-800 font-medium leading-relaxed">{content}</p>
      <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-[10px]">
          {author.split(' ')[0][0]}{author.split(' ')[1][0]}
        </span>
        {author}
      </p>
    </motion.div>
  );
}
