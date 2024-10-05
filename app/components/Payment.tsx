import React from "react";
import {
  createCheckoutSession,
  getPortalUrl,
} from "@/app/utils/stripe/stripePayment";
import usePremiumStatus from "@/app/utils/stripe/usePremiumStatus";
import { useAppStore } from "../store";
import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useSubscription } from "../utils/stripe/useSubscribtion";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function Payment() {
  const { user } = useAppStore();
  const { loading, premiumStatus } = usePremiumStatus(user);
  const { subscription } = useSubscription(user);
  const router = useRouter();

  const manageSubscription = async () => {
    if (!user) {
      console.log("user not found");
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

  if (loading) return <p>loading...</p>;

  return (
    <>
      {user && (
        <CardContent className="space-y-6">
          {!premiumStatus ? (
            <div className="flex flex-col items-start w-fit p-2 space-y-2">
              <span>you are not a premium user</span>
              <Button
                onClick={() => createCheckoutSession(user.uid)}
                className="bg-button-bg hover:bg-button-hover active:bg-button-active dark:bg-button-bg dark:hover:bg-button-hover dark:active:bg-button-active text-button-text"
              >
                Upgrade to premium!
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                subscription: {subscription?.role}
              </span>
              <span className="text-sm text-muted-foreground text-green-500">
                status: {subscription?.status}
              </span>
              <span className="text-xs text-muted-foreground">
                period start:{" "}
                {subscription?.current_period_start
                  ? moment(subscription.current_period_start.toDate()).format(
                      "MMMM Do YYYY"
                    )
                  : "N/A"}
              </span>
              <span className="text-xs text-muted-foreground">
                period end:{" "}
                {subscription?.current_period_end
                  ? moment(subscription.current_period_end.toDate()).format(
                      "MMMM Do YYYY"
                    )
                  : "N/A"}
              </span>
              {subscription?.cancel_at && (
                <span className="text-xs text-muted-foreground text-red-500">
                  subscription will be canceled on:{" "}
                  {subscription?.cancel_at
                    ? moment(subscription.cancel_at.toDate()).format(
                        "MMMM Do YYYY"
                      )
                    : "N/A"}
                </span>
              )}
              <Button
                className="px-6 py-2 mt-4 w-fit rounded-lg transition-colors dark:text-button-text bg-blue-500"
                onClick={manageSubscription}
              >
                Manage Subscription
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </>
  );
}
