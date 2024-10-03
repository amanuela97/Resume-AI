import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Stripe | null;

const initializeStripe = async () => {
  if (!stripePromise) {
    console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
      stripePromise = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
      );
    } else {
      console.error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
    }
  }
  return stripePromise as Stripe;
};

export default initializeStripe;
