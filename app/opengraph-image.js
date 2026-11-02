import { ImageResponse } from "next/og";

export const alt = "Minechant - Minecraft Enchantment Optimizer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#305c4c",
                    color: "#ededed",
                }}
            >
                <div style={{ fontSize: 120, fontWeight: 700 }}>MINECHANT</div>
                <div style={{ fontSize: 40, marginTop: 24 }}>
                    Minecraft Enchantment Optimizer &amp; Anvil Calculator
                </div>
            </div>
        ),
        size,
    );
}
