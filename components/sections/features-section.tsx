'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Zap, Sparkles } from "lucide-react";

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

const features = [
  {
    title: "Custom Review Portals",
    description: "Create fully branded review pages in minutes",
    icon: Star
  },
  {
    title: "Seamless Integrations",
    description: "Works with Shopify, WordPress, CRMs, and more",
    icon: Zap
  },
  {
    title: "AI-Powered Insights",
    description: "Smart analytics and sentiment analysis",
    icon: Sparkles
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20" id="features">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
            Everything You Need, Nothing You Don't
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
