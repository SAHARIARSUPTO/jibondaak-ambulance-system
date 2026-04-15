import "./globals.css";
import { Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "JibonDaak - Emergency Ambulance Service",
  description:
    "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${cormorant.variable} antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
