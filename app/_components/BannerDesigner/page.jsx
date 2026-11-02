"use client";

import React, { useEffect, useMemo, useState } from "react";
import data from "../../assets/banners.json";
import BannerCanvas from "./BannerCanvas";

const { dyes, patterns, maxLayers } = data;
const dyeById = Object.fromEntries(dyes.map((d) => [d.id, d]));
const patternById = Object.fromEntries(patterns.map((p) => [p.id, p]));

// URL format: ?base=white&l=stripe_top.red,creeper.black
const parseUrl = () => {
    const q = new URLSearchParams(window.location.search);
    const base = dyeById[q.get("base")] ? q.get("base") : "white";
    const layers = (q.get("l") || "")
        .split(",")
        .map((s) => s.split("."))
        .filter(([p, c]) => patternById[p] && dyeById[c])
        .slice(0, maxLayers)
        .map(([pattern, dye]) => ({ pattern, dye }));
    return { base, layers };
};

const Swatch = ({ dye, selected, onPick, label }) => (
    <button
        type="button"
        onClick={() => onPick(dye.id)}
        aria-pressed={selected}
        aria-label={`${label} ${dye.name}`}
        title={dye.name}
        style={{ backgroundColor: dye.hex }}
        className={`min-w-11 min-h-11 rounded-sm border-2 cursor-pointer transition ${
            selected ? "border-white ring-2 ring-primary scale-105" : "border-black/50 hover:border-white"
        }`}
    >
        {selected && (
            <span aria-hidden="true" className="text-black/70 mix-blend-difference text-lg font-bold">✓</span>
        )}
    </button>
);

