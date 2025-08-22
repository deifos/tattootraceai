import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import GoogleAnalytics from "@/components/googleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  authors: [{ name: 'TattootraceAI' }],
  creator: 'TattootraceAI',
  publisher: 'TattootraceAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tattootrace.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tattootrace.ai',
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: 'https://deifos.github.io/images/tattootraceai-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Tattootraceai - Generate tattoo preview before you ink',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['https://deifos.github.io/images/tattootraceai-banner.jpg'],
    creator: '@deifos',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <GoogleAnalytics gtag='G-XQ1BWZY717' />
        <Script
          src='https://www.feedbackbasket.com/api/widget/script/cmem5bhxd0001l804yr6jvf9j'
          strategy='lazyOnload'
        />
      </body>
    </html>
  );
}
