"use client";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Features from "./components/Features";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <CustomerReviews />
    </div>
  );
}
