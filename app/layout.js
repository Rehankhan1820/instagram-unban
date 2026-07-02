import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Instagram Account Recovery – Get Your Disabled Account Back",
    template: "%s | Instagram Recovery",
  },
  description:
    "Recover your disabled Instagram account quickly and securely. Trusted by thousands. Start your recovery process now.",
  keywords: [
    "Instagram recovery",
    "account disabled",
    "Instagram unban",
    "recover Instagram",
    "Instagram appeal",
    "disabled account help",
  ],
  authors: [{ name: "Instagram Recovery Team" }],
  openGraph: {
    title: "Instagram Account Recovery – Get Your Disabled Account Back",
    description:
      "Recover your disabled Instagram account quickly and securely. Trusted by thousands. Start your recovery process now.",
    url: "https://yourdomain.com/recovery",
    siteName: "Instagram Recovery",
    images: [
      {
        url: "/og-image.png", // replace with your actual OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Account Recovery – Get Your Disabled Account Back",
    description:
      "Recover your disabled Instagram account quickly and securely. Trusted by thousands. Start your recovery process now.",
    images: ["/og-image.png"], // replace with your actual image
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}