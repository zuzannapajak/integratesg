"use client";

import { Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  slug: string;
  className?: string;
};

export default function CertificateDownloadButton({ slug, className }: Props) {
  const t = useTranslations("Protected.CertificateDownload");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/curriculum/${slug}/certificate`, {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;

        console.error(
          "[curriculum/certificate] generation failed",
          payload?.error ?? response.status,
        );
        setError(t("errors.unavailable"));
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `integratesg-certificate-${slug}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (downloadError) {
      console.error(downloadError);

      if (downloadError instanceof DOMException && downloadError.name === "AbortError") {
        setError(t("errors.timeout"));
      } else {
        setError(t("errors.unavailable"));
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isLoading}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-2xl bg-[#0b9c72] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#08785a] disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {isLoading ? (
          <Loader2 className="h-4.5 w-4.5 animate-spin" />
        ) : (
          <Download className="h-4.5 w-4.5" />
        )}
        {isLoading ? t("generating") : t("download")}
      </button>

      {error ? (
        <p className="text-sm text-rose-600" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
