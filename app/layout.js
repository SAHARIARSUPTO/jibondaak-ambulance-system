import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import ConditionalLayout from "./components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://jibondaak.com"), // 👈 ADD THIS

  title: "JibonDaak - Emergency Ambulance Service",
  description:
    "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/image1.png",
  },

  openGraph: {
    title: "JibonDaak - Emergency Ambulance Service",
    description:
      "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care",
    url: "https://jibondaak.com",
    siteName: "JibonDaak",
    images: [
      {
        url: "/image1.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JibonDaak - Emergency Ambulance Service",
    description:
      "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care",
    images: ["/image1.png"],
  },

  openGraph: {
    title: "JibonDaak - Emergency Ambulance Service",
    description:
      "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care",
    url: "https://jibondaak.com",
    siteName: "JibonDaak",
    images: [
      {
        url: "/image1.png", // 👈 must exist in /public
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JibonDaak - Emergency Ambulance Service",
    description:
      "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care",
    images: ["/image1.png"], // 👈 FIXED (was jpg)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-white text-gray-900`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
