function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function isNearWhite(r, g, b) {
  return r > 240 && g > 240 && b > 240;
}

function isNearBlack(r, g, b) {
  return r < 25 && g < 25 && b < 25;
}

export function detectDominantColor(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const sx = Math.floor(canvas.width * 0.3);
      const sy = Math.floor(canvas.height * 0.3);
      const sw = Math.floor(canvas.width * 0.4);
      const sh = Math.floor(canvas.height * 0.4);
      const { data } = ctx.getImageData(sx, sy, sw, sh);

      const counts = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 128 || isNearWhite(r, g, b) || isNearBlack(r, g, b)) continue;
        const key = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
        counts[key] = (counts[key] || 0) + 1;
      }

      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (!sorted.length) {
        resolve("#1B2E4B");
        return;
      }
      const [r, g, b] = sorted[0][0].split(",").map(Number);
      resolve(rgbToHex(r, g, b));
    };
    img.onerror = () => reject(new Error("Logo kon niet worden geladen"));
    img.src = imageDataUrl;
  });
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
