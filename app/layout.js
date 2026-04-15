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
      <body
<<<<<<< HEAD
        className={`${spaceGrotesk.variable} ${cormorant.variable} antialiased bg-white text-gray-900`}
=======
        className={`${inter.variable} ${playfair.variable} antialiased`}
>>>>>>> e9cc16eb67c9e06185c7d4d4f6025de1aa2f0b54
        suppressHydrationWarning
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
