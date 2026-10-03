import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Warp — AI incident response for critical procurement",
    template: "%s · Warp",
  },
  description:
    "When a critical supplier fails, the AI does the four hours of investigation — reads the contracts and certificates, searches the live web, cross-checks every claim, scores the alternatives. Then it stops. A human keeps the pen.",
  applicationName: "Warp",
  openGraph: {
    title: "Warp — AI incident response for critical procurement",
    description: "The AI does the four hours of investigation. A human keeps the pen.",
    url: "/",
    siteName: "Warp",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warp — AI incident response for critical procurement",
    description: "The AI does the four hours of investigation. A human keeps the pen.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
