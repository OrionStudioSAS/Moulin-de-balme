"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useBoI18n } from "@/lib/bo/i18n/client";
import { BrandMark } from "@/components/bo/shell/Sidebar";
import { Button } from "@/components/bo/ui/Button";
import { Input, Label } from "@/components/bo/ui/Field";

export default function LoginForm() {
  const router = useRouter();
  const { t } = useBoI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await createClient().auth.signInWithPassword({ email, password });

    if (err) {
      // Message générique : on ne dit jamais lequel des deux champs est faux
      setError(err.status === 429 ? t("login.tooMany") : t("login.error"));
      setPassword("");
      setLoading(false);
      passwordRef.current?.focus();
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[380px]" noValidate>
      <BrandMark size={40} />
      <h1 className="mt-6 font-bo-serif text-bo-display-s font-normal text-bo-ink">{t("login.title")}</h1>
      <p className="mt-1 text-bo-body text-bo-ink-2">
        <span className="hidden lg:inline">{t("login.subtitle")}</span>
        <span className="lg:hidden">{t("login.mobileSubtitle")}</span>
      </p>

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-bo-md border border-bo-line-danger/30 bg-bo-danger-bg px-3 py-2.5 text-bo-body text-bo-ink-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">{t("login.email")}</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            autoFocus
            icon={<Mail />}
            placeholder={t("login.emailPlaceholder")}
            value={email}
            invalid={!!error}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">{t("login.password")}</Label>
          <Input
            ref={passwordRef}
            id="password"
            type="password"
            autoComplete="current-password"
            required
            icon={<Lock />}
            value={password}
            invalid={!!error}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" loading={loading} className="mt-6 h-12 w-full lg:h-10">
        {loading ? t("login.submitting") : t("login.submit")}
      </Button>

      <p className="mt-5 text-bo-small text-bo-ink-3">{t("login.restricted")}</p>
    </form>
  );
}
