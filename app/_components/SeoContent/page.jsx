/**
 * SEO Content Component
 * Provides keyword-rich static content for search engines
 * Hidden visually but available for crawlers
 */
const SeoContent = () => {
    return (
        <section className="sr-only" aria-hidden="true">
            <h2>About Minechant - Minecraft Enchantment Optimizer</h2>
            <p>
                Minechant is the ultimate Minecraft enchantment calculator and
                anvil optimizer. Whether you&apos;re looking to combine enchanted
                books, calculate XP costs, or plan the most efficient
                enchantment strategy, Minechant has you covered.
            </p>
            <h3>Minecraft Enchantment Calculator</h3>
            <p>
                Our advanced enchantment calculator helps you determine the
                optimal way to combine your enchanted books in the Minecraft
                anvil. Simply select your items and enchantments, and we&apos;ll
                calculate the total XP cost and any compatibility issues.
            </p>
            <h3>Anvil XP Cost Calculator</h3>
            <p>
                Understanding anvil costs is crucial for efficient Minecraft
                enchanting. Minechant provides accurate XP cost calculations,
                taking into account the 39-level cap, book vs. item combining,
                and renamed items penalties.
            </p>
            <h3>Minecraft Enchantment Guide</h3>
            <p>
                Learn the best enchantment combinations for your gear. From
                optimal sword builds with Sharpness V and Fire Aspect to
                complete armor sets with Protection IV, Minechant helps you
                plan the perfect enchantments.
            </p>
            <h3>Supported Enchantments</h3>
            <p>
                Minechant supports all major Minecraft enchantments including:
                Protection, Fire Protection, Feather Falling, Blast Protection,
                Projectile Protection, Respiration, Aqua Affinity, Thorns,
                Depth Strider, Frost Walker, Soul Speed, Swift Sneak, Loyalty,
                Channeling, Riptide, Impaling, Looting, Fortune, Silk Touch,
                Unbreaking, Mending, Efficiency, Sharpness, Smite, Bane of
                Arthropods, Power, Punch, Flame, Infinity, Multishot,
                Quick Charge, and more.
            </p>
            <h3>Supported Items</h3>
            <p>
                Optimize enchantments for all Minecraft items: swords, axes,
                bows, crossbows, tridents, elytra, armor pieces, tools
                (pickaxe, shovel, hoe), and utility items.
            </p>
        </section>
    );
};

export default SeoContent;