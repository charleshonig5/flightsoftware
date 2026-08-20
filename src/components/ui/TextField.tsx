"use client";

/**
 * The system form field: tile fill, 8px radius, caption label over body input,
 * optional unit caption at the right. The whole field is a label — clicking
 * anywhere focuses the input. Brand-soft focus ring.
 */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  unit,
  inputMode,
  inputRef,
  rightIcon,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  inputMode?: "decimal" | "text";
  inputRef?: (el: HTMLInputElement | null) => void;
  /** Rendered centered at the field's right edge (e.g. calendar toggle) */
  rightIcon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`relative flex cursor-text flex-col gap-1.5 rounded-field bg-tile px-3.5 py-2 focus-within:outline-2 focus-within:outline-brand-soft ${className}`}
    >
      <span className="text-caption text-ink-muted">{label}</span>
      <span className="flex items-baseline gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-body outline-none placeholder:text-ink-faint"
        />
        {unit && <span className="text-caption leading-none text-ink-muted">{unit}</span>}
      </span>
      {rightIcon && (
        <span className="absolute top-1/2 right-3.5 flex -translate-y-1/2">{rightIcon}</span>
      )}
    </label>
  );
}
