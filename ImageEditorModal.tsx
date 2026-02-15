import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./components/common/Button";
import IconClose from "./components/common/IconClose";
import IconRefresh from "./components/common/IconRefresh";

interface ImageEditorModalProps {
  file: File;
  onSave: (editedFile: File) => void;
  onClose: () => void;
}

type Tab = "adjustments" | "filters";

type Adjustments = {
  brightness: number; // 0..200
  contrast: number; // 0..200
  saturate: number; // 0..200
  exposure: number; // -100..100
  highlights: number; // -100..100
  shadows: number; // -100..100
  warmth: number; // -100..100
  tint: number; // -100..100
  sharpness: number; // 0..100
  vignette: number; // 0..100
  grain: number; // 0..100
};

const DEFAULTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  warmth: 0,
  tint: 0,
  sharpness: 0,
  vignette: 0,
  grain: 0,
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const FILTER_PRESETS: Array<{ name: string; values: Partial<Adjustments> }> = [
  { name: "ללא", values: { ...DEFAULTS } },
  { name: "זוהר", values: { contrast: 112, saturate: 125, highlights: 12, exposure: 6 } },
  { name: "חם", values: { warmth: 25, saturate: 120, exposure: 5 } },
  { name: "קריר", values: { warmth: -22, tint: 8, contrast: 108 } },
  { name: "דרמטי", values: { contrast: 130, shadows: -18, highlights: 10, vignette: 22 } },
  { name: "וינטג׳", values: { contrast: 96, saturate: 88, warmth: 10, grain: 18, vignette: 18 } },
  { name: "חד ומודגש", values: { sharpness: 35, contrast: 118, saturate: 112 } },
];

