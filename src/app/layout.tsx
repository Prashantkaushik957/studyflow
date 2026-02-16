import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyFlow — AI-Powered Productivity & Study Management",
  description: "Comprehensive AI-powered daily task manager and study tracker with intelligent scheduling, analytics, and adaptive learning.",
  keywords: "productivity, study planner, task manager, UPSC, exam preparation, pomodoro, habit tracker, AI scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
