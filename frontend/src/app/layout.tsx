import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PageTransition from "@/components/PageTransition";
import { BottomNavbar } from "@/components/layout/BottomNavbar";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Leituri | A sua leitura em movimento",
  description: "Conecte-se, debata e gamifique sua jornada literária.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-mesh min-h-screen flex flex-col transition-colors duration-500 font-sans">
        <Providers>
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 w-full pt-20">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          {/* Mobile Navigation */}
          <BottomNavbar />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
