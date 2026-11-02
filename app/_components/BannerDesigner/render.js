// Draws a banner front face (20x40 px) from the pattern mask atlases in
// /public/banner/patterns. The front face sits at (1, 1) in each 64x64 atlas.
export const FACE = { x: 1, y: 1, w: 20, h: 40 };

const cache = new Map();

const loadPattern = (id) => {
    if (!cache.has(id)) {
        cache.set(
            id,
            new Promise((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = `/banner/patterns/${id}.png`;
            }),
        );
    }
    return cache.get(id);
};

// layers: [{ pattern: "stripe_top", hex: "#B02E26" }]
export const drawBanner = async (canvas, baseHex, layers) => {
    const images = await Promise.all(layers.map((l) => loadPattern(l.pattern)));

    const ctx = canvas.getContext("2d");
    const tint = document.createElement("canvas");
    tint.width = FACE.w;
    tint.height = FACE.h;
    const t = tint.getContext("2d");

    ctx.clearRect(0, 0, FACE.w, FACE.h);
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, FACE.w, FACE.h);

    layers.forEach((layer, i) => {
        const crop = [images[i], FACE.x, FACE.y, FACE.w, FACE.h, 0, 0, FACE.w, FACE.h];
        t.globalCompositeOperation = "source-over";
        t.clearRect(0, 0, FACE.w, FACE.h);
        t.fillStyle = layer.hex;
        t.fillRect(0, 0, FACE.w, FACE.h);
        t.globalCompositeOperation = "multiply";
        t.drawImage(...crop);
        t.globalCompositeOperation = "destination-in";
        t.drawImage(...crop);
        ctx.drawImage(tint, 0, 0);
    });
};
