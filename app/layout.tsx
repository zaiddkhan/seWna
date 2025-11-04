import type { Metadata } from "next";
import { Lexend, Pacifico, Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SEWNA - Connect with Independent Fashion Designers",
  description: "SEWNA is a platform that helps people connect with independent fashion designers to create custom outfits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${pacifico.variable} ${poppins.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
