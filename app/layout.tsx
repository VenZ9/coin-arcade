import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ArcadeProvider } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { AchievementToast } from "@/components/AchievementToast";

export const metadata: Metadata = {
  title: "Coin Arcade",
  description:
    "A mobile-first arcade of short minigames played with a fictional in-app currency called Coins.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ArcadeProvider>
          <AchievementToast />
          <main className="mx-auto min-h-screen w-full max-w-app px-4 pb-24 pt-5">
            {children}
          </main>
          <BottomNav />
        </ArcadeProvider>
      </body>
    </html>
  );
}
