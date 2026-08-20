import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { AskAiPanel } from "@/components/layout/AskAiPanel";
import { AskAiProvider } from "@/components/layout/AskAiProvider";
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
  title: "Flight",
  description: "Flight management CRM",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AskAiProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            {/* 54px content gutters, 44px top offset — from the Figma frames */}
            <main className="min-w-0 flex-1 px-13.5 pt-11 pb-13.5">{children}</main>
            <AskAiPanel />
          </div>
        </AskAiProvider>
      </body>
    </html>
  );
}
