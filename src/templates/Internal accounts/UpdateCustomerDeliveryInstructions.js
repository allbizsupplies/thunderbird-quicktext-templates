/**
 * name: Update customer delivery instructions
 */

return {
  subject: () => `Update customer delivery instructions`,
  body: () => {
    const [accountNumber, accountName] = getInputs([
      { label: "Account number" },
      { label: "Account name" },
    ]);
    const [deliveryInstructionsValue] = getInputs([
      {
        label: "Delivery instructions",
        options: [
          { label: "Deliver (Allbiz Driver)" },
          { label: "Deliver (Courier)" },
          { label: "SMS when ready to collect" },
          { label: "Call when ready to collect" },
          { label: "other" },
        ],
      },
    ]);
    const deliveryInstructions =
      deliveryInstructionsValue.label == "other"
        ? (deliveryInstructions = getInputs([
            { label: "Delivery instructions" },
          ]))
        : deliveryInstructionsValue.label;

    return template`
      <heading>
        Update customer delivery instructions
      </heading>
    
      <block>
        <p>
          Account number: ${accountNumber}<br />
          Account name: ${accountName}
        </p>
      </block>
    
      <p>
        <strong>New delivery instructions:</strong><br />
        ${deliveryInstructions}
      </p>
    `;
  },
};
