/**
 * name: Remaining order items dispatched
 * subject: Part of your order has been dispatched
 */

const [orderNumber, shipmentType] = getInputs([
  { name: "Order number" },
  {
    name: "Part order type",
    options: [
      { isRemainder: false, label: "This is the first part of the order" },
      { isRemainder: true, label: "This is the final part of the order" },
    ],
  },
]);

const { isRemainder } = shipmentType;

return isRemainder
  ? container(`
    ${heading(`
      We've dispatched the remainder of your order
    `)}

    ${block(`
      ${paragraph(`
        Order number: ${orderNumber}
      `)}
    `)}

    ${paragraph(`
      We've dispatched the remaining items in your order.
    `)}
  `)
  : container(`
    ${heading(`
      We've dispatched part of your order
    `)}

    ${block(`
      ${paragraph(`
        Order number: ${orderNumber}
      `)}
    `)}

    ${paragraph(`
      We've dispatched part of your order to make sure you get
      your items as soon as possible.
    `)}

    ${paragraph(`
      We will dispatch the remainder of your order once the items
      are ready to ship.
    `)}
  `);
