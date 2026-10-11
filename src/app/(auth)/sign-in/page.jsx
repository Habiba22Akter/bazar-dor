import { Suspense } from "react";

import AuthForm from "@/components/auth/AuthForm";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthForm mode="signin" />
    </Suspense>
  );
}