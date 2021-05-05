/**
 * name: Account cash payment
 * subject: Account payment taken in cash
 */

const [invoiceNumber] = getInputs([
  { label: "Invoice number (leave blank if not applicable)" },
]);

const [accountNumber, accountName] = invoiceNumber 
  ? ["", ""]
  : getInputs([
    { label: "Account number" },
    { label: "Account name" },
  ]);

const [paymentAmount, repName] = getInputs([
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
      ${invoiceNumber
        ? `
          Invoice number: ${invoiceNumber}<br />
        `
        : `
          Account number: ${accountNumber}<br />
          Account name: ${accountName}<br />
        `
      }
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    </p>
  </block>
`;
