import BannerDesigner from "../_components/BannerDesigner/page";

export const metadata = {
    title: "Minecraft Banner Designer & Pattern Recipes",
    description:
        "Design Minecraft banners with up to 6 pattern layers, preview them live, and get the loom recipe and dyes you need.",
    alternates: { canonical: "https://minechant.vercel.app/banner" },
};

export default function BannerPage() {
    return (
        <div className="min-h-screen px-4 sm:px-6">
            <header className="w-full max-w-5xl mx-auto pt-8 pb-6 text-center">
                <h1 className="font-title text-4xl sm:text-5xl tracking-wider text-primary drop-shadow-[0_3px_0_rgba(0,0,0,0.6)]">
                    BANNER DESIGNER
                </h1>
                <p className="mt-3 text-ink-dim">
                    Stack up to 6 patterns, see the result, and get the loom recipe.
                </p>
            </header>
            <main className="w-full max-w-5xl mx-auto pb-10">
                <BannerDesigner />
            </main>
        </div>
    );
}
