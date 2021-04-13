/**
 * name: Account cash payment
 * subject: Account payment taken in cash
 */

const [accountNumber, accountName, paymentAmount, repName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
  { name: "Payment amount" },
  { name: "Taken by" },
]);

return container(`
  ${paragraph(`
    Customer's account application is attached.
  `)}

  ${block(`  
    ${paragraph(`
      <strong>Payment details:</strong><br />
      Account number: ${accountNumber}<br />
      Account name: ${accountName}<br />
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    `)}
  `)}
`);
