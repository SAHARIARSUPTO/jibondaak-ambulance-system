import "./globals.css";

export const metadata = {
  title: "JibonDaak - Emergency Ambulance Service",
  description: "24/7 Emergency ambulance service across Bangladesh. Quick response, professional care.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
