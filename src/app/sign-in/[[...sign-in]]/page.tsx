import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-italianto-50 px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={48} height={48} className="rounded-xl" />
          <span className="text-2xl font-bold text-italianto-800">Italianto</span>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