const Page = () => {
    const [base, setBase] = useState("white");
    const [layers, setLayers] = useState([]);
    const [paint, setPaint] = useState("red");
    const [copied, setCopied] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const s = parseUrl();
        setBase(s.base);
        setLayers(s.layers);
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        const q = new URLSearchParams();
        q.set("base", base);
        if (layers.length) q.set("l", layers.map((l) => `${l.pattern}.${l.dye}`).join(","));
        window.history.replaceState(null, "", `?${q.toString()}`);
    }, [base, layers, ready]);

    const renderLayers = useMemo(
        () => layers.map((l) => ({ pattern: l.pattern, hex: dyeById[l.dye].hex })),
        [layers],
    );
    const full = layers.length >= maxLayers;

    const addLayer = (pattern) =>
        setLayers((ls) => (ls.length >= maxLayers ? ls : [...ls, { pattern, dye: paint }]));
    const removeLayer = (i) => setLayers((ls) => ls.filter((_, idx) => idx !== i));
    const recolor = (i, dye) => setLayers((ls) => ls.map((l, idx) => (idx === i ? { ...l, dye } : l)));
    const move = (i, d) =>
        setLayers((ls) => {
            const j = i + d;
            if (j < 0 || j >= ls.length) return ls;
            const next = [...ls];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
        });

    const dyeCounts = layers.reduce((acc, l) => ({ ...acc, [l.dye]: (acc[l.dye] || 0) + 1 }), {});
    const extraItems = [...new Set(layers.map((l) => patternById[l.pattern].item).filter(Boolean))];

    const recipeText = [
        `Banner: ${dyeById[base].name} base (6 ${dyeById[base].name} Wool + 1 Stick)`,
        ...layers.map(
            (l, i) =>
                `${i + 1}. Loom: ${patternById[l.pattern].game} in ${dyeById[l.dye].name}${patternById[l.pattern].item ? ` [${patternById[l.pattern].item}]` : ""}`,
        ),
    ].join("\n");

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(recipeText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const altText = `Banner with ${dyeById[base].name} base${layers.length ? " and " + layers.map((l) => `${dyeById[l.dye].name} ${patternById[l.pattern].name}`).join(", ") : ""}`;

    return (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr] items-start">
            <aside className="bevel bg-surface border border-line rounded-lg p-4 sm:p-6 lg:sticky lg:top-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="mt-4 grid place-items-center rounded-md bg-surface-2 border border-line p-6">
                    <BannerCanvas baseHex={dyeById[base].hex} layers={renderLayers} label={altText} className="w-40 h-80 shadow-[0_6px_0_rgba(0,0,0,0.5)]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={copy} className="min-h-11 px-4 rounded-md bg-primary text-primary-ink font-semibold cursor-pointer hover:brightness-110">
                        <span aria-live="polite">{copied ? "Copied ✓" : "Copy recipe"}</span>
                    </button>
                    <button type="button" onClick={() => setLayers([])} disabled={!layers.length} className="min-h-11 px-4 rounded-md bg-surface-3 border border-line cursor-pointer hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        Clear layers
                    </button>
                </div>
            </aside>

            <div className="flex flex-col gap-5">
                <section aria-labelledby="base-h" className="bevel bg-surface border border-line rounded-lg p-4 sm:p-6">
                    <h2 id="base-h" className="text-xl font-semibold"><span className="font-title text-primary mr-2">1</span>Base colour</h2>
                    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Base colour">
                        {dyes.map((d) => (
                            <Swatch key={d.id} dye={d} label="Base" selected={base === d.id} onPick={setBase} />
                        ))}
                    </div>
                </section>

                <section aria-labelledby="layers-h" className="bevel bg-surface border border-line rounded-lg p-4 sm:p-6">
                    <h2 id="layers-h" className="text-xl font-semibold">
                        <span className="font-title text-primary mr-2">2</span>Layers
                        <span className="ml-2 text-sm font-normal text-ink-dim">{layers.length}/{maxLayers}</span>
                    </h2>
                    {layers.length === 0 ? (
                        <p className="mt-3 text-sm text-ink-dim">No layers yet. Pick a pattern below to add one.</p>
                    ) : (
                        <ol className="mt-4 grid gap-2">
                            {layers.map((l, i) => (
                                <li key={i} className="flex flex-wrap items-center gap-3 rounded-md bg-surface-2 border border-line p-2">
                                    <span className="font-title w-5 text-center text-ink-dim">{i + 1}</span>
                                    <BannerCanvas baseHex="#3a443c" layers={[{ pattern: l.pattern, hex: dyeById[l.dye].hex }]} label="" className="w-6 h-12" />
                                    <span className="flex-1 min-w-32">{patternById[l.pattern].name}</span>
                                    <select
                                        value={l.dye}
                                        onChange={(e) => recolor(i, e.target.value)}
                                        aria-label={`Layer ${i + 1} colour`}
                                        className="min-h-11 rounded-md bg-surface-3 border border-line px-2"
                                    >
                                        {dyes.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                                    </select>
                                    <span className="flex gap-1">
                                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move layer ${i + 1} down`} title="Move down (below)" className="min-w-11 min-h-11 rounded-md bg-surface-3 border border-line cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">↓</button>
                                        <button type="button" onClick={() => move(i, 1)} disabled={i === layers.length - 1} aria-label={`Move layer ${i + 1} up`} title="Move up (on top)" className="min-w-11 min-h-11 rounded-md bg-surface-3 border border-line cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">↑</button>
                                        <button type="button" onClick={() => removeLayer(i)} aria-label={`Remove layer ${i + 1}`} className="min-w-11 min-h-11 rounded-md bg-surface-3 border border-line text-danger cursor-pointer hover:bg-surface">✕</button>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                    <p className="mt-2 text-xs text-ink-dim">Layers are painted in order; higher numbers sit on top.</p>
                </section>

                <section aria-labelledby="add-h" className="bevel bg-surface border border-line rounded-lg p-4 sm:p-6">
                    <h2 id="add-h" className="text-xl font-semibold"><span className="font-title text-primary mr-2">3</span>Add a pattern</h2>
                    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pattern colour">
                        {dyes.map((d) => (
                            <Swatch key={d.id} dye={d} label="Pattern" selected={paint === d.id} onPick={setPaint} />
                        ))}
                    </div>
                    {full && <p role="status" className="mt-3 text-sm text-warning">Maximum of {maxLayers} layers reached. Remove one to add another.</p>}
                    <div className="mt-4 grid grid-cols-3 min-[420px]:grid-cols-4 sm:grid-cols-6 gap-2">
                        {patterns.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => addLayer(p.id)}
                                disabled={full}
                                title={`${p.name} (in game: ${p.game})${p.item ? ` — needs ${p.item}` : ""}`}
                                className="bevel flex flex-col items-center gap-1 p-2 rounded-md bg-surface-2 border-2 border-line cursor-pointer hover:border-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <BannerCanvas baseHex={dyeById[base].hex} layers={[{ pattern: p.id, hex: dyeById[paint].hex }]} label="" className="w-8 h-16" />
                                <span className="text-xs text-center leading-tight">{p.name}</span>
                                {p.item && <span className="text-[10px] text-accent" aria-hidden="true">special item</span>}
                            </button>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="recipe-h" className="bevel bg-surface border border-line rounded-lg p-4 sm:p-6">
                    <h2 id="recipe-h" className="text-xl font-semibold">Recipe</h2>
                    <ul className="mt-3 grid gap-1.5 text-sm">
                        <li>Banner: 6 × {dyeById[base].name} Wool + 1 Stick (or dye a white banner)</li>
                        {layers.map((l, i) => (
                            <li key={i}>
                                Loom {i + 1}: <strong>{patternById[l.pattern].game}</strong> <span className="text-ink-dim">({patternById[l.pattern].name})</span> with {dyeById[l.dye].name} Dye
                                {patternById[l.pattern].item && <span className="text-accent"> + {patternById[l.pattern].item}</span>}
                            </li>
                        ))}
                    </ul>
                    {layers.length > 0 && (
                        <>
                            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink-dim">Dyes needed</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {Object.entries(dyeCounts).map(([id, n]) => (
                                    <span key={id} className="inline-flex items-center gap-2 rounded-md bg-surface-2 border border-line px-2 py-1 text-sm">
                                        <span className="w-3 h-3 rounded-sm border border-black/50" style={{ backgroundColor: dyeById[id].hex }} aria-hidden="true" />
                                        {n} × {dyeById[id].name}
                                    </span>
                                ))}
                            </div>
                            {extraItems.length > 0 && (
                                <p className="mt-3 text-sm text-ink-dim">Special items: {extraItems.join("; ")}</p>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Page;
