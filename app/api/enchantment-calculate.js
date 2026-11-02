import rawEnchants from "../assets/enchants.json";

const ENCHANTMENT_REGISTRY = {};
rawEnchants.forEach((e) => {
    ENCHANTMENT_REGISTRY[e.name] = {
        max: e.levelMax,
        multiplier: e.weight,
        incompatible: new Set(e.incompatible || []),
        items: new Set(e.items || []),
    };
});

// ─── 2. MATHEMATICAL HELPERS ────────────────────────────────────────────────
const xpForLevels = (levels) => {
    if (levels <= 0) return 0;
    if (levels <= 16) return levels ** 2 + 6 * levels;
    if (levels <= 31) return 2.5 * levels ** 2 - 40.5 * levels + 360;
    return 4.5 * levels ** 2 - 162.5 * levels + 2220;
};

const getPenalty = (workCount) => Math.pow(2, workCount) - 1;

// ─── 3. CORE MERGE ENGINE ───────────────────────────────────────────────────
const merge = (target, sacrifice) => {
    // A book cannot receive an item as a sacrifice
    if (target.type === "book" && sacrifice.type === "item") return null;

    const targetItemType = target.type === "item" ? target.item_name : "book";
    const resultEnchants = { ...target.enchantments };
    let enchantCost = 0;
    let hasChanges = false;

    for (const [name, sacLevel] of Object.entries(sacrifice.enchantments)) {
        const data = ENCHANTMENT_REGISTRY[name];
        if (!data) continue;

        // Bidirectional incompatibility check
        const isIncompatible =
            Object.keys(target.enchantments).some((t) =>
                data.incompatible.has(t),
            ) ||
            Object.keys(target.enchantments).some((t) =>
                ENCHANTMENT_REGISTRY[t]?.incompatible.has(name),
            );

        const isEligible =
            targetItemType === "book" || data.items.has(targetItemType);

        if (isIncompatible || !isEligible) {
            enchantCost += 1;
            continue;
        }

        const tarLevel = target.enchantments[name] || 0;
        const finalLevel =
            tarLevel === sacLevel && tarLevel < data.max
                ? tarLevel + 1
                : Math.max(tarLevel, sacLevel);

        if (finalLevel > tarLevel) {
            enchantCost += finalLevel * data.multiplier;
            hasChanges = true;
            resultEnchants[name] = finalLevel;
        } else {
            enchantCost += sacLevel * data.multiplier;
        }
    }

    // FIX 1: Separate the three valid merge cases:
    // (a) item + book always valid (transferring enchants to tool)
    // (b) book + book valid if any enchant cost was incurred
    // (c) anything else with no changes = wasted operation
    const isUseful =
        (target.type === "item" && sacrifice.type === "book") ||
        (target.type === "book" &&
            sacrifice.type === "book" &&
            enchantCost > 0) ||
        hasChanges;

    if (!isUseful) return null;

    const penaltyCost =
        getPenalty(target.work_count) + getPenalty(sacrifice.work_count);
    const totalLevels = enchantCost + penaltyCost;

    // FIX 2: Return structured exceeded object instead of null
    // so the solver knows WHY it failed (cap vs structural)
    if (totalLevels > 39) {
        return {
            exceeded: true,
            warning:
                `Combination cost exceeded 39 levels — ` +
                `[${target.label}] + [${sacrifice.label}] ` +
                `would cost ${totalLevels} levels ` +
                `(${enchantCost} enchant + ${penaltyCost} prior work penalty).`,
        };
    }

    return {
        type: target.type,
        item_name: target.item_name,
        label:
            target.type === "book"
                ? bookLabel(resultEnchants)
                : target.label,
        enchantments: resultEnchants,
        work_count: Math.max(target.work_count, sacrifice.work_count) + 1,
        total_xp:
            target.total_xp + sacrifice.total_xp + xpForLevels(totalLevels),
        history: {
            left: target,
            right: sacrifice,
            cost: totalLevels,
            enchantCost,
            penaltyCost,
        },
    };
};

