import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEnchantmentOrder } from "../../redux/slices/enchantmentSlice";

const page = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.enchantment);
    const { selected_items, selected_enchants } = useSelector(
        (state) => state.selection,
    );

    const books = selected_enchants.filter(Boolean);
    const hasItem = selected_items.length > 0;
    const isReady = hasItem && books.length > 0;
    const reason = !hasItem
        ? "Choose an item to begin"
        : books.length === 0
          ? "Choose at least one enchantment"
          : `${selected_items[0].replaceAll("_", " ")} + ${books.length} book${books.length > 1 ? "s" : ""}`;

    return (
        <div className="sticky bottom-0 z-20 -mx-4 sm:mx-0 border-t sm:border border-line bg-surface/95 backdrop-blur sm:rounded-lg px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
            <div className="min-w-0" aria-live="polite">
                <div className="text-xs uppercase tracking-wide text-ink-dim">Your plan</div>
                <div className="truncate capitalize">{reason}</div>
                {books.length > 6 && (
                    <div className="text-xs text-warning">
                        Many books can take a while to solve.
                    </div>
                )}
            </div>
            <button
                type="button"
                disabled={!isReady || loading}
                onClick={() =>
                    dispatch(fetchEnchantmentOrder({ selected_items, selected_enchants }))
                }
                className="shrink-0 min-h-12 px-6 rounded-md border-2 border-black/40 font-title text-lg bg-primary text-primary-ink cursor-pointer transition disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-dim hover:brightness-110 active:translate-y-px bevel"
            >
                {loading ? "Calculating…" : "Calculate"}
            </button>
        </div>
    );
};

export default page;
