"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

export default function SuccessPage() {
  const router = useRouter();

  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      toast.success(
        "সাইন ইন সফল হয়েছে।",
        { id: "auth-feedback" }
      );

      router.replace("/");
      router.refresh();
    } else {
      toast.error(
        error?.message ||
          "সাইন ইন সম্পন্ন হয়নি।",
        { id: "auth-feedback" }
      );

      router.replace("/sign-in");
    }
  }, [session, isPending, error, router]);

  return <AuthSkeleton />;
}