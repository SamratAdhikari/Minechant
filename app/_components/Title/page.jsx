import React from "react";

const steps = [
    ["1", "Pick an item"],
    ["2", "Choose your books"],
    ["3", "Get the cheapest anvil plan"],
];

const Page = () => {
    return (
        <header className="w-full max-w-5xl mx-auto pt-10 pb-6 text-center">
            <h1 className="font-title text-5xl sm:text-6xl tracking-wider text-primary drop-shadow-[0_3px_0_rgba(0,0,0,0.6)]">
                MINECHANT
            </h1>
            <p className="mt-3 text-base sm:text-lg text-ink-dim">
                Minecraft anvil &amp; enchantment optimizer. Know the order and
                the XP before you merge.
            </p>
            <ol className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center text-sm">
                {steps.map(([n, label]) => (
                    <li
                        key={n}
                        className="flex items-center gap-2 justify-center rounded-md bg-surface border border-line px-3 py-2 text-ink"
                    >
                        <span className="font-title grid place-items-center w-6 h-6 rounded-sm bg-primary text-primary-ink">
                            {n}
                        </span>
                        {label}
                    </li>
                ))}
            </ol>
        </header>
    );
};

export default Page;
