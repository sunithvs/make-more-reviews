'use client';

import { ReviewCard } from "./review-card";
import { motion } from "framer-motion";

const leftReviews = [
  {
    content: "This tool has completely transformed how we collect reviews. Our response rate has increased by 300%!",
    author: "Sarah M.",
    rating: 5,
    color: "bg-yellow-100",
    position: "top-20",
    rotate: -4
  },
  {
    content: "Easy to integrate and the analytics are incredibly useful. Great customer support too!",
    author: "Emily L.",
    rating: 4,
    color: "bg-green-100",
    position: "top-1/2",
    rotate: -2
  },
  {
    content: "The automated follow-ups have saved us so much time. Highly recommend!",
    author: "Lisa T.",
    rating: 4,
    color: "bg-purple-100",
    position: "bottom-32",
    rotate: -3
  }
];

const rightReviews = [
  {
    content: "The AI insights have helped us identify key areas for improvement. Fantastic tool!",
    author: "Michael R.",
    rating: 5,
    color: "bg-blue-100",
    position: "top-32",
    rotate: 3
  },
  {
    content: "We've seen a significant increase in positive reviews since using this platform.",
    author: "David K.",
    rating: 5,
    color: "bg-pink-100",
    position: "top-2/3",
    rotate: 4
  },
  {
    content: "Best review management tool we've used. Simple yet powerful!",
    author: "James W.",
    rating: 5,
    color: "bg-orange-100",
    position: "bottom-20",
    rotate: 2
  }
];

export function FloatingReviews() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
      {/* Left side reviews */}
      <div className="absolute left-4 xl:left-20 top-0 bottom-0 w-[300px]">
        {leftReviews.map((review, index) => (
          <motion.div
            key={index}
            className={`absolute ${review.position} left-0`}
            initial={{ opacity: 0, x: -100 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              rotate: review.rotate
            }}
            transition={{
              delay: index * 0.2,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.6,
              }}
            >
              <ReviewCard
                content={review.content}
                author={review.author}
                rating={review.rating}
                color={review.color}
                delay={index * 0.2}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Right side reviews */}
      <div className="absolute right-4 xl:right-20 top-0 bottom-0 w-[300px]">
        {rightReviews.map((review, index) => (
          <motion.div
            key={index}
            className={`absolute ${review.position} right-0`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              rotate: review.rotate
            }}
            transition={{
              delay: index * 0.2,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.6,
              }}
            >
              <ReviewCard
                content={review.content}
                author={review.author}
                rating={review.rating}
                color={review.color}
                delay={index * 0.2}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
