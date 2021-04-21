/**
 * name: Remaining order items dispatched
 * subject: Part of your order has been dispatched
 */

 const [orderNumber, shipmentType] = getInputs([
  { label: "Order number" },
  {
    label: "Part order type",
    options: [
      { isRemainder: false, label: "This is the first part of the order" },
      { isRemainder: true, label: "This is the final part of the order" },
    ],
  },
]);

const { isRemainder } = shipmentType;

return isRemainder
  ? template`
    <heading>
      We've dispatched the remainder of your order
    </heading>

    <block>
      <p>
        Order number: ${orderNumber}
      </p>
    </block>

    <p>
      We've dispatched the remaining items in your order.
    </p>
  `
  : template`
    <heading>
      We've dispatched part of your order
    </heading>

    <block>
      <p>
        Order number: ${orderNumber}
      </p>
    </block>

    <p>
      We've dispatched part of your order to make sure you get
      your items as soon as possible.
    </p>

    <p>
      We will dispatch the remainder of your order once the items
      are ready to ship.
    </p>
  `;
