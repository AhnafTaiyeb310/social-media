import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProviders from "@/providers/queryProvider";
import AuthProvider from "@/providers/authProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <AuthProvider>
            <GoogleOAuthProvider clientId="829487265928-efrmcuh6l185o102f4576eoqmv7dbfdh.apps.googleusercontent.com">
              {children}
            </GoogleOAuthProvider>
          </AuthProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
