import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const robotoFont =  Roboto({
  weight: ["500"],
  subsets: [],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <html lang="en">
      <body className="bg-gradient-to-b scroll-smooth from-[#3795BD] min-h-screen">
        <SessionProvider>
          <div className={robotoFont.className}>
            <Navbar />
            {children}
          </div>
        </SessionProvider>
        <Toaster/>
      </body>
    </html>
  );
}
