/**
 * name: Account cash payment
 * subject: Account payment taken in cash
 */

const [accountNumber, accountName, paymentAmount, repName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
  { label: "Payment amount" },
  { label: "Taken by" },
]);

return template`
  <p>
    We have taken an account payment in cash.
  </p>

  <block>  
    <p>
      <strong>Payment details:</strong><br />
      Account number: ${accountNumber}<br />
      Account name: ${accountName}<br />
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    </p>
  </block>
`;
