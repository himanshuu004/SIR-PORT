"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function GoogleAnalytics({ gaId }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;
    window.gtag("config", gaId, { page_path: pathname });
  }, [pathname, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `}</Script>
    </>
  );
}
