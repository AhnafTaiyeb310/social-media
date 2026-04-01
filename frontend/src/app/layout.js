import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ProvidersWrapper from "@/providers/ProvidersWrapper";
import PrelineScriptWrapper from "@/components/PrelineScriptWrapper";
import SearchModal from "@/components/navigation/SearchModal"

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
        <script
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
      <body className="min-h-full flex flex-col font-sans bg-background text-text">
        <ProvidersWrapper>{children}</ProvidersWrapper>
        <PrelineScriptWrapper />
        <SearchModal />
      </body>
    </html>
  );
}
