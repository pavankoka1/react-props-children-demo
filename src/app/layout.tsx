import { ClientLayout } from "@/components/ClientLayout/ClientLayout";
import { ConcentricGlow } from "@/components/ConcentricGlow/ConcentricGlow";
import { WaterBubbleBackground } from "@/components/WaterBubbleBackground/WaterBubbleBackground";
import { VercelMetrics } from "@/components/layout/VercelMetrics";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  GLOBAL_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo-config";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...GLOBAL_KEYWORDS],
  authors: [{ name: "Pavan (Koka)", url: siteUrl }],
  creator: "Pavan",
  publisher: SITE_NAME,
  category: "technology",
  classification: "Web development / React performance",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "en-US": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "React props vs children vs React.memo — re-render guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification
            ? { other: { "msvalidate.01": bingVerification } }
            : {}),
        },
      }
    : {}),
  icons: {
    icon: [{ url: "/icon", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  referrer: "origin-when-cross-origin",
  other: {
    "msapplication-TileColor": "#0a0a0f",
    "theme-color": "#0a0a0f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} relative min-h-screen overflow-x-hidden bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] antialiased`}
      >
        <JsonLd />
        <ConcentricGlow />
        <WaterBubbleBackground />
        <ClientLayout>{children}</ClientLayout>
        <VercelMetrics />
      </body>
    </html>
  );
}
