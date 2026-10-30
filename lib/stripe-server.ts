import "server-only";
import Stripe from "stripe";
export function getTestStripe() {
  const key = process.env.STRIPE_TEST_SECRET_KEY;
  if (!key || !/^(sk|rk)_test_/.test(key)) throw new Error("Stripe test secret is not configured.");
  return new Stripe(key, {timeout: 15000, maxNetworkRetries: 1});
}
