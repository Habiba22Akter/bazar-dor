import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import ProfileView from "@/components/auth/ProfileView";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

async function UpdateContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?reason=protected");
  }

  return (
    <ProfileView
      key={session.user.name}
      user={session.user}
      edit
    />
  );
}

export default function UpdateProfilePage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <UpdateContent />
    </Suspense>
  );
}