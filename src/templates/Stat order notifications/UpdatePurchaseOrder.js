/**
 * name: Update purchase order
 */

const [purchaseOrderNumber, attachmentType] = getInputs([
  { label: "Purchase order number" },
  {
    label: "Attachment Type",
    options: [{ label: "Invoice" }, { label: "Quote" }],
  },
]);

setSubject(`Update purchase order ${purchaseOrderNumber}`);

return template`
  <heading>
    Purchase order amendment required
  </heading>

  <block>
    <p>
      Your purchase order: ${purchaseOrderNumber}
    </p>
  </block>

  <p>
    Please update your purchase order to match the attached ${attachmentType.label}.
  </p>
  <br/>
`;
