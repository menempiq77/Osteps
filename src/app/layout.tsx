import type { Metadata, Viewport } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { PwaProvider } from "@/components/pwa/PwaProvider";
import { Providers } from "./provider";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Osteps",
  title: {
    default: "Osteps Educational Platform",
    template: "%s | Osteps",
  },
  description:
    "Learning, assessment, communication, rewards, and school management in one educational platform.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Osteps",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/icons/osteps-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/osteps-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#272736",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <PwaProvider>
          <Providers>{children}</Providers>
        </PwaProvider>
      </body>
    </html>
  );
}
