export function applyCoupon(coupon, totalBefore) {
  let subTotalAfterCoupon = totalBefore;
  const now = new Date();

  if (
    coupon.isActive === false ||
    (coupon.validFrom && now < coupon.validFrom) ||
    (coupon.validTo && now > coupon.validTo) ||
    coupon.maxUsage <= coupon.usedCount
  ) {
    return parseFloat(subTotalAfterCoupon.toFixed(2));
  }

  if (coupon.type === "percentage") {
    subTotalAfterCoupon = totalBefore - (totalBefore * coupon.value) / 100;
  } else if (coupon.type === "fixed") {
    subTotalAfterCoupon = totalBefore - coupon.value;
  }
  subTotalAfterCoupon = Math.max(subTotalAfterCoupon, 0);

  return parseFloat(subTotalAfterCoupon.toFixed(2));
}
