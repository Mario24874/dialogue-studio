import { redirect } from "next/navigation";

// Payments are handled centrally at italianto.com.
// Redirect users there so they can subscribe.
export default function SubscribePage() {
  redirect("https://italianto.com/precios");
}
