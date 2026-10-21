const GLYPHS: Record<string, string[]> = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000']
};

/**
 * Returns voxel cells (in grid units) for a 5x7 pixel font.
 * `anchor` centers the layout on a given character index instead of the whole string.
 */
export function voxelCells(text: string, anchor?: number) {
  const chars = text.toUpperCase().split('');
  const center = anchor !== undefined ? anchor * 6 + 2 : (chars.length * 6 - 2) / 2;
  const cells: {x: number;y: number;}[] = [];
  chars.forEach((ch, ci) => {
    const glyph = GLYPHS[ch] ?? GLYPHS[' '];
    glyph.forEach((row, r) => {
      row.split('').forEach((bit, col) => {
        if (bit === '1') cells.push({ x: ci * 6 + col - center, y: 6 - r });
      });
    });
  });
  return cells;
}