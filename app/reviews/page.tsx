"use client";
import { useEffect, useState } from "react";
import { ReviewSummary } from "../components/reviews/ReviewSummary";
import { ReviewItem } from "../components/reviews/ReviewItem";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store";
import { fetchReviews } from "../utils/firebase";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const router = useRouter();
  const { reviews, setReviews } = useAppStore();
  const [visibleReviews, setVisibleReviews] = useState(5);

  useEffect(() => {
    const handleFetchReviews = async () => {
      const newReviews = await fetchReviews();
      if (newReviews) {
        setReviews(newReviews);
      }
    };
    if (reviews.length <= 0) {
      handleFetchReviews();
    }
  }, []);

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => Math.min(prev + 5, reviews.length));
  };

  if (!reviews || reviews.length <= 0) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background mb-4 space-y-2 h-screen flex flex-col justify-center items-center">
        <p className="text-xl">There are no review. Be the first.</p>
        <Button
          onClick={() => router.push("/reviews/add")}
          className="mb-4 text-lg bg-blue-500"
        >
          Leave a review
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background mb-4">
      <ReviewSummary reviews={reviews} />
      <div>
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))}
      </div>
      {visibleReviews < reviews.length && (
        <Button onClick={loadMoreReviews} className="mt-4">
          Show More
        </Button>
      )}
    </div>
  );
}
