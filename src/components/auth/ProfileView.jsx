"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function ProfileView({
  user,
  edit = false,
}) {
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    if (busy) return;

    setBusy(true);

    try {
      const { error } =
        await authClient.signOut();

      if (error) {
        throw new Error(
          error.message ||
          "সাইন আউট করা যায়নি।"
        );
      }

      toast.success("সাইন আউট হয়েছে।");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "সাইন আউট করা যায়নি।"
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();

    if (busy) return;

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setBusy(true);

    try {
      const { error } =
        await authClient.updateUser({
          name: name.trim(),
        });

      if (error) {
        throw new Error(
          error.message ||
          "তথ্য আপডেট করা যায়নি।"
        );
      }

      toast.success("তথ্য আপডেট হয়েছে।");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "তথ্য আপডেট করা যায়নি।"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ba-profile-page">
      <div className="ba-profile-shell">
        <h1>
          {edit
            ? "তথ্য আপডেট করুন"
            : "আমার প্রোফাইল"}
        </h1>

        <p className="ba-profile-subtitle">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <div className="ba-profile-identity">
          {user.image ? (
            <Image
              unoptimized
              src={user.image}
              alt={user.name || "প্রোফাইল"}
              width={80}
              height={72}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="ba-profile-initial">
              {user.name?.slice(0, 1)}
            </span>
          )}

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <button
            className="ba-logout"
            type="button"
            disabled={busy}
            onClick={handleLogout}
          >
            সাইন আউট
          </button>
        </div>

        <section className="ba-profile-info">
          <h2>তথ্য</h2>

          {edit ? (
            <form onSubmit={handleUpdate}>
              <label
                className="ba-field"
                htmlFor="profile-name"
              >
                <span>নাম</span>

                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={busy}
                  autoComplete="name"
                />
              </label>

              <button
                type="submit"
                className="ba-primary"
                disabled={busy}
              >
                {busy
                  ? "অপেক্ষা করুন…"
                  : "আপডেট"}
              </button>
            </form>
          ) : (
            <>
              <label
                className="ba-field"
                htmlFor="profile-name"
              >
                <span>নাম</span>

                <input
                  id="profile-name"
                  value={user.name}
                  readOnly
                />
              </label>

              <Link
                className="ba-primary"
                href="/profile/update"
              >
                আপডেট
              </Link>
            </>
          )}
        </section>
      </div>
    </div>
  );
}