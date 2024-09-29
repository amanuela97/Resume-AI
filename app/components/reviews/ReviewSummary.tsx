import { Review } from "@/app/utils/types";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const ReviewSummary = ({ reviews }: { reviews: Review[] }) => {
  const router = useRouter();
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

  return (
    <div className="mb-8 p-4">
      <div className="flex flex-row justify-between items-center px-2">
        <h2 className="text-3xl font-bold mb-4">Reviews</h2>
        <Button
          onClick={() => router.push("/reviews/add")}
          className="mb-4 text-lg bg-blue-500"
        >
          Leave a review
        </Button>
      </div>
      <div className="flex items-center mb-4">
        <span className="text-4xl font-bold mr-2">
          {averageRating.toFixed(2)}
        </span>
        <span className="text-xl">out of 5</span>
      </div>
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = reviews.filter(
          (review) => review.rating === stars
        ).length;
        return (
          <div key={stars} className="flex items-center mb-2">
            <span className="w-4 mr-2">{stars}</span>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
            <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
              <div
                className="bg-yellow-400 h-2.5 rounded-full"
                style={{ width: `${(count / totalReviews) * 100}%` }}
              ></div>
            </div>
            <span>{count} reviews</span>
          </div>
        );
      })}
    </div>
  );
};
