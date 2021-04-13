/**
 * name: Update customer contact details
 * subject: Update customer contact details
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);

return container(`
  ${heading(`
    Update customer contact details
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${paragraph(`
    <strong>New contact details:</strong><br />
    <strong>Name:</strong>&nbsp;<br />
    <strong>Phone:</strong>&nbsp;<br />
    <strong>Email:</strong>&nbsp;
  `)}
`);
