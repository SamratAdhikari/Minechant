/**
 * Dynamic Sitemap for Minechant
 * Automatically generates sitemap based on routes
 */
export default function sitemap() {
    const baseUrl = "https://minechant.vercel.app";

    return {
        // Main pages
        routes: [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 1,
            },
            {
                url: `${baseUrl}/items`,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: 0.8,
            },
            {
                url: `${baseUrl}/enchantments`,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: 0.8,
            },
            {
                url: `${baseUrl}/guide`,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: 0.6,
            },
        ],
    };
}