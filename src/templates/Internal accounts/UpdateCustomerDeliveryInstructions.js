/**
 * name: Update customer delivery instructions
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

const [deliveryInstructionsValue] = getInputs([
  {
    label: "Delivery instructions",
    options: [
      { label: "Deliver by Allbiz Driver" },
      { label: "Deliver by Courier" },
      { label: "SMS when ready to collect" },
      { label: "Email when ready to collect", email: true },
      { label: "Call when ready to collect" },
      { label: "other", other: true },
    ],
  },
]);

const deliveryInstructions = deliveryInstructionsValue.other
  ? getInputs([{ label: "Delivery instructions (other)" }]).shift()
  : deliveryInstructionsValue.email
  ? `
    ${deliveryInstructionsValue.label}:<br />
    ${getInputs([{ label: "Email address" }]).shift()}
  `
  : deliveryInstructionsValue.label;

setSubject(`Update customer delivery instructions`);
setTo(`accounts@allbizsupplies.biz`);

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
  <br/>
`;
