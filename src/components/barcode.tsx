import { encodeEan13 } from "@/lib/barcode";

/** Static SVG rendering of an EAN-13 / UPC-A code with human-readable digits. */
export function Barcode({ code, className = "" }: { code: string; className?: string }) {
  const enc = encodeEan13(code);
  if (!enc) return null;
  const m = 2; // module width
  const h = 56; // bar height
  const guardExtra = 8;
  const width = (enc.bits.length + 14) * m; // 7 quiet modules each side
  const height = h + guardExtra + 16;
  const isGuard = (i: number) => enc.guards.some(([a, b]) => i >= a && i < b);
  const bars: { x: number; tall: boolean }[] = [];
  for (let i = 0; i < enc.bits.length; i++) if (enc.bits[i] === "1") bars.push({ x: (i + 7) * m, tall: isGuard(i) });
  const d = enc.digits;
  const leftGroupX = (7 + 3) * m;
  const rightGroupX = (7 + 50) * m;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={`Cod de bare ${d}`} className={className}>
      <rect width={width} height={height} fill="#fff" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={m} height={b.tall ? h + guardExtra : h} fill="#1c1c1c" />
      ))}
      <g fill="#1c1c1c" fontFamily="ui-monospace, Menlo, monospace" fontSize="12" textAnchor="middle">
        <text x={3.5 * m} y={height - 2}>
          {d[0]}
        </text>
        <text x={leftGroupX + 21 * m} y={height - 2} textLength={40 * m} lengthAdjust="spacing">
          {d.slice(1, 7)}
        </text>
        <text x={rightGroupX + 21 * m} y={height - 2} textLength={40 * m} lengthAdjust="spacing">
          {d.slice(7)}
        </text>
      </g>
    </svg>
  );
}
