import type React from "react";
import "@/styles/globals.css";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as SonnerToaster } from "sonner";
import Script from "next/script";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title:
    "MeshGenX | Convert SVG to 3D Models | Free Online SVG to 3D Converter",
  description:
    "Transform your SVG logos and icons into stunning 3D models instantly. Free online SVG to 3D converter with professional materials, real-time preview, and GLB export. No 3D experience required - perfect for designers, developers, and creators.",
  authors: [
    { name: "Aditya Yaduvanshi", url: "https://adityayads.vercel.app" },
  ],
  creator: "Aditya Yaduvanshi",
  publisher: "MeshGenX",
  keywords: [
    "SVG to 3D converter",
    "SVG to 3D model",
    "convert SVG to 3D",
    "3D model generator",
    "SVG 3D converter online",
    "free SVG to 3D",
    "logo to 3D model",
    "icon to 3D model",
    "GLB export",
    "GLTF converter",
    "3D web models",
    "vector to 3D",
    "online 3D converter",
    "3D model maker",
    "SVG extruder",
    "3D logo generator",
  ],
  icons: {
    icon: [
      { media: "(prefers-color-scheme: light)", url: "/logo_light.svg" },
      { media: "(prefers-color-scheme: dark)", url: "/logo_dark.svg" },
    ],
  },
  openGraph: {
    title: "MeshGenX | Transform Your Vectors in a New Dimension",
    description: "A super simple tool to convert SVG logos to 3D models",
    url: "https://meshgenx.vercel.app/",
    siteName: "MeshGenX | Transform Your Vectors in a New Dimension",
    images: [
      {
        url: "/opengraph-image-v1.png",
        width: 1200,
        height: 675,
        alt: "MeshGenX - Transform Your Vectors in a New Dimension",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeshGenx | Transform Your Vectors in a New Dimension",
    description: "A super simple tool to convert SVG logos to 3D models",
    images: ["/twitter-image-v1.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://cloud.umami.is/script.js"
        defer
        data-website-id="52212c28-1b6d-4bf4-b209-2438c258efcb"
      />
      <body className={cn(instrumentSans.className, instrumentSerif.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Analytics />
          <SonnerToaster
            position="top-center"
            richColors
            closeButton
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
