'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/animated-text";

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

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechStart Inc",
    content: "Make More Reviews transformed how we collect and analyze customer feedback. The insights have been invaluable.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "E-commerce Owner",
    company: "StyleHub",
    content: "The simplicity and effectiveness of this platform is amazing. Our review collection rate increased by 300%.",
    avatar: "MC"
  },
  {
    name: "Emma Davis",
    role: "Marketing Director",
    company: "GrowthLabs",
    content: "Finally, a review platform that just works. The AI insights have helped us identify key areas for improvement.",
    avatar: "ED"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/50" id="testimonials">
      <div className="container px-4 mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
            Loved by Builders, Trusted by Brands
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <AnimatedText
                    text={testimonial.content}
                    className="text-muted-foreground"
                    delay={index * 0.1}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
