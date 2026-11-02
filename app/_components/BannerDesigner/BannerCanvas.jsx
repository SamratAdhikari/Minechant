"use client";

import React, { useEffect, useRef } from "react";
import { drawBanner, FACE } from "./render";

const BannerCanvas = ({ baseHex, layers, className = "", label }) => {
    const ref = useRef(null);
    const key = JSON.stringify(layers);

    useEffect(() => {
        let live = true;
        drawBanner(ref.current, baseHex, JSON.parse(key)).catch(() => {
            if (live) console.error("Failed to load banner pattern images");
        });
        return () => {
            live = false;
        };
    }, [baseHex, key]);

    return (
        <canvas
            ref={ref}
            width={FACE.w}
            height={FACE.h}
            role="img"
            aria-label={label}
            className={`[image-rendering:pixelated] ${className}`}
        />
    );
};

export default BannerCanvas;
