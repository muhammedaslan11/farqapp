export const currencySymbols: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
}

export const formatCurrency = (value: number, currency: string) => {
  const symbol = currencySymbols[currency] ?? currency
  return `${symbol} ${value.toFixed(2).replace(/\.00$/, "")}`
}

export const slugify = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

export const classNames = (
  ...classes: Array<string | false | null | undefined>
) => classes.filter(Boolean).join(" ")

const normalizeHex = (input: string, fallback = "#111827") => {
  if (!input) return fallback
  const sanitized = input.startsWith("#") ? input.slice(1) : input
  if (sanitized.length === 3) {
    const expanded = sanitized
      .split("")
      .map((char) => char + char)
      .join("")
    return `#${expanded.toLowerCase()}`
  }
  if (sanitized.length === 6) {
    return `#${sanitized.toLowerCase()}`
  }
  return fallback
}

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex)
  const bigint = Number.parseInt(normalized.slice(1), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (value: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(value)))
    return clamped.toString(16).padStart(2, "0")
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const mixHexColors = (hexA: string, hexB: string, amount: number) => {
  const ratio = Math.max(0, Math.min(1, amount))
  const colorA = hexToRgb(hexA)
  const colorB = hexToRgb(hexB)
  const mix = (channelA: number, channelB: number) =>
    channelA * (1 - ratio) + channelB * ratio
  return rgbToHex(mix(colorA.r, colorB.r), mix(colorA.g, colorB.g), mix(colorA.b, colorB.b))
}

const getLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex)
  const transform = (value: number) => {
    const channel = value / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  }
  const red = transform(r)
  const green = transform(g)
  const blue = transform(b)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export const getMenuPalette = (color: string) => {
  const base = normalizeHex(color)
  const luminance = getLuminance(base)
  const isDark = luminance < 0.45
  const onBase = isDark ? "#ffffff" : "#0f172a"
  const secondaryText = isDark ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.65)"
  const background = "#ffffff"
  const device = mixHexColors(base, isDark ? "#05070d" : "#f8fafc", isDark ? 0.25 : 0.97)
  const surface = mixHexColors(base, isDark ? "#0b1221" : "#ffffff", isDark ? 0.18 : 0.92)
  const card = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.03)"
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.15)"
  const accent = mixHexColors(base, "#ffffff", isDark ? 0.25 : 0.1)
  const subtleAccent = mixHexColors(base, "#ffffff", 0.6)
  const chipBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.06)"

  return {
    base,
    device,
    background,
    surface,
    card,
    cardBorder,
    accent,
    subtleAccent,
    chipBg,
    primaryText: onBase,
    secondaryText,
    onBase,
    isDark,
  }
}
