/**
 * Robots.txt for Minechant
 * Directs search engine crawlers
 */
export default function robots() {
    const baseUrl = "https://minechant.vercel.app";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/_next/", "/static/"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/api/", "/_next/", "/static/"],
            },
            {
                userAgent: "Bingbot",
                allow: "/",
                disallow: ["/api/", "/_next/", "/static/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}