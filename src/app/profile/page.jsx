import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import ProfileView from "@/components/auth/ProfileView";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

async function ProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?reason=protected");
  }

  return (
    <ProfileView
      user={session.user}
      edit={false}
    />
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}