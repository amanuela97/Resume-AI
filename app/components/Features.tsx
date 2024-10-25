"use client";

import { motion } from "framer-motion";
import { features } from "../utils/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const animateText = (
      element: HTMLHeadingElement | null,
      totalDuration = 1.5
    ) => {
      if (!element) return null;
      const chars = element.innerText.split("");
      element.innerHTML = chars.map((char) => `<span>${char}</span>`).join("");

      const staggerDuration = totalDuration / chars.length;

      return gsap.from(element.children, {
        opacity: 0,
        y: 50,
        stagger: staggerDuration,
        duration: 0.5,
        ease: "power4.out",
      });
    };

    // Create a timeline for synchronized animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Add both animations to the timeline
    const textAnimation = animateText(titleRef.current);
    if (textAnimation) {
      tl.add(textAnimation);
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="p-40 px-8 max-w-6xl mx-auto mb-2">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card p-6 rounded-lg shadow-lg hover:cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.div
                className="text-4xl text-blue-500 mb-4"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-black dark:text-white">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
