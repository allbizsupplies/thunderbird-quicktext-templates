/**
 * name: Update purchase order
 */

return {
  subject: () => `Update purchase order`,
  body: () => {
    const [purchaseOrderNumber, attachmentType] = getInputs([
      { label: "Purchase order number" },
      {
        label: "Attachment Type",
        options: [{ label: "Invoice" }, { label: "Quote" }],
      },
    ]);

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
    `;
  },
};
