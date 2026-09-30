"use client";

import { FormEvent, useState } from "react";

export function NewsletterCTA({
  variant = "default",
}: {
  variant?: "default" | "compact" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    // Front-end capture ready for ESP wiring (Kit, Brevo, etc.)
    setStatus("ok");
    setEmail("");
  }

  const dark = variant === "dark";
  const compact = variant === "compact";

  return (
    <section
      className={
        dark
          ? "rounded-2xl bg-gradient-to-br from-hero-from via-hero-mid to-hero-to p-8 text-white"
          : compact
            ? "border-t border-line pt-8"
            : "rounded-2xl border border-line bg-surface p-8"
      }
    >
      <h2
        className={`font-display font-bold tracking-tight ${
          compact ? "text-lg text-ink" : "text-2xl"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        Weekly digital marketing brief
      </h2>
      <p
        className={`mt-2 max-w-xl text-sm leading-relaxed ${
          dark ? "text-white/75" : "text-muted"
        }`}
      >
        Tool picks, ranking tactics, and monetisation notes—built for marketers
        growing traffic and revenue.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder="you@company.com"
          className={`w-full rounded-lg border px-4 py-3 text-sm outline-none sm:max-w-xs ${
            dark
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-glow"
              : "border-line bg-white text-ink placeholder:text-muted/70 focus:border-accent"
          }`}
        />
        <button
          type="submit"
          className={`rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
            dark
              ? "bg-glow text-ink hover:bg-white"
              : "bg-accent text-white hover:bg-accent-deep"
          }`}
        >
          Get the brief
        </button>
      </form>
      {status === "ok" && (
        <p className={`mt-3 text-sm ${dark ? "text-glow" : "text-accent"}`}>
          Thanks—you&apos;re on the list.
        </p>
      )}
      {status === "error" && (
        <p className={`mt-3 text-sm ${dark ? "text-white/80" : "text-red-700"}`}>
          Enter a valid email.
        </p>
      )}
    </section>
  );
}
