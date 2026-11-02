import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectEnchant,
    removeEnchant,
} from "../../redux/slices/selectionSlice";

// One level button inside an enchantment row's segmented control.
const Page = ({ name, level, enchantLabel, rowIndex, incompatible }) => {
    const { selected_enchants } = useSelector((state) => state.selection);
    const dispatch = useDispatch();
    const selected = selected_enchants[rowIndex] === name;

    const handleClick = () => {
        if (selected) {
            dispatch(removeEnchant(rowIndex));
            return;
        }
        // Replace any selected enchant that conflicts with this one.
        selected_enchants.forEach((enchant, index) => {
            if (enchant && incompatible.includes(enchant.split(" ")[0])) {
                dispatch(removeEnchant(index));
            }
        });
        dispatch(selectEnchant({ rowIndex, name }));
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={selected}
            aria-label={`${enchantLabel} ${level || ""}`.trim()}
            className={`relative overflow-hidden min-w-11 min-h-11 px-3 rounded-sm border-2 font-title text-base cursor-pointer transition-colors duration-150 ${
                selected
                    ? "bg-accent text-black border-white"
                    : "bg-surface-2 text-ink border-line hover:border-accent"
            }`}
        >
            {selected && <span className="glint absolute inset-0" aria-hidden="true" />}
            <span className="relative">{level || "On"}</span>
        </button>
    );
};

export default Page;
