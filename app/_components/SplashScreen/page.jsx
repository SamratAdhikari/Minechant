"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEnchantmentResult } from "../../redux/slices/enchantmentSlice";
import { clearEnchant, removeItem } from "../../redux/slices/selectionSlice";

const toRoman = (num) => ({ 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" })[num] || num;

const formatEnchant = (key, level) =>
    `${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}${level > 1 || level === 1 ? " " + toRoman(level) : ""}`;

const Shell = ({ children, onClose, labelId }) => {
    const ref = useRef(null);
    const closeRef = useRef(onClose);
    closeRef.current = onClose;

    useEffect(() => {
        const previous = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        ref.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape") closeRef.current?.();
            if (e.key === "Tab" && ref.current) {
                const f = ref.current.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])");
                if (!f.length) return;
                const first = f[0];
                const last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            previous?.focus?.();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
                ref={ref}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelId}
                className="pop-in bevel w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-surface border border-line rounded-t-xl sm:rounded-xl p-5 sm:p-6 text-ink focus:outline-none"
            >
                {children}
            </div>
        </div>
    );
};

const Page = () => {
    const dispatch = useDispatch();
    const { loading, error, result } = useSelector((state) => state.enchantment);
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!loading && (result || error)) setOpen(true);
    }, [loading, result, error]);

    const close = () => {
        setOpen(false);
        dispatch(clearEnchantmentResult());
    };

    if (loading) {
        return (
            <Shell labelId="plan-loading">
                <div role="status" aria-live="polite">
                    <h2 id="plan-loading" className="font-title text-xl text-primary">
                        Calculating best order…
                    </h2>
                    <div className="mt-4 space-y-3" aria-hidden="true">
                        {[80, 60, 70].map((w) => (
                            <div key={w} className="glint h-3 rounded-sm bg-surface-3" style={{ width: `${w}%` }} />
                        ))}
                    </div>
                </div>
            </Shell>
        );
    }

    if (!open) return null;

    if (error) {
        return (
            <Shell labelId="plan-error" onClose={close}>
                <h2 id="plan-error" className="font-title text-xl text-danger">
                    Couldn&apos;t build a plan
                </h2>
                <p role="alert" className="mt-3 rounded-md border border-danger/50 bg-danger/10 p-3 text-sm">
                    {String(error)}
                </p>
                <p className="mt-3 text-sm text-ink-dim">
                    Try removing an enchantment or choosing lower levels, then calculate again.
                </p>
                <button onClick={close} className="mt-5 min-h-11 px-5 rounded-md bg-surface-3 border border-line cursor-pointer hover:bg-surface-2">
                    Back to selection
                </button>
            </Shell>
        );
    }

    if (!result) return null;

    const all = Array.isArray(result) ? result : result.steps ?? [];
    const steps = all.filter((e) => typeof e === "object");
    const totalLine = all.find((e) => typeof e === "string");
    const totalXp = Array.isArray(result)
        ? Number(totalLine?.match(/(\d+)/)?.[1] ?? NaN)
        : result.totalXp ?? NaN;
    const totalLevels = steps.reduce((s, e) => s + (parseInt(e.levelCost, 10) || 0), 0);
    const finalEnchants = steps.length ? steps[steps.length - 1].result : null;

    const planText = [
        ...steps.map((s, i) => `${i + 1}. ${s.desc} (${s.levelCost} levels)`),
        `Total: ${totalLevels} levels${Number.isNaN(totalXp) ? "" : `, ${totalXp} XP`}`,
    ].join("\n");

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(planText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const startOver = () => {
        dispatch(clearEnchant());
        dispatch(removeItem());
        close();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Shell labelId="plan-title" onClose={close}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 id="plan-title" className="font-title text-2xl text-primary">
                        Enchantment plan
                    </h2>
                    <p className="mt-1 text-sm text-ink-dim">
                        Follow these anvil steps in order.
                    </p>
                </div>
                <button onClick={close} aria-label="Close plan" className="min-h-11 min-w-11 rounded-md border border-line bg-surface-2 hover:bg-surface-3 cursor-pointer">
                    ✕
                </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-surface-2 border border-line p-3">
                    <div className="text-xs uppercase tracking-wide text-ink-dim">Total levels</div>
                    <div className={`font-title text-3xl ${totalLevels > 39 ? "text-danger" : "text-primary"}`}>{totalLevels}</div>
                </div>
                <div className="rounded-md bg-surface-2 border border-line p-3">
                    <div className="text-xs uppercase tracking-wide text-ink-dim">Total XP</div>
                    <div className="font-title text-3xl text-primary">
                        {Number.isNaN(totalXp) ? "–" : totalXp.toLocaleString()}
                    </div>
                </div>
            </div>

            <ol className="mt-5 space-y-3">
                {steps.map((s, i) => (
                    <li key={i} className="rounded-md bg-surface-2 border border-line p-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs uppercase tracking-wide text-ink-dim">Step {i + 1}</span>
                            <span className={`text-sm font-semibold ${s.levelCost >= 35 ? "text-warning" : "text-primary"}`}>
                                {s.levelCost} levels
                            </span>
                        </div>
                        <div className="mt-1">{s.desc}</div>
                        {s.result && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {Object.entries(s.result).map(([k, v]) => (
                                    <span key={k} className="rounded-sm bg-accent/20 border border-accent/50 text-accent px-2 py-0.5 text-xs">
                                        {formatEnchant(k, v)}
                                    </span>
                                ))}
                            </div>
                        )}
                        {(s.enchantCost != null || s.penaltyCost != null) && (
                            <div className="mt-2 text-xs text-ink-dim">
                                Enchant {s.enchantCost ?? 0} + penalty {s.penaltyCost ?? 0}
                            </div>
                        )}
                    </li>
                ))}
            </ol>

            {finalEnchants && (
                <div className="mt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-dim">Final enchantments</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(finalEnchants).map(([k, v]) => (
                            <span key={k} className="rounded-md bg-accent/20 border border-accent/50 text-accent px-3 py-1 text-sm">
                                {formatEnchant(k, v)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={copy} className="min-h-11 px-5 rounded-md bg-primary text-primary-ink font-semibold cursor-pointer hover:brightness-110">
                    <span aria-live="polite">{copied ? "Copied ✓" : "Copy plan"}</span>
                </button>
                <button onClick={startOver} className="min-h-11 px-5 rounded-md bg-surface-3 border border-line cursor-pointer hover:bg-surface-2">
                    Start over
                </button>
            </div>
        </Shell>
    );
};

export default Page;
