import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ProvidersWrapper from "@/providers/ProvidersWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sync - Social Media for Developers",
  description: "Connect, share knowledge, and build the future.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-text">
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
