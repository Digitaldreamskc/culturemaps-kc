import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CultureMap KC",
  description: "Mapping Kansas City's cultural landmarks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="h-16 bg-white border-b border-gray-200">
          <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">CultureMap KC</h1>
            <nav className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Map</a>
              <a href="/submit" className="text-gray-600 hover:text-gray-900">Submit</a>
              <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
