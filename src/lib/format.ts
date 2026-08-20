/** Today as MM/DD/YY — the short date format used in form fields. */
export function todayShort(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}
