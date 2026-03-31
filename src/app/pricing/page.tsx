import { redirect } from "next/navigation";

// Pricing is handled centrally at italianto.com
export default function PricingPage() {
  redirect("https://italianto.com/precios");
}