const RangeRow: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step = 1, onChange }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-white/80 text-xs">{label}</div>
        <div className="text-white/60 text-xs tabular-nums">{value}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-300"
      />
    </div>
  );
};

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ file, onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [tab, setTab] = useState<Tab>("adjustments");
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULTS);

  // ✅ create objectURL ONCE per file (לא בתוך JSX)
  const [imgSrc, setImgSrc] = useState<string>("");
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const applyPreset = useCallback((values: Partial<Adjustments>) => {
    setAdjustments((prev) => ({
      ...prev,
      ...values,
    }));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return;

    canvas.width = w;
    canvas.height = h;

    // base filters via ctx.filter
    ctx.clearRect(0, 0, w, h);
    ctx.filter =
      `brightness(${adjustments.brightness}%) ` +
      `contrast(${adjustments.contrast}%) ` +
      `saturate(${adjustments.saturate}%)`;

    ctx.drawImage(img, 0, 0, w, h);
    ctx.filter = "none";

    // pixel pipeline (exposure/highlights/shadows/warmth/tint/grain)
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;

    const exposure = adjustments.exposure / 100; // -1..1
    const highlights = adjustments.highlights / 100;
    const shadows = adjustments.shadows / 100;
    const warmth = adjustments.warmth / 100;
    const tint = adjustments.tint / 100;
    const grain = adjustments.grain / 100;

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i] / 255;
      let g = d[i + 1] / 255;
      let b = d[i + 2] / 255;

      // exposure
      const exp = exposure * 0.25;
      r = clamp(r + exp, 0, 1);
      g = clamp(g + exp, 0, 1);
      b = clamp(b + exp, 0, 1);

      // luminance
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // highlights/shadows
      if (lum > 0.6) {
        const f = (lum - 0.6) / 0.4; // 0..1
        const amt = highlights * f * 0.15;
        r = clamp(r + amt, 0, 1);
        g = clamp(g + amt, 0, 1);
        b = clamp(b + amt, 0, 1);
      } else if (lum < 0.4) {
        const f = (0.4 - lum) / 0.4; // 0..1
        const amt = shadows * f * 0.15;
        r = clamp(r + amt, 0, 1);
        g = clamp(g + amt, 0, 1);
        b = clamp(b + amt, 0, 1);
      }

      // warmth: R up, B down
      r = clamp(r + warmth * 0.08, 0, 1);
      b = clamp(b - warmth * 0.08, 0, 1);

      // tint: G down/up vs R+B
      g = clamp(g - tint * 0.06, 0, 1);
      r = clamp(r + tint * 0.03, 0, 1);
      b = clamp(b + tint * 0.03, 0, 1);

      // grain
      if (grain > 0) {
        const n = (Math.random() - 0.5) * grain * 0.06;
        r = clamp(r + n, 0, 1);
        g = clamp(g + n, 0, 1);
        b = clamp(b + n, 0, 1);
      }

      d[i] = Math.round(r * 255);
      d[i + 1] = Math.round(g * 255);
      d[i + 2] = Math.round(b * 255);
    }

    ctx.putImageData(imageData, 0, 0);

    // vignette
    if (adjustments.vignette > 0) {
      const v = adjustments.vignette / 100;
      const inner = Math.min(w, h) * 0.25;
      const outer = Math.max(w, h) * 0.75;
      const grd = ctx.createRadialGradient(w / 2, h / 2, inner, w / 2, h / 2, outer);
      grd.addColorStop(0, "rgba(0,0,0,0)");
      grd.addColorStop(1, `rgba(0,0,0,${0.55 * v})`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    }

    // sharpness (cheap “pop”)
    if (adjustments.sharpness > 0) {
      const amount = adjustments.sharpness / 100;
      ctx.globalAlpha = 0.35 * amount;
      ctx.filter = "contrast(110%)";
      ctx.drawImage(canvas, 0, 0);
      ctx.globalAlpha = 1;
      ctx.filter = "none";
    }
  }, [adjustments]);

  // draw whenever adjustments change (after image exists)
  useEffect(() => {
    if (!imgRef.current) return;
    draw();
  }, [draw]);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const out = new File([blob], file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "") + "-edited.png", {
          type: "image/png",
        });
        onSave(out);
      },
      "image/png",
      0.95
    );
  }, [file.name, onSave]);

  const panel = useMemo(() => {
    if (tab === "filters") {
      return (
        <div className="space-y-3">
          <div className="text-white/80 text-sm font-medium">פילטרים</div>
          <div className="grid grid-cols-2 gap-2">
            {FILTER_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.values)}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-white/85 text-sm transition"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={() => setAdjustments(DEFAULTS)}
              className="w-full flex items-center justify-center gap-2"
            >
              <IconRefresh />
              אפס הכל
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-white/80 text-sm font-medium">התאמות</div>

        <RangeRow
          label="בהירות"
          value={adjustments.brightness}
          min={0}
          max={200}
          onChange={(v) => setAdjustments((p) => ({ ...p, brightness: v }))}
        />
        <RangeRow
          label="ניגודיות"
          value={adjustments.contrast}
          min={0}
          max={200}
          onChange={(v) => setAdjustments((p) => ({ ...p, contrast: v }))}
        />
        <RangeRow
          label="רוויה"
          value={adjustments.saturate}
          min={0}
          max={200}
          onChange={(v) => setAdjustments((p) => ({ ...p, saturate: v }))}
        />

        <div className="h-px bg-white/10 my-2" />

        <RangeRow
          label="חשיפה"
          value={adjustments.exposure}
          min={-100}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, exposure: v }))}
        />
        <RangeRow
          label="היילייטס"
          value={adjustments.highlights}
          min={-100}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, highlights: v }))}
        />
        <RangeRow
          label="צללים"
          value={adjustments.shadows}
          min={-100}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, shadows: v }))}
        />

        <div className="h-px bg-white/10 my-2" />

        <RangeRow
          label="חום/קור"
          value={adjustments.warmth}
          min={-100}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, warmth: v }))}
        />
        <RangeRow
          label="Tint (ירוק/מג׳נטה)"
          value={adjustments.tint}
          min={-100}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, tint: v }))}
        />

        <div className="h-px bg-white/10 my-2" />

        <RangeRow
          label="חדות"
          value={adjustments.sharpness}
          min={0}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, sharpness: v }))}
        />
        <RangeRow
          label="וינייט"
          value={adjustments.vignette}
          min={0}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, vignette: v }))}
        />
        <RangeRow
          label="גרעיניות"
          value={adjustments.grain}
          min={0}
          max={100}
          onChange={(v) => setAdjustments((p) => ({ ...p, grain: v }))}
        />

        <div className="pt-2">
          <Button
            variant="secondary"
            onClick={() => setAdjustments(DEFAULTS)}
            className="w-full flex items-center justify-center gap-2"
          >
            <IconRefresh />
            אפס הכל
          </Button>
        </div>
      </div>
    );
  }, [adjustments, applyPreset, tab]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose} // ✅ קליק בחוץ סוגר
      >
        <motion.div
          className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e1b] shadow-2xl"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onMouseDown={(e) => e.stopPropagation()} // ✅ קליק בפנים לא סוגר
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-white/85 text-sm font-medium">עריכת תמונה</div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <button
                  className={`px-3 py-2 text-xs transition ${
                    tab === "filters" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => setTab("filters")}
                >
                  פילטרים
                </button>
                <button
                  className={`px-3 py-2 text-xs transition ${
                    tab === "adjustments" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => setTab("adjustments")}
                >
                  התאמות
                </button>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <IconClose />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0">
            {/* Left panel */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/10 p-4 max-h-[70vh] overflow-auto">
              {panel}
            </div>

            {/* Preview */}
            <div className="p-4 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {/* hidden img that feeds the canvas */}
              <img
                ref={imgRef}
                src={imgSrc}
                alt=""
                className="hidden"
                onLoad={() => {
                  // ensure first draw
                  draw();
                }}
              />

              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-4 py-3 bg-black/20">
            <Button variant="secondary" onClick={onClose}>
              ביטול
            </Button>
            <Button onClick={handleSave}>שמור שינויים</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageEditorModal;
