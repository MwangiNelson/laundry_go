import type { Metadata } from "next";
import { Geist, Geist_Mono, Marck_Script, Manrope } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/components/context/auth_provider";
import TanstackProvider from "@/lib/tanstack";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const marckScript = Marck_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marck-script",
});

const manrope = Manrope({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Laundry Go Mart",
    default: "Laundry Go Mart",
  },
  description: "Laundry Go Mart Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}
        ${marckScript.variable} ${manrope.variable} bg-background
        font-manrope
          
          antialiased`}
      >
        <TanstackProvider>
          <AuthContextProvider>
            <TanstackProvider>
              {children}
              <Toaster />
            </TanstackProvider>
          </AuthContextProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
