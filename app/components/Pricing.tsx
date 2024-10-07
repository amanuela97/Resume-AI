import { useState } from "react";
import { Switch } from "@/app/components/ui/switch";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Check } from "lucide-react";
import { pricingData } from "@/app/utils/constants";
import { PricingPlan } from "../utils/types";
import { useRouter } from "next/navigation";
import { useAppStore } from "../store";
import { toast } from "react-toastify";
import { createCheckoutSession } from "../utils/stripe/stripePayment";

export default function PricingSection() {
  const { user } = useAppStore();
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);

  const handleOnClick = async (plan: PricingPlan) => {
    if (!user?.uid) {
      return toast.info("You must be logged in first");
    }
    if (plan.name === "Free") {
      router.push("/build");
    } else if (plan.name === "Premium") {
      if (isYearly) {
        createCheckoutSession(user.uid, plan.price.yearly.id);
      } else {
        createCheckoutSession(user.uid, plan.price.monthly.id);
      }
    }
  };

  return (
    <section className="py-40 px-8 max-w-6xl mx-auto mb-2">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Simple, transparent pricing
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Choose the plan that's right for you
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <span className="text-sm font-medium">Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:dark:bg-white data-[state=unchecked]:bg-black"
            />
            <span className="text-sm font-medium">Yearly</span>
          </div>
          <div className="mx-auto grid gap-6 items-start max-w-5xl grid-cols-1 md:grid-cols-2 lg:gap-12">
            {Object.entries(pricingData).map(([key, plan]) => (
              <Card key={key} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.name === "Free" ? (
                      "€0 / month"
                    ) : (
                      <>
                        €
                        {isYearly
                          ? plan.price.yearly.amount
                          : plan.price.monthly.amount}{" "}
                        / {isYearly ? "year" : "month"}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => handleOnClick(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
