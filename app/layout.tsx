import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { GlobalStates } from "./context/GlobalContext";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "SyncPaste",
  description:
    "A minimal, fast clipboard sharing tool using session codes. Paste once, access anywhere.",
  keywords:
    "clipboard sharing, sync clipboard, paste tool, real-time clipboard, no login, cross-platform copy paste tool, clipboard manager online, open source app",
  openGraph: {
    title: "SyncPaste",
    description:
      "Instantly sync your clipboard across devices with a session code.",
    url: "https://syncpaste.vercel.app",
    siteName: "SyncPaste",
  },
  type: "website",

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-900`}>
        <Navbar />
          <GlobalStates>
            {children}
          </GlobalStates>
        <Footer />
      </body>
    </html>
  );
}
