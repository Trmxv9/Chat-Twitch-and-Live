import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Twitch Chat, video Live - SrTermax Team - Next js, Tailwind CSS",
  description:
    "Twitch Chat, video Live - SrTermax Team - Next js, Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="https://avatars.githubusercontent.com/u/144570510"
          type="image/x-icon"
        />
        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
