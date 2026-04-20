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
  title: "JibonDaak - Emergency Ambulance Service",
  description:
    "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>JibonDaak - Emergency Ambulance Service</title>
        <meta
          name="description"
          content="24/7 Emergency ambulance service across Bangladesh. Quick response, professional care."
        />
        {/* Favicon for all browsers */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/image1.png" />
        <link rel="apple-touch-icon" href="/image1.png" />
        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content="JibonDaak - Emergency Ambulance Service"
        />
        <meta
          property="og:description"
          content="24/7 Emergency ambulance service across Bangladesh. Quick response, professional care."
        />
        <meta property="og:image" content="/image1.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jibondaak.com/" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="JibonDaak - Emergency Ambulance Service"
        />
        <meta
          name="twitter:description"
          content="24/7 Emergency ambulance service across Bangladesh. Quick response, professional care."
        />
        <meta name="twitter:image" content="/image1.png" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
