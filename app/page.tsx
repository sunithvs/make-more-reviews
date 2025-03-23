'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { ArrowRight, CheckCircle2, MessageSquare, Sparkles, Star, Users, Zap } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { AnimatedText } from "@/components/ui/animated-text";
import { SignInModal } from "@/components/auth/sign-in-modal"; 
import { useRef } from "react";
import { AnimatedStars } from "@/components/ui/animated-stars";
import { TextCarousel } from "@/components/ui/text-carousel";
import { FloatingReviews } from "@/components/ui/floating-reviews";

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

const steps = [
  {
    title: "Create Your Portal",
    description: "Set up in minutes, customize branding"
  },
  {
    title: "Collect Reviews Effortlessly",
    description: "Embed, share, automate"
  },
  {
    title: "Turn Feedback into Action",
    description: "AI-powered insights for improvement"
  }
];

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

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <div className="flex flex-col min-h-screen" ref={ref}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{ y: backgroundY }}
        />
        <FloatingReviews />
        <div className="container relative px-4 mx-auto z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              className="mb-12"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <AnimatedStars />
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6 space-y-4"
              style={{ y: textY }}
            >
              <div className="bg-background/80 backdrop-blur-sm py-4 rounded-lg">
                <div>Make More</div>
                <TextCarousel />
              </div>
            </motion.div>
            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground mb-8 bg-background/80 backdrop-blur-sm py-4 px-6 rounded-lg inline-block"
            >
              Automate, analyze, and showcase customer feedback with Make More Reviews.
              Simplify integration and gain valuable insights.
            </motion.p>
            <motion.div variants={fadeIn} className="flex gap-4 justify-center">
              <SignInModal>
                <Button
                  size="lg"
                  className="group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInModal>
              <Button
                variant="outline"
                size="lg"
                className="group bg-background/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Make More Reviews */}
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

      {/* Features */}
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

      {/* Stats Section */}
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

      {/* How It Works */}
      <section className="py-20 bg-muted/50" id="how-it-works">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
              Collect. Analyze. Grow.
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
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

      {/* CTA */}
      <section className="py-20" id="pricing">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-6">
              Start Collecting Reviews Today
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8">
              Join thousands of businesses using Make More Reviews to grow their online presence.
            </motion.p>
            <motion.div variants={fadeIn} className="flex gap-4 justify-center">
              <SignInModal>
                <Button
                  size="lg"
                  className="group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInModal>
              <Button
                variant="outline"
                size="lg"
                className="group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Pricing
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
