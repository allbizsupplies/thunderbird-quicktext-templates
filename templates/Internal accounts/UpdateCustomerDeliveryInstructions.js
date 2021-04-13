/**
 * name: Update customer delivery instructions
 * subject: Update customer delivery instructions
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);
const [deliveryInstructionsValue] = getInputs([
  {
    name: "Delivery instructions",
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
    ? (deliveryInstructions = getInputs([{ name: "Delivery instructions" }]))
    : deliveryInstructionsValue.label;

return container(`
  ${heading(`
    Update customer delivery instructions
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${paragraph(`
    <strong>New delivery instructions:</strong><br />
    ${deliveryInstructions}
  `)}
`);
