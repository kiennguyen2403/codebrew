import { Geist } from "next/font/google";
import PageLayout from "@/components/common/PageLayout";
import "@/styles/globals.css"; // Updated the import path

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Urbanteria",
  description: "a digital space for urban farmers to connect and grow",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
