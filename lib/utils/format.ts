/**
 * Formats a currency amount in Indian Rupees (INR) with Lakh abbreviations where appropriate.
 * Safe for use in both Server Components and Client Components.
 */
export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const inLakhs = (amount / 100000).toFixed(amount % 100000 === 0 ? 1 : 2);
    return `₹${inLakhs} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
