"use client";

import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectItem,
    removeItem,
    clearEnchant,
} from "../../redux/slices/selectionSlice";

const Page = ({ name, image }) => {
    const dispatch = useDispatch();
    const { selected_items } = useSelector((state) => state.selection);
    const selected = selected_items.includes(name);
    const label = name.replaceAll("_", " ");

    const handleClick = () => {
        dispatch(clearEnchant());
        dispatch(selected ? removeItem() : selectItem(name));
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={selected}
            className={`bevel group flex flex-col items-center justify-center gap-1 min-h-28 p-2 rounded-md border-2 cursor-pointer transition-all duration-150 ease-out ${
                selected
                    ? "bg-surface-3 border-primary"
                    : "bg-surface-2 border-line hover:border-ink-dim hover:-translate-y-0.5"
            }`}
        >
            <Image
                width={56}
                height={56}
                sizes="56px"
                src={image}
                alt=""
                className="[image-rendering:pixelated] transition-transform group-hover:scale-110"
            />
            <span className="text-sm capitalize text-center leading-tight text-ink">
                {label}
            </span>
            {selected && (
                <span className="text-xs font-semibold text-primary" aria-hidden="true">
                    ✓ Selected
                </span>
            )}
        </button>
    );
};

export default Page;
