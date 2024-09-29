import { Review } from "@/app/utils/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { StarRating } from "./StartRating";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Textarea } from "@/app/components/ui/textarea";
import { addReply } from "@/app/utils/firebase";
import { useAppStore } from "@/app/store";

export const ReviewItem = ({ review }: { review: Review }) => {
  const { user, reviews, setReviews } = useAppStore();
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && user?.displayName) {
      const newReply = await addReply(review, {
        name: user.displayName,
        reply: replyText,
        updatedAt: Date.now().toLocaleString(),
        createdAt: Date.now().toLocaleString(),
      });

      if (newReply) {
        const newReviews = reviews.map((r) => {
          if (r.id === review.id) {
            const updatedreview = {
              ...r,
              replies: [...r.replies, newReply],
            } as Review;
            return updatedreview;
          }
          return r;
        });
        setReviews(newReviews);
        setIsReplyFormOpen(false);
        setReplyText("");
      }
    }
  };

  return (
    <div className="mb-8 border-b pb-8">
      <div className="flex items-start mb-4">
        {user && user.role === "admin" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
            className="mr-4"
          >
            Reply{" "}
            {isReplyFormOpen ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        )}
        <Avatar className="w-12 h-12 mr-4">
          {review?.image ? (
            <AvatarImage src={review.image} alt={review.name} />
          ) : (
            <AvatarFallback>{review.name[0]}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold">{review.name}</h3>
              <p className="text-sm text-gray-500">{review.jobTitle}</p>
            </div>
            <StarRating rating={review.rating} />
          </div>
          <p className="mb-4">{review.review}</p>
        </div>
      </div>
      {isReplyFormOpen && (
        <form
          onSubmit={handleReplySubmit}
          className="mb-4 ml-16 transition-all duration-300 ease-in-out"
        >
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply here..."
            maxLength={200}
            className="mb-2"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {replyText.length}/200 characters
            </span>
            <Button
              type="submit"
              disabled={replyText.trim().length === 0}
              className="bg-green-500"
            >
              Submit
            </Button>
          </div>
        </form>
      )}
      {review.replies.map((reply, index) => (
        <div key={index} className="bg-card p-4 rounded-lg mb-4 ml-16">
          <h4 className="font-bold mb-2">{reply.name}</h4>
          <p>{reply.reply}</p>
        </div>
      ))}
    </div>
  );
};
