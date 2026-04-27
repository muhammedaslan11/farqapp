"use client"

interface CurrencySelectorProps {
  value: string
  onChange: (currency: string) => void
}

const currencies = [
  { code: "TRY", label: "₺ Türk Lirası" },
  { code: "USD", label: "$ Amerikan Doları" },
  { code: "EUR", label: "€ Euro" },
]

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <select
      className="input-black"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.label}
        </option>
      ))}
    </select>
  )
}
