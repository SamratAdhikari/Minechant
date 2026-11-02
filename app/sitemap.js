/**
 * Dynamic Sitemap for Minechant
 * Sitemap for Minechant (single-page app)
 */
export default function sitemap() {
    const baseUrl = "https://minechant.vercel.app";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/banner`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];
}
