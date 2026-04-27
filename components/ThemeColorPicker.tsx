"use client"

const PRESET_COLORS = [
  "#000000",
  "#1f2937",
  "#4b5563",
  "#9d174d",
  "#ea580c",
  "#65a30d",
  "#0f766e",
  "#2563eb",
]

interface ThemeColorPickerProps {
  value: string
  showPresets?: boolean
  onChange: (color: string) => void
}

export function ThemeColorPicker({
  value,
  onChange,
  showPresets = true,
}: ThemeColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-12 cursor-pointer rounded-sm border border-black/10 bg-transparent"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-black"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {showPresets &&
          PRESET_COLORS.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              className={`h-10 w-10 cursor-pointer rounded-sm border transition ${
                color === value
                  ? "border-black ring-2 ring-black/20"
                  : "border-black/10 hover:border-black/30"
              }`}
            />
          ))}
      </div>
    </div>
  )
}
