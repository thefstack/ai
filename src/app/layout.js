import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/context/Providers"; // Import the Providers component
import Sidebar from "@/components/Sidebar";


// Font configuration
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the app
export const metadata = {
  title: "Ivy AI Tutor",
  description: "Ivy AI Tutor is an advanced learning platform designed to help students excel in data science, software development, and other related fields. With personalized lesson plans, interactive quizzes, and real-time AI-powered chat assistance, Ivy AI Tutor makes learning engaging and effective. Whether you're preparing for exams, building skills in programming, or deepening your understanding of AI and machine learning, Ivy AI Tutor provides tailored content and support to meet your educational needs.",
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
        <div className="app-container" style={{width: "100vw", height:"100vh",display: "flex", maxHeight:"100vh", overflow:"hidden"}}>
            <main style={{width:"100%"}}>{children}  {/* Now we wrap children with the Providers */}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
