import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Workout",
  description: "Training App ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" sizes="180x180" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