// Full name of a (possibly combined) book, e.g. "Book: sharpness 5 + unbreaking 3"
const bookLabel = (enchants) =>
    "Book: " +
    Object.entries(enchants)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k.replace(/_/g, " ")} ${v}`)
        .join(" + ");

// ─── 4. RECURSIVE SOLVER WITH MEMOIZATION ───────────────────────────────────
// FIX 3: Stable node key includes total_xp so nodes reached via different
// paths with different costs are never aliased in the memo cache.
const nodeKey = (n) =>
    `${n.type}:${n.item_name ?? "book"}:w${n.work_count}:xp${Math.round(n.total_xp)}:` +
    Object.entries(n.enchantments)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join(",");

const solve = (nodes, memo = new Map()) => {
    if (nodes.length === 1) {
        // Valid end state only if the surviving node is the base item
        return nodes[0].type === "item" ? nodes[0] : null;
    }

    const hash = nodes.map(nodeKey).sort().join("|");
    if (memo.has(hash)) return memo.get(hash);

    let bestNode = null;
    const warnings = [];

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i === j) continue;

            // FIX 4: Skip book-as-target when sacrifice is item (structurally invalid)
            // Skip symmetric book+book pair already tried as (j,i)
            if (nodes[i].type === "book" && nodes[j].type === "item") continue;
            if (nodes[i].type === "book" && nodes[j].type === "book" && j < i)
                continue;

            const merged = merge(nodes[i], nodes[j]);

            // Collect warning but try next pair
            if (!merged) continue;
            if (merged.exceeded) {
                warnings.push(merged.warning);
                continue;
            }

            const remaining = nodes.filter((_, idx) => idx !== i && idx !== j);
            const result = solve([...remaining, merged], memo);

            if (result && (!bestNode || result.total_xp < bestNode.total_xp)) {
                bestNode = result;
            }
        }
    }

    // Attach warnings to the best result so they surface in output
    if (bestNode) bestNode._warnings = warnings;

    memo.set(hash, bestNode);
    return bestNode;
};

// ─── 5. PUBLIC API & FORMATTER ──────────────────────────────────────────────
export const calculateEnchantmentPlan = (baseItemName, selectedEnchants) => {
    // Parse and validate enchants
    const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

    const ENCHANT_ALIASES = {
        sweeping_edge: "sweeping",
    };

    const parseEnchant = (se) => {
        if (!se) return null;
        if (typeof se === "object" && se.name && se.level) return se;
        if (typeof se === "string") {
            const parts = se.trim().split(/\s+/);
            if (parts.length < 2) return null;
            const romanPart = parts[parts.length - 1].toUpperCase();
            const level = ROMAN[romanPart] ?? parseInt(romanPart, 10);
            if (!level || isNaN(level)) return null;
            const rawName = parts.slice(0, -1).join("_").toLowerCase();
            const name = ENCHANT_ALIASES[rawName] ?? rawName;
            return { name, level };
        }
        return null;
    };

    const parsedEnchants = (selectedEnchants ?? [])
        .map(parseEnchant)
        .filter(Boolean)
        .filter(({ name }) => !!ENCHANTMENT_REGISTRY[name]);

    if (!parsedEnchants.length) {
        return { error: "No valid enchantments provided." };
    }

    const baseItem = {
        type: "item",
        item_name: baseItemName,
        label: baseItemName.replace(/_/g, " "),
        enchantments: {},
        work_count: 0,
        total_xp: 0,
    };

    const books = parsedEnchants.map(({ name, level }) => ({
        type: "book",
        item_name: "book",
        label: bookLabel({ [name]: level }),
        enchantments: { [name]: level },
        work_count: 0,
        total_xp: 0,
    }));

    const memo = new Map();
    const finalNode = solve([baseItem, ...books], memo);

    if (!finalNode) {
        return {
            error: "No valid plan possible under 39 levels per operation.",
        };
    }

    // Flatten recursive history into ordered steps
    const steps = [];
    const seen = new Set();

    const trace = (node) => {
        if (!node.history) return;
        trace(node.history.left);
        trace(node.history.right);

        const key = `${node.history.left.label}|${node.history.right.label}|${node.history.cost}`;
        if (seen.has(key)) return;
        seen.add(key);

        steps.push({
            desc: `Combine [${node.history.left.label}] + [${node.history.right.label}]`,
            levelCost: node.history.cost,
            xpCost: Math.round(xpForLevels(node.history.cost)),
            enchantCost: node.history.enchantCost,
            penaltyCost: node.history.penaltyCost,
            result: node.enchantments,
        });
    };

    trace(finalNode);

    // Collect all warnings from nested nodes
    const warnings = [];
    const collectWarnings = (node) => {
        if (!node) return;
        if (node._warnings?.length) warnings.push(...node._warnings);
        if (node.history) {
            collectWarnings(node.history.left);
            collectWarnings(node.history.right);
        }
    };
    collectWarnings(finalNode);

    return {
        totalXp: Math.round(finalNode.total_xp),
        totalLevels: steps.reduce((sum, s) => sum + s.levelCost, 0),
        steps,
        warnings: [...new Set(warnings)], // deduplicate
    };
};
