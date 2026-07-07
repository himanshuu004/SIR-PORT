import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { headers } from "next/headers";
import { readFileSync } from "fs";
import { join } from "path";
import "./globals.css";
import { generateCSSVars } from "../lib/theme";
import { MaintenanceUI } from "./maintenance/page";
import { GoogleAnalytics } from "../components/GoogleAnalytics";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://basavapurushottam.com"),

  title: {
    default: "Dr. B.V.R.C. Purushottam — AI, Governance & Philosophy",
    template: "%s — Dr. B.V.R.C. Purushottam",
  },
  description:
    "A civil servant's notebook on AI, philosophy of mind, and the art of governing 1.4 billion people.",

  keywords: [
    "IAS officer", "AI governance", "Bhagavad Gita", "Yoga Sutras",
    "philosophy of mind", "machine learning", "civil services India",
    "Basava Purushottam", "Uttarakhand IAS", "GovTech",
  ],
  authors: [{ name: "Dr. B.V.R.C. Purushottam", url: "https://basavapurushottam.com/about" }],
  creator: "Dr. B.V.R.C. Purushottam",
  publisher: "Dr. B.V.R.C. Purushottam",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://basavapurushottam.com",
    siteName: "Dr. B.V.R.C. Purushottam",
    title: "Dr. B.V.R.C. Purushottam — AI, Governance & Philosophy",
    description:
      "A civil servant's notebook on AI, philosophy of mind, and the art of governing 1.4 billion people.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Dr. B.V.R.C. Purushottam" }],
  },

  twitter: {
    card: "summary_large_image",
    site: "@basava_ias",
    creator: "@basava_ias",
    title: "Dr. B.V.R.C. Purushottam — AI, Governance & Philosophy",
    description:
      "A civil servant's notebook on AI, philosophy of mind, and the art of governing 1.4 billion people.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://basavapurushottam.com",
    types: {
      "application/rss+xml": "https://basavapurushottam.com/feed.xml",
    },
  },
};

// themeStyle is generated dynamically per-request using overrides from site-config

function getSiteConfig() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "site-config.json"), "utf8"));
  } catch {
    return { maintenanceMode: false, theme: {} };
  }
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const config = getSiteConfig();
  const themeStyle = `:root { ${generateCSSVars(config.theme ?? {})} }`;

  // Check maintenance mode — bypass for admin, api, and maintenance routes
  const isProtected = !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/maintenance");

  if (isProtected) {
    if (config.maintenanceMode) {
      return (
        <html lang="en" data-scroll-behavior="smooth" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
          <head>
            <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
          </head>
          <body>
            <MaintenanceUI config={config} />
            <GoogleAnalytics gaId={config.gaId} />
          </body>
        </html>
      );
    }
  }

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body>
        {children}
        <GoogleAnalytics gaId={config.gaId} />
      </body>
    </html>
  );
}
