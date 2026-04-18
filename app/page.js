"use client";

import Title from "./_components/Title/page";
import ItemContainer from "./_components/ItemContainer/page";
import EnchantmentContainer from "./_components/EnchantmentContainer/page";
import CalculateButton from "./_components/CalculateButton/page";
import SplashScreen from "./_components/SplashScreen/page";
import SeoContent from "./_components/SeoContent/page";
import { Provider } from "react-redux";
import store from "./redux/store";

/**
 * FAQ Schema for Rich Snippets
 */
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How does the Minecraft anvil cost calculator work?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Minechant calculates anvil costs based on Minecraft's mechanics. It considers the base cost of combining items, the 39-level cap, renamed item penalties, and provides accurate XP cost estimates for your enchantment combinations.",
            },
        },
        {
            "@type": "Question",
            name: "What enchantments can I combine in the anvil?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "In Minecraft, you can combine two items with the same enchantment at the same level to upgrade it, or combine two books with the same enchantment at different levels. However, some enchantments are incompatible with each other (like Sharpness and Smite).",
            },
        },
        {
            "@type": "Question",
            name: "How do I optimize my Minecraft enchantments?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "To optimize enchantments, use Minechant to plan your combinations. Consider combining lower-level books first to save XP, avoid renaming items (which increases anvil costs), and use the optimal order of operations when merging multiple enchantments.",
            },
        },
        {
            "@type": "Question",
            name: "What is the maximum anvil cost in Minecraft?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The maximum anvil cost in Minecraft is 39 levels. Once an item reaches this cost, it cannot be worked on further in the anvil. Minechant helps you track and optimize your anvil usage to stay under this limit.",
            },
        },
    ],
};

export default function Home() {
    return (
        <Provider store={store}>
            <div className="flex flex-col items-center justify-center gap-4 bg-[#305c4c] min-h-screen px-4 sm:px-6">
                <Title />
                <main>
                    <ItemContainer />
                    <EnchantmentContainer />
                    <CalculateButton />
                </main>
                <SplashScreen />
                {/* SEO Content for crawlers */}
                <SeoContent />
                {/* FAQ Schema for rich snippets */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            </div>
        </Provider>
    );
}
