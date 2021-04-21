/**
 * name: Update customer contact details
 * subject: Update customer contact details
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

return template`
  <heading>
    Update customer contact details
  </heading>

  <block>
    <p>
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    </p>
  </block>

  <p>
    <strong>New contact details:</strong><br />
    <strong>Name:</strong>&nbsp;<br />
    <strong>Phone:</strong>&nbsp;<br />
    <strong>Email:</strong>&nbsp;
  </p>
`;
