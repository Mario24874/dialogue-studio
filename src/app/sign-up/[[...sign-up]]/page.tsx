import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Header from "@/components/layout/header";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-italianto-50 dark:bg-slate-900">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={48} height={48} className="rounded-xl" />
            <span className="text-2xl font-bold text-italianto-800 dark:text-italianto-400">Italianto</span>
          </div>
          <SignUp />
        </div>
      </div>
    </div>
  );
}
