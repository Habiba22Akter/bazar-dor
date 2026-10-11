"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import AuthSkeleton from "./AuthSkeleton";

function getErrorMessage(error, fallback) {
  const message =
    typeof error?.message === "string" &&
    error.message.trim()
      ? error.message
      : fallback;

  const details = [
    error?.code,
    error?.status
      ? `HTTP ${error.status}`
      : "",
  ].filter(Boolean);

  return details.length
    ? `${message} (${details.join(" · ")})`
    : message;
}

function GoogleIcon() {
  return (
    <span
      className="ba-google"
      aria-hidden="true"
    >
      G
    </span>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.31c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function AuthForm({ mode }) {
  const signup = mode === "signup";

  const router = useRouter();
  const searchParams = useSearchParams();

  const reason = searchParams.get("reason");
  const callbackError =
    searchParams.get("error");

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (reason === "protected") {
      toast.error(
        "এই পেজ দেখতে আগে সাইন ইন করুন।",
        { id: "auth-feedback" }
      );
    }

    if (callbackError) {
      toast.error(
        "সোশ্যাল লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
        { id: "auth-feedback" }
      );
    }
  }, [reason, callbackError]);

  useEffect(() => {
    if (session?.user) {
      router.replace("/");
    }
  }, [session, router]);

  function showError(message) {
    setError(message);

    toast.error(message, {
      id: "auth-feedback",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (busy) return;

    setError("");
    toast.dismiss("auth-feedback");

    const form = new FormData(
      event.currentTarget
    );

    const name = String(
      form.get("name") || ""
    ).trim();

    const email = String(
      form.get("email") || ""
    ).trim();

    const password = String(
      form.get("password") || ""
    );

    const confirm = String(
      form.get("confirm") || ""
    );

    if (signup && !name) {
      return showError("আপনার নাম লিখুন।");
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return showError("সঠিক ইমেইল লিখুন।");
    }

    if (!password) {
      return showError("পাসওয়ার্ড লিখুন।");
    }

    if (
      signup &&
      (
        password.length < 8 ||
        password.length > 128
      )
    ) {
      return showError(
        "পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের হতে হবে।"
      );
    }

    if (signup && password !== confirm) {
      return showError(
        "দুটি পাসওয়ার্ড মিলছে না।"
      );
    }

    setBusy("email");

    try {
      const result = signup
        ? await authClient.signUp.email({
            name,
            email,
            password,
          })
        : await authClient.signIn.email({
            email,
            password,
          });

      if (result.error) {
        showError(
          getErrorMessage(
            result.error,
            signup
              ? "অ্যাকাউন্ট তৈরি করা যায়নি।"
              : "সাইন ইন করা যায়নি।"
          )
        );

        return;
      }

      toast.success(
        signup
          ? "অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।"
          : "সাইন ইন সফল হয়েছে।",
        { id: "auth-feedback" }
      );

      router.push(
        signup ? "/sign-in" : "/"
      );

      router.refresh();
    } catch (cause) {
      showError(
        getErrorMessage(
          cause,
          "Auth server থেকে response পাওয়া যায়নি।"
        )
      );
    } finally {
      setBusy("");
    }
  }

  async function handleSocialLogin(provider) {
    if (busy) return;

    setError("");
    toast.dismiss("auth-feedback");
    setBusy(provider);

    try {
      const result =
        await authClient.signIn.social({
          provider,

          callbackURL: "/success",
          newUserCallbackURL: "/success",

          errorCallbackURL:
            "/sign-in?error=social_login",

          disableRedirect: true,
        });

      if (result.error) {
        showError(
          getErrorMessage(
            result.error,
            "সোশ্যাল লগইন শুরু করা যায়নি।"
          )
        );

        setBusy("");
        return;
      }

      if (!result.data?.url) {
        showError(
          "Auth server থেকে social login URL পাওয়া যায়নি।"
        );

        setBusy("");
        return;
      }

      window.location.assign(
        result.data.url
      );
    } catch (cause) {
      showError(
        getErrorMessage(
          cause,
          "সোশ্যাল লগইন শুরু করা যায়নি।"
        )
      );

      setBusy("");
    }
  }

  if (isPending || session?.user) {
    return <AuthSkeleton />;
  }

  return (
    <div className="ba-page">
      <div className="ba-shell">
        <header className="ba-heading">
          <h1>
            {signup
              ? "অ্যাকাউন্ট তৈরি করুন"
              : "সাইন ইন"}
          </h1>

          <p>
            {signup
              ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
              : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
          </p>
        </header>

        <div className="ba-card">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={Boolean(busy)}
          >
            <fieldset
              className="ba-fields"
              disabled={Boolean(busy)}
            >
              {signup && (
                <label
                  className="ba-field"
                  htmlFor="auth-name"
                >
                  <span>নাম</span>

                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="যেমন: রহিম উদ্দিন"
                    required
                  />
                </label>
              )}

              <label
                className="ba-field"
                htmlFor="auth-email"
              >
                <span>ইমেইল</span>

                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label
                className="ba-field"
                htmlFor="auth-password"
              >
                <span>পাসওয়ার্ড</span>

                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  autoComplete={
                    signup
                      ? "new-password"
                      : "current-password"
                  }
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  required
                />
              </label>

              {signup && (
                <label
                  className="ba-field"
                  htmlFor="auth-confirm"
                >
                  <span>
                    পাসওয়ার্ড নিশ্চিত করুন
                  </span>

                  <input
                    id="auth-confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="আবার লিখুন"
                    required
                  />
                </label>
              )}

              {error && (
                <p
                  className="ba-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="ba-primary"
                disabled={Boolean(busy)}
              >
                {busy === "email" ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    অপেক্ষা করুন…
                  </>
                ) : signup ? (
                  "অ্যাকাউন্ট তৈরি করুন"
                ) : (
                  "সাইন ইন"
                )}
              </button>
            </fieldset>
          </form>

          <div className="ba-divider">
            <span>অথবা</span>
          </div>

          <div className="ba-social-row">
            <button
              type="button"
              className="ba-social"
              disabled={Boolean(busy)}
              onClick={() =>
                handleSocialLogin("google")
              }
            >
              {busy === "google" ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <GoogleIcon />
              )}

              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type="button"
              className="ba-social"
              disabled={Boolean(busy)}
              onClick={() =>
                handleSocialLogin("github")
              }
            >
              {busy === "github" ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <GitHubIcon />
              )}

              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          <p className="ba-switch">
            {signup
              ? "অ্যাকাউন্ট আছে? "
              : "অ্যাকাউন্ট নেই? "}

            <Link
              href={
                signup
                  ? "/sign-in"
                  : "/sign-up"
              }
            >
              {signup
                ? "সাইন ইন করুন"
                : "সাইন আপ করুন"}
            </Link>
          </p>
        </div>

        <Link
          className="ba-home"
          href="/"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}