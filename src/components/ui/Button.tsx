const base =
  "flex cursor-pointer items-center justify-center gap-1.5 rounded-full text-body font-medium whitespace-nowrap shadow-card transition-all duration-150 active:scale-[0.97]";

const sizes = {
  /* standard: tab-bar actions, modal footers */
  md: "h-9 px-3.5",
  /* hero: page-header actions (Add Aircraft / Ask AI) */
  lg: "h-10 px-4",
} as const;

const variants = {
  /* brand gradient fill, white text — the primary action ("Ask AI", modal confirm) */
  primary: "bg-linear-to-r/srgb from-brand to-brand-strong text-white hover:opacity-85",
  /* white fill, divider hairline border, brand text — the secondary action ("Add Aircraft", modal cancel) */
  outline: "border border-divider bg-card text-brand hover:bg-brand-soft",
} as const;

/** Standard action button: `primary` (gradient) or `outline` (brand border); `lg` for page-header heroes. */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  children,
}: {
  variant?: keyof typeof variants;
  /** `lg` (40px) for page-header heroes; `md` (36px) everywhere else */
  size?: keyof typeof sizes;
  /** Stretch to share the row equally (modal footers) */
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "flex-1" : ""}`}
    >
      {children}
    </button>
  );
}
