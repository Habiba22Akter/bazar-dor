import { Suspense } from "react";

import AuthForm from "@/components/auth/AuthForm";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}