'use client';

import { motion } from "framer-motion";
import { MessageSquare, Users, Star } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";

const stats = [
  {
    value: 10000,
    label: "Reviews Collected",
    icon: MessageSquare
  },
  {
    value: 500,
    label: "Active Businesses",
    icon: Users
  },
  {
    value: 98,
    label: "Customer Satisfaction",
    suffix: "%",
    icon: Star
  }
];

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
