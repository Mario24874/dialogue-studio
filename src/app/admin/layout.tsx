import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import AdminSidebar from "./_sidebar";
import { Lock } from "lucide-react";

export const metadata = { title: "Admin — Italianto" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const admin = await isAdmin(userId);
  if (!admin) redirect("/");

  const user = await currentUser();
  const email =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <header className="bg-gray-900 text-white px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-green-400" />
          <span className="font-bold text-sm">Italianto Admin</span>
        </div>
        <span className="text-xs text-gray-400">{email}</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
