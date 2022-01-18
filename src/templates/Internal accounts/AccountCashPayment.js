/**
 * name: Account cash payment
 */

const [invoiceNumber] = getInputs([
  { label: "Invoice number (leave blank if not applicable)" },
]);

const [accountNumber, accountName] = invoiceNumber
  ? ["", ""]
  : getInputs([{ label: "Account number" }, { label: "Account name" }]);

const [paymentAmount, repName] = getInputs([
  { label: "Payment amount" },
  { label: "Taken by" },
]);

setSubject(`Account payment taken in cash`);
setTo(`accounts@allbizsupplies.biz`);

return template`
  <p>
    We have taken an account payment in cash.
  </p>

  <block>  
    <p>
      <strong>Payment details:</strong><br />
      ${
        invoiceNumber
          ? `
          Invoice number: ${invoiceNumber}<br />
        `
          : `
          Invoice number: N/A (customer paying off account balance)<br />
          Account number: ${accountNumber}<br />
          Account name: ${accountName}<br />
        `
      }
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    </p>
  </block>
  <br/>
`;
