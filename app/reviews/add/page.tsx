"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useAppStore } from "@/app/store";
import { addReview } from "@/app/utils/firebase";
import { v4 as uuidv4 } from "uuid";
import { serverTimestamp } from "firebase/firestore";

export default function Component() {
  const { user, setReviews, reviews } = useAppStore();
  const [reviewState, setReviewState] = useState({
    name: "",
    jobTitle: "",
    rating: 0,
    review: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newReview = await addReview({
      id: uuidv4(),
      image: user ? user.photoURL : null,
      ...reviewState,
      replies: [],
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    if (newReview) {
      setReviews([newReview, ...reviews]);
      setReviewState({
        name: "",
        jobTitle: "",
        rating: 0,
        review: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Submit Your Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                required
                value={reviewState.name}
                onChange={(e) =>
                  setReviewState({ ...reviewState, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="Enter your job title"
                required
                value={reviewState.jobTitle}
                onChange={(e) =>
                  setReviewState({ ...reviewState, jobTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select
                required
                value={reviewState.rating.toString()}
                onValueChange={(selected) =>
                  setReviewState({ ...reviewState, rating: parseInt(selected) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem
                      key={rating}
                      value={rating.toString()}
                      className="hover:bg-gray-200 cursor-pointer"
                    >
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                placeholder="Write your review here..."
                value={reviewState.review}
                onChange={(e) =>
                  setReviewState({
                    ...reviewState,
                    review: e.target.value.slice(0, 200),
                  })
                }
                required
                className="h-32 bg-white"
              />
              <p className="text-sm text-muted-foreground text-right">
                {reviewState.review.length}/200 characters
              </p>
            </div>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
