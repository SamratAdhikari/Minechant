import React from "react";
import Item from "../Item/page";

import items from "../../assets/items.json";

const page = () => {
    return (
        <section
            aria-labelledby="items-heading"
            className="bevel w-full bg-surface border border-line rounded-lg p-4 sm:p-6"
        >
            <h2 id="items-heading" className="text-xl sm:text-2xl font-semibold">
                <span className="font-title text-primary mr-2">1</span>
                Select an item to enchant
            </h2>
            <div className="mt-4 grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {items
                    .filter((item) => item.name !== "book")
                    .map((item) => (
                        <Item key={item.id} name={item.name} image={item.src} />
                    ))}
            </div>
        </section>
    );
};

export default page;
