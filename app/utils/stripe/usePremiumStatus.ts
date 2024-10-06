import { useState, useEffect } from "react";
import { isUserPremium } from "../firebase";
import { CustomUser } from "../types";

export default function usePremiumStatus(user: CustomUser | null) {
  const [premiumStatus, setPremiumStatus] = useState<boolean | null>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (user) {
      const checkPremiumStatus = async function () {
        setLoading(true);
        setPremiumStatus(await isUserPremium());
        setLoading(false);
      };
      checkPremiumStatus();
    }
  }, [user]);

  return { premiumStatus, loading, setPremiumStatus };
}
