import React from "react";
import enchantments from "../../assets/enchants.json";
import Enchant from "../Enchant/page";
import { useSelector } from "react-redux";

const toRoman = (num) => ["I", "II", "III", "IV", "V"][num] || "";
const pretty = (s) => s.replaceAll("_", " ");

const page = () => {
    const { selected_items, selected_enchants } = useSelector(
        (state) => state.selection,
    );

    if (!selected_items[0]) {
        return (
            <section className="w-full rounded-lg border border-dashed border-line p-6 text-center text-ink-dim">
                <span className="font-title text-primary mr-2">2</span>
                Choose an item above to see the enchantments available for it.
            </section>
        );
    }

    const rows = enchantments.filter((e) => e.items.includes(selected_items[0]));
    const chosenNames = selected_enchants.filter(Boolean).map((e) => e.split(" ")[0]);

    return (
        <section
            aria-labelledby="books-heading"
            className="bevel w-full bg-surface border border-line rounded-lg p-4 sm:p-6 pop-in"
        >
            <h2 id="books-heading" className="text-xl sm:text-2xl font-semibold">
                <span className="font-title text-primary mr-2">2</span>
                Select books for your {pretty(selected_items[0])}
            </h2>
            <p className="mt-1 text-sm text-ink-dim">
                Pick one level per enchantment. Tap the selected level again to
                remove it. Choosing a conflicting enchantment replaces the old one.
            </p>
            <ul className="mt-4 grid gap-2 lg:grid-cols-2">
                {rows.map((enchantment, index) => {
                    const multi = enchantment.levelMax > 1;
                    const conflict = enchantment.incompatible.find((n) =>
                        chosenNames.includes(n),
                    );
                    return (
                        <li
                            key={enchantment.name}
                            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-md bg-surface-2 border border-line p-3"
                        >
                            <div className="min-w-0">
                                <div className="font-medium capitalize">
                                    {pretty(enchantment.name)}
                                </div>
                                <div className="text-xs text-ink-dim">
                                    Cost weight ×{enchantment.weight}
                                    {conflict && (
                                        <span className="ml-2 text-warning">
                                            ⚠ Conflicts with {pretty(conflict)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1.5" role="group" aria-label={`${pretty(enchantment.name)} level`}>
                                {Array.from({ length: enchantment.levelMax }, (_, i) => (
                                    <Enchant
                                        key={`${enchantment.name}_${i}`}
                                        name={`${enchantment.name}${multi ? " " + toRoman(i) : ""}`}
                                        level={multi ? toRoman(i) : ""}
                                        enchantLabel={pretty(enchantment.name)}
                                        rowIndex={index}
                                        incompatible={enchantment.incompatible}
                                    />
                                ))}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default page;
