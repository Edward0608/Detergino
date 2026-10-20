/** EAN-13 / UPC-A encoder producing module bits for an SVG barcode. */
const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const G = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
const R = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

export type Encoded = { digits: string; bits: string; guards: [number, number][] };

/** Returns null when the code is not 12 or 13 digits. UPC-A (12) is encoded as EAN-13 with a leading 0. */
export function encodeEan13(code: string): Encoded | null {
  if (!/^\d{12,13}$/.test(code)) return null;
  const digits = code.length === 12 ? `0${code}` : code;
  const first = Number(digits[0]);
  const parity = PARITY[first];
  let bits = "101";
  for (let i = 1; i <= 6; i++) {
    const d = Number(digits[i]);
    bits += parity[i - 1] === "L" ? L[d] : G[d];
  }
  bits += "01010";
  for (let i = 7; i <= 12; i++) bits += R[Number(digits[i])];
  bits += "101";
  // guard bar module ranges (start, center, end) drawn taller
  return { digits, bits, guards: [[0, 3], [45, 50], [92, 95]] };
}

export function ean13CheckDigitValid(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  const sum = code
    .slice(0, 12)
    .split("")
    .reduce((s, ch, i) => s + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10 === Number(code[12]);
}
