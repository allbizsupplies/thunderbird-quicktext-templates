/**
 * name: ETA request
 * subject: ETA for purchase order
 */

const [purchaseOrderNumber] = getInputs([
  { name: "Purchase order number" },
])

return container(`
  ${heading(`
    ETA for purchase order
  `)}

  ${paragraph(`
    Please provide an ETA for the following items from our purchase order ${purchaseOrderNumber}:
  `)}

  ${list([""])}

  ${paragraph(`
    Thank you.
  `)}
`);
