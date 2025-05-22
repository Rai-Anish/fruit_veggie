import { finalPriceCalculator } from "./finalPriceCalculator.js"; // This calculates individual item's final price

export const cartPriceCalculator = (items) => {
  let subTotal = 0; // Total after product-level discounts
  let subTotalBeforeDiscount = 0; // Total before any discounts (raw sum of original prices)

  const cartWithLineTotalAndDiscount = items.map((item) => {
    const product = item.product;
    const finalPricePerUnit = parseFloat(
      finalPriceCalculator(product?.price, product?.discount).toFixed(2)
    );
    const lineTotal = parseFloat(
      (finalPricePerUnit * item.quantity).toFixed(2)
    );
    const originalLineTotal = parseFloat(
      (product.price * item.quantity).toFixed(2)
    );

    subTotalBeforeDiscount += originalLineTotal;
    subTotal += lineTotal;

    return {
      productId: product._id,
      name: product.name,
      quantity: item.quantity,
      price: parseFloat(product.price.toFixed(2)),
      discount: product.discount,
      finalPrice: finalPricePerUnit,
      lineTotal: lineTotal,
    };
  });

  return {
    subTotal: parseFloat(subTotal.toFixed(2)),
    subTotalBeforeDiscount: parseFloat(subTotalBeforeDiscount.toFixed(2)),
    cartItems: cartWithLineTotalAndDiscount,
  };
};
