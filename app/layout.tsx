import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Make More Reviews",
  description: "Collect and manage customer reviews with ease. Boost your online presence with authentic customer feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        <main className="flex-1 p-5">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
