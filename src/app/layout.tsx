import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { League_Spartan } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { CustomSessionProvider } from "@/components/CustomSessionProvider";
import { auth } from "@/auth";

const robotoFont =  League_Spartan({
  weight: ["700"],
  subsets: [],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className="bg-white">
        <SessionProvider session={session}>
          <div className={robotoFont.className}>
            <Navbar />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
