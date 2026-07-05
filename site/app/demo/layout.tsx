import { Barlow } from "next/font/google";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={barlow.variable}>{children}</div>;
}
