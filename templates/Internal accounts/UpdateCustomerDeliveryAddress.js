/**
 * name: Update customer delivery address
 * subject: Update customer delivery address
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);

return container(`
  ${heading(`
    Update customer delivery address
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${paragraph(`
    <strong>New delivery address:</strong>
  `)}

  ${paragraph(``)}
`);
