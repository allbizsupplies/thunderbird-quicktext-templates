/**
 * name: Update customer contact details
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

setSubject(`Update customer contact details`);

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
    Name:<br />
    Phone:<br />
    Email:
  </p>
`;
