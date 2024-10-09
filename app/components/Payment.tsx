import React, { useEffect, useState } from "react";
import {
  createCheckoutSession,
  getPortalUrl,
} from "@/app/utils/stripe/stripePayment";
import { useAppStore } from "../store";
import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useSubscription } from "../utils/stripe/useSubscribtion";
import moment from "moment";
import { useRouter } from "next/navigation";
import { deadlineDate, isPastCancelDate } from "../utils/helper";
import { checkIfFirstSubscription } from "../utils/firebase";

export default function Payment() {
  const { user } = useAppStore();
  const { subscription, loading, setSubscription, error } =
    useSubscription(user);
  const router = useRouter();
  const [canceling, setCanceling] = useState(false);
  const [isFirstSubscription, setIsFirstSubscription] = useState(false);

  useEffect(() => {
    if (subscription && user) {
      checkIfFirstSubscription(user.uid)
        .then((isFirst) => {
          setIsFirstSubscription(isFirst);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [subscription, user]);

  const manageSubscription = async () => {
    if (!user) {
      console.log("User not found");
      return;
    }

    try {
      const portalUrl = await getPortalUrl(user);
      router.push(portalUrl);
      console.log("Manage Subscription");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImmediateCancel = async () => {
    if (!user || !subscription) return;
    setCanceling(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cancelSubscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user?.uid,
            subscriptionId: subscription?.id,
          }),
        }
      );

      if (response.ok) {
        console.log("Subscription cancelled successfully", response);
        setSubscription({ ...subscription, status: "canceled" });
      } else {
        console.error("Failed to cancel subscription", response);
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {user && (
        <CardContent className="space-y-6">
          {!subscription || subscription.status !== "active" ? (
            <div className="flex flex-col items-start w-fit p-2 space-y-2">
              <span>You are not a Premium User</span>
              <Button
                onClick={() =>
                  createCheckoutSession(
                    user.uid,
                    process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_MONTHLY ||
                    ""
                  )
                }
                className="bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text"
              >
                Upgrade to Premium!
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Subscription: {subscription?.role}
              </span>
              <span className="text-sm text-muted-foreground text-green-500">
                Status: {subscription?.status}
              </span>
              <span className="text-xs text-muted-foreground">
                Period Start:{" "}
                {subscription?.current_period_start
                  ? moment(subscription.current_period_start.toDate()).format(
                    "MMMM Do YYYY"
                  )
                  : null}
              </span>
              <span className="text-xs text-muted-foreground">
                Period End:{" "}
                {subscription?.current_period_end
                  ? moment(subscription.current_period_end.toDate()).format(
                    "MMMM Do YYYY"
                  )
                  : null}
              </span>
              {subscription?.cancel_at && (
                <span className="text-xs text-muted-foreground text-red-500">
                  Subscription will be cancelled on:{" "}
                  {subscription?.cancel_at
                    ? moment(subscription.cancel_at.toDate()).format(
                      "MMMM Do YYYY"
                    )
                    : null}
                </span>
              )}
              {subscription && (
                <>
                  {!isFirstSubscription || isPastCancelDate(subscription) ? (
                    <Button
                      className="px-6 py-2 mt-4 w-fit rounded-lg transition-colors dark:text-button-text bg-blue-500"
                      onClick={manageSubscription}
                    >
                      Manage Subscription
                    </Button>
                  ) : (
                    <div className="flex flex-col">
                      <span className="mt-2 text-xs text-muted-foreground text-blue-400">
                        You can cancel your subscription before{" "}
                        {deadlineDate(subscription).toLocaleDateString()} and
                        you will not be charged.
                      </span>
                      <Button
                        className="px-6 py-2 mt-4 w-fit rounded-lg transition-colors dark:text-button-text bg-red-500"
                        onClick={handleImmediateCancel}
                      >
                        {canceling ? "Processing..." : "Cancel Subscription"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      )}
    </>
  );
}
