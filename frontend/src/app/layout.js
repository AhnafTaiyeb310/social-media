import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProviders from "@/providers/queryProvider";
import AuthProvider from "@/providers/auth-provider"; // Our new wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Social Media Aura | 2026 SaaS",
  description: "Modern social media built with Next.js 15+",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProviders>
          <AuthProvider>
            {children} {/* ✅ Pages stay as Server Components! */}
          </AuthProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
