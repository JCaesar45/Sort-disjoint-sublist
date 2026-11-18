type Coupon = "WELCOME5" | "VIP10";

interface Quote {
  unit: number;
  qty: number;
  subtotal: number;
  discount: number;
  total: number;
}

const COUPONS: Record<Coupon, number> = { WELCOME5: 0.05, VIP10: 0.1 };

function quote(unit: number, qty: number, coupon?: string): Quote {
  if (!Number.isFinite(unit) || unit <= 0) throw new RangeError("unit must be positive");
  if (!Number.isInteger(qty) || qty < 1) throw new RangeError("qty must be a positive integer");
  const subtotal = unit * qty;
  const tier = qty >= 3 ? 0.08 : qty === 2 ? 0.03 : 0;
  const code = coupon && coupon in COUPONS ? COUPONS[coupon as Coupon] : 0;
  const rate = Math.min(tier + code, 0.2);
  const discount = Math.round(subtotal * rate * 100) / 100;
  return { unit, qty, subtotal, discount, total: Math.round((subtotal - discount) * 100) / 100 };
}

console.log(quote(8400, 2, "VIP10"));
console.log(quote(14900, 3));
