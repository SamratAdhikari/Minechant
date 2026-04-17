import React from "react";
import Item from "../Item/page";

import items from "../../assets/items.json";

const page = () => {
    return (
        <div className="flex flex-col w-full max-w-[1200px] md:w-[70%] bg-[#31302f] border-2 rounded-md shadow-lg shadow-gray-500/50 p-4 my-4 mx-auto">
            <span className="text-2xl sm:text-3xl text-gray-300 mx-4 sm:mx-10 my-4">
                Select an Item to Enchant
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 gap-y-6 sm:gap-y-8 justify-items-center">
                {items.map((item) => (
                    <Item key={item.id} name={item.name} image={item.src} />
                ))}
            </div>
        </div>
    );
};

export default page;
