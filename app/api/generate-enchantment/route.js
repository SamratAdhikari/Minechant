// app/api/generate-enchantment/route.js
import { NextResponse } from "next/server";

const romanToLevel = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
};

const handleApi = (handler) => async (request) => {
  try {
    return await handler(request);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
};

const parseEnchantString = (raw) => {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim();
  if (!normalized) return null;

  const lastSpace = normalized.lastIndexOf(" ");
  if (lastSpace === -1) {
    return { name: normalized, level: 1 };
  }

  const name = normalized.slice(0, lastSpace);
  const levelLabel = normalized.slice(lastSpace + 1);
  const level = romanToLevel[levelLabel] || 1;
  return { name, level };
};

export const POST = handleApi(async (request) => {
  const { selected_items: selectedItems, selected_enchants: selectedEnchants } =
    await request.json();

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return NextResponse.json(
      { error: "Invalid input format. Expect base item and enchantment list." },
      { status: 400 }
    );
  }

  const parsedSelectedEnchants = Array.isArray(selectedEnchants)
    ? selectedEnchants
        .filter(Boolean)
        .map(parseEnchantString)
        .filter(Boolean)
    : [];

  if (parsedSelectedEnchants.length === 0) {
    return NextResponse.json(
      { error: "No valid enchantments selected." },
      { status: 400 }
    );
  }

  const baseItemName = selectedItems[0];
  if (!baseItemName || typeof baseItemName !== "string") {
    return NextResponse.json(
      { error: "The base item selection is invalid." },
      { status: 400 }
    );
  }

  const { calculateEnchantmentPlan } = await import("../enchantment-calculate");

  try {
    const plan = calculateEnchantmentPlan(baseItemName, parsedSelectedEnchants);
    if (!plan) {
      return NextResponse.json(
        { error: "Unable to build enchantment plan from the selected items." },
        { status: 400 }
      );
    }

    if (plan.error) {
      return NextResponse.json({ error: plan.error }, { status: 400 });
    }

    const result = [
      ...plan.steps,
      `Total XP required: ${plan.totalXp}`,
    ];
    return NextResponse.json({ result });
  } catch (calculateError) {
    return NextResponse.json(
      { error: calculateError.message || "Invalid enchantment plan." },
      { status: 400 }
    );
  }
});
