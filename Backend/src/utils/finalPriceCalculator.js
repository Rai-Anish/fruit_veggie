export function finalPriceCalculator(price, discount) {
  let finalPrice = price;
  if (discount) {
    if (discount.type === "percentage") {
      finalPrice = price - (price * discount.value) / 100;
    } else if (discount.type === "fixed") {
      finalPrice = price - discount.value;
    }

    finalPrice = Math.max(finalPrice, 0);
  }

  return finalPrice;
}
