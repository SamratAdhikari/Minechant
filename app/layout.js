import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * Comprehensive SEO Metadata for Minechant
 * Optimized for search engines and social media sharing
 */
export const metadata = {
    // Basic metadata
    metadataBase: new URL("https://minechant.vercel.app"),
    title: {
        default: "Minechant - Minecraft Enchantment Optimizer & Anvil Calculator",
        template: "%s | Minechant",
    },
    description:
        "Optimize your Minecraft enchantments with Minechant - the ultimate anvil calculator. Calculate XP costs, combine enchanted books, and plan the most efficient enchantment strategies.",
    keywords: [
        "Minecraft enchantment calculator",
        "Minecraft anvil optimizer",
        "Minecraft XP cost calculator",
        "Minecraft enchantment combiner",
        "Minecraft book merging",
        "Minecraft enchantment guide",
        "Minecraft anvil mechanics",
        "Minecraft optimal enchantments",
    ],
    authors: [{ name: "Minechant" }],
    creator: "Minechant",
    publisher: "Minechant",

    // Open Graph / Facebook
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://minechant.vercel.app",
        siteName: "Minechant",
        title: "Minechant - Minecraft Enchantment Optimizer & Anvil Calculator",
        description:
            "Optimize your Minecraft enchantments with Minechant - the ultimate anvil calculator. Calculate XP costs, combine enchanted books, and plan the most efficient enchantment strategies.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Minechant - Minecraft Enchantment Optimizer",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "Minechant - Minecraft Enchantment Optimizer & Anvil Calculator",
        description:
            "Optimize your Minecraft enchantments with Minechant - the ultimate anvil calculator. Calculate XP costs and plan optimal enchantments.",
        creator: "@minechant",
        images: ["/og-image.png"],
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Canonical URL
    alternates: {
        canonical: "https://minechant.vercel.app",
        languages: {
            en: "https://minechant.vercel.app",
        },
    },

    // Category
    category: "gaming",
    classification: "Gaming Tools",
};

/**
 * JSON-LD Structured Data for SEO
 * WebApplication schema for Google rich results
 */
export const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Minechant",
    description:
        "A Minecraft enchantment optimizer that helps players calculate the most efficient way to combine enchanted books and items using the game's anvil mechanics.",
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    url: "https://minechant.vercel.app",
    author: {
        "@type": "Organization",
        name: "Minechant",
        url: "https://minechant.vercel.app",
    },
    browserRequirements: "Requires JavaScript",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} 
                antialiased `}
            >
                {children}
            </body>
        </html>
    );
}
