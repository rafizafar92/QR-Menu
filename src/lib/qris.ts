/**
 * QRIS (EMVCo) helpers.
 */

/** CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF), returns 4-char uppercase hex. */
export function crc16(str: string): string {
  let crc = 0xffff;

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;

    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Remove a top-level TLV tag (used to drop an existing tag 54 amount). */
function removeTopLevelTag(payload: string, tagToRemove: string): string {
  let result = '';
  let offset = 0;

  while (offset + 4 <= payload.length) {
    const tag = payload.slice(offset, offset + 2);
    const lengthText = payload.slice(offset + 2, offset + 4);
    const length = Number(lengthText);

    if (!/^\d{2}$/.test(tag) || !/^\d{2}$/.test(lengthText) || !Number.isFinite(length)) {
      return payload;
    }

    const end = offset + 4 + length;
    if (end > payload.length) return payload;

    if (tag !== tagToRemove) result += payload.slice(offset, end);
    offset = end;
  }

  return offset === payload.length ? result : payload;
}

/**
 * Turn a static QRIS payload into a dynamic one with an auto-filled amount.
 * Returns null when the payload does not look like a QRIS payload.
 */
export function makeDynamicQris(payload: string, amount: number): string | null {
  if (!payload || !payload.includes('5802ID')) return null;

  // Drop the trailing "6304XXXX" CRC, switch to dynamic, and remove any old amount.
  let base = payload.slice(0, -8);
  base = base.replace('010211', '010212');
  base = removeTopLevelTag(base, '54');

  const countryCodeIndex = base.indexOf('5802ID');
  if (countryCodeIndex === -1) return null;

  const amountText = String(Math.round(amount));
  const amountField = '54' + amountText.length.toString().padStart(2, '0') + amountText;
  const withAmount = base.slice(0, countryCodeIndex) + amountField + base.slice(countryCodeIndex);

  const withCrcTag = withAmount + '6304';
  return withCrcTag + crc16(withCrcTag);
}
