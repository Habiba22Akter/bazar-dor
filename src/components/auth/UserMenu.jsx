"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 8 3 13l5 5" />
      <path d="M3 13h12a5 5 0 0 0 0-10" />
    </svg>
  );
}

export default function UserMenu() {
  const router = useRouter();
  const menuRef = useRef(null);
  const { data: session, isPending } = authClient.useSession();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      const menu = menuRef.current;

      if (menu && !menu.contains(event.target)) {
        menu.removeAttribute("open");
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  function closeMenu() {
    menuRef.current?.removeAttribute("open");
  }

  async function handleLogout() {
    if (busy) return;

    setBusy(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(
          result.error.message || "সাইন আউট করা যায়নি।"
        );
      }

      closeMenu();

      toast.success("সাইন আউট হয়েছে।", {
        id: "auth-feedback",
      });

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
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
    >
      <summary aria-label="অ্যাকাউন্ট মেনু">
        {user.image ? (
          <Image
            unoptimized
            src={user.image}
            alt=""
            width={40}
            height={40}
            className="ba-user-avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="ba-user-avatar">
            {user.name?.slice(0, 1) || "U"}
          </span>
        )}

        <span className="ba-user-short-name">
          {user.name?.trim().split(/\s+/)[0] || "প্রোফাইল"}
        </span>

        <svg
          className="ba-user-caret"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          aria-hidden="true"
        >
          <path d="M2 3h4L4 6Z" fill="currentColor" />
        </svg>
      </summary>

      <div className="ba-user-dropdown">
        <div className="ba-user-info">
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>

        <Link
          href="/profile"
          className="ba-user-action"
          onClick={closeMenu}
        >
          <span className="ba-user-action-icon" aria-hidden="true">
            👤
          </span>
          <span>আমার প্রোফাইল</span>
        </Link>

        <button
          type="button"
          className="ba-user-action ba-user-signout"
          disabled={busy}
          onClick={handleLogout}
        >
          <LogoutIcon />
          <span>
            {busy ? "অপেক্ষা করুন…" : "সাইন আউট"}
          </span>
        </button>
      </div>
    </details>
  );
}