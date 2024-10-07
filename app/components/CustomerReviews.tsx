"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import Link from "next/link";
import { fetchReviews } from "../utils/firebase";
import { useAppStore } from "../store";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);

export default function CustomerReviews() {
  const titleTwoRef = useRef<HTMLHeadingElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { reviews, setReviews } = useAppStore();

  useEffect(() => {
    const handleFetchReviews = async () => {
      const newReviews = await fetchReviews();
      if (newReviews) {
        setReviews(newReviews);
      }
      const title = titleTwoRef.current;
      const animateText = (
        element: HTMLHeadingElement | null,
        totalDuration = 1.5
      ) => {
        if (!element) return null;
        const chars = element.innerText.split("");
        element.innerHTML = chars
          .map((char) => `<span>${char}</span>`)
          .join("");

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
      const textAnimation = animateText(titleTwoRef.current);
      if (textAnimation) {
        tl.add(textAnimation);
      }
    };
    if (reviews.length <= 0) {
      handleFetchReviews();
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()),
        handleFetchReviews();
    };
  }, []);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const nextReviews = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setStartIndex((prevIndex) =>
        prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3
      );
    }
  };

  const prevReviews = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setStartIndex((prevIndex) =>
        prevIndex - 3 < 0 ? Math.max(reviews.length - 3, 0) : prevIndex - 3
      );
    }
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + 3);

  if (visibleReviews.length <= 0) return null;

  return (
    <section className="pt-40 px-8 max-w-6xl mx-auto mb-2">
      <h2 ref={titleTwoRef} className="text-3xl font-bold text-center mb-8">
        What Our Customers Say
      </h2>
      <p className="text-base font-bold text-center mb-8">
        want to leave a review?{" "}
        <Link
          href="/reviews"
          className="text-base font-bold text-blue-500 hover:underline p-1"
        >
          leave a review
        </Link>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleReviews.map((review, index) => (
          <Card
            key={review.id}
            className={`flex flex-col h-full transition-opacity duration-500 ease-in-out ${
              isAnimating ? "opacity-0" : "opacity-100"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardContent className="flex-grow py-6">
              <div className="flex items-center mb-4">
                <Avatar className="w-12 h-12 mr-4">
                  {review?.image ? (
                    <AvatarImage src={review.image} alt={review.name} />
                  ) : (
                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                  )}
                </Avatar>
                <h3 className="text-xl font-semibold">{review.name}</h3>
              </div>
              <div className="relative">
                <span className="absolute top-0 left-0 text-6xl text-yellow-400 leading-none -translate-x-2 -translate-y-4">
                  "
                </span>
                <p className="dark:text-white text-black relative z-10 pl-6">
                  {review.review}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {visibleReviews.length > 3 && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={prevReviews}
            variant="outline"
            className="bg-card"
            size="icon"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={nextReviews}
            variant="outline"
            size="icon"
            className="bg-card"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
