/**
 * name: Update purchase order
 * subject: Update purchase order
 */

const [purchaseOrderNumber, attachmentType] = getInputs([
  { name: "Purchase order number" },
  {
    name: "Attachment Type",
    options: [
      { label: "Invoice" },
      { label: "Quote" },
    ],
  },
]);

return container(`
  ${heading(`
    Purchase order amendment required
  `)}

  ${block(`
    ${paragraph(`
      Your purchase order: ${purchaseOrderNumber}
    `)}
  `)}

  ${paragraph(`
    Please update your purchase order to match the attached ${attachmentType.label}.
  `)}
`);
