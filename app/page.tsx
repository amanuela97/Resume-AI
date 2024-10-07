"use client";
import Hero from "./components/Hero";
import CustomerReviews from "./components/CustomerReviews";
import Features from "./components/Features";
import Pricing from "./components/Pricing";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <CustomerReviews />
      <Pricing />
    </div>
  );
}
