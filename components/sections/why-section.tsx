'use client';

import { motion } from "framer-motion";

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

export function WhySection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-6">
            Built Out of Frustration, Designed for Simplicity
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-lg text-muted-foreground mb-12"
          >
            Building products means constantly improving based on feedback. But using existing
            review tools was a hassle—repeating integrations, manually creating forms,
            setting up tables, and handling messy analytics. We needed something better.
            So, we built it.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
