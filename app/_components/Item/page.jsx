"use client";

import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectItem,
    removeItem,
    clearEnchant,
} from "../../redux/slices/selectionSlice";

const Page = ({ name, level, image }) => {
    const dispatch = useDispatch();
    const { selected_items } = useSelector((state) => state.selection);

    // determine if the item is selected
    const handleClick = () => {
        if (!selected_items.includes(name)) {
            dispatch(clearEnchant());
            dispatch(selectItem(name));
        } else {
            dispatch(clearEnchant());
            dispatch(removeItem());
        }
    };

    return (
        <div className="flex flex-col justify-center items-center px-1 sm:px-2">
            {name !== "book" && (
                <>
                    <div
                        onClick={handleClick}
                        className={`flex flex-wrap cursor-pointer justify-center items-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 m-2 border-2 rounded-xl ${
                            selected_items.includes(name)
                                ? `bg-[#305c4c]`
                                : "bg-[#1C4464] hover:bg-blue-950"
                        } transition-all duration-100 ease-in-out`}
                    >
                        <div className="relative">
                            <Image
                                width={80}
                                height={80}
                                src={image}
                                alt={`${name} image here`}
                            />
                            {level && (
                                <div className="absolute w-6 h-6 sm:w-7 sm:h-7 flex justify-center items-center -top-2 -right-1 bg-amber-300 rounded-full text-xs sm:text-sm">
                                    <span className="text-gray-800 self-center font-black">
                                        {level}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-gray-400 text-sm sm:text-lg md:text-xl lg:text-2xl capitalize min-h-12 sm:min-h-14 md:min-h-16 mx-auto rounded px-1 sm:px-2 max-w-full text-center leading-snug">
                        {name.replaceAll("_", " ")}
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;
