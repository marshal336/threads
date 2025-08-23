import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import '../globals.css'


export const metadata = {
  title: "Threads",
  description: "Next,js",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="eu">
        <body className={`${inter.className} bg-black text-white`}>
          <div className="w-full flex justify-center min-h-screen items-center">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
