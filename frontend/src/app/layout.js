import ProvidersWrapper from "@/providers/ProvidersWrapper";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from 'next/script';
import PrelineScriptWrapper from "../components/PrelineScriptWrapper";
import SearchModal from "../components/navigation/SearchModal";
import "./globals.css";

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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased light`}
    >
      <head>
        <Script id="1"
          dangerouslySetInnerHTML={{
            __html: `
            const html = document.querySelector('html');
            const isLightOrAuto = localStorage.getItem('hs_theme') === 'light' || (localStorage.getItem('hs_theme') === 'auto' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
            const isDarkOrAuto = localStorage.getItem('hs_theme') === 'dark' || (localStorage.getItem('hs_theme') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

            if (isLightOrAuto && html.classList.contains('dark')) html.classList.remove('dark');
            else if (isDarkOrAuto && html.classList.contains('light')) html.classList.remove('light');
            else if (isDarkOrAuto && !html.classList.contains('dark')) html.classList.add('dark');
            else if (isLightOrAuto && !html.classList.contains('light')) html.classList.add('light');
          `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-layer text-text">
        <ProvidersWrapper>
            {children}
            <SearchModal />
        </ProvidersWrapper>
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
