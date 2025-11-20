import type { discountT } from '@/features/vendor/schema/productSchema'

export function finalPriceCalculator(
  price: number,
  discount: discountT
): number {
  const now = new Date()
  let finalPrice = price
  if (
    discount &&
    (!discount.validUntil || new Date(discount.validUntil) > now)
  ) {
    if (discount.type === 'percentage') {
      finalPrice = price - (price * discount.value) / 100
    } else if (discount.type === 'fixed') {
      finalPrice = price - discount.value
    }

    finalPrice = Math.max(finalPrice, 0)
  }

  return finalPrice
}
