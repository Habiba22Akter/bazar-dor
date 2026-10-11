"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const menuRef = useRef(null);

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    if (busy) return;

    setBusy(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(
          result.error.message ||
            "সাইন আউট করা যায়নি।"
        );
      }

      menuRef.current?.removeAttribute("open");

      toast.success(
        "সাইন আউট হয়েছে।",
        { id: "auth-feedback" }
      );

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "সাইন আউট করা যায়নি।",
        { id: "auth-feedback" }
      );
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return (
      <span
        className="skeleton h-10 w-32"
        role="status"
        aria-label="অ্যাকাউন্ট লোড হচ্ছে"
      />
    );
  }

  if (!session?.user) {
    return (
      <>
        <Link
          href="/sign-in"
          className="btn btn-ghost btn-sm"
        >
          সাইন ইন
        </Link>

        <Link
          href="/sign-up"
          className="btn btn-primary btn-sm"
        >
          সাইন আপ
        </Link>
      </>
    );
  }

  const user = session.user;

  return (
    <details
      ref={menuRef}
      className="ba-user-menu"
    >
      <summary>
        {user.image ? (
          <Image
            unoptimized
            src={user.image}
            alt=""
            width={36}
            height={36}
            className="ba-user-avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="ba-user-avatar">
            {user.name?.slice(0, 1)}
          </span>
        )}

        <span>
          {user.name?.split(" ")[0]}
        </span>

        <span aria-hidden="true">⌄</span>
      </summary>

      <div className="ba-user-dropdown">
        <strong>{user.name}</strong>
        <p>{user.email}</p>

        <Link
          href="/profile"
          onClick={() =>
            menuRef.current?.removeAttribute(
              "open"
            )
          }
        >
          আমার প্রোফাইল
        </Link>

        <button
          type="button"
          disabled={busy}
          onClick={handleLogout}
        >
          {busy
            ? "অপেক্ষা করুন…"
            : "সাইন আউট"}
        </button>
      </div>
    </details>
  );
}