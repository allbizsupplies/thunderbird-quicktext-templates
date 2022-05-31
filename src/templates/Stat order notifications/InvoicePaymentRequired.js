/**
 * name: Invoice payment required
 */

const [invoiceNumber] = getInputs([{ label: "Invoice number" }]);

setSubject(
  `${
    invoiceNumber ? `[Invoice #${invoiceNumber}]` : ""
  } Invoice payment required`
);

return template`
  <heading>
    Invoice payment required
  </heading>

  <p>
    Your invoice is attached. We will supply your order as soon as we receive payment.
    <br />
  </p>

  <payment-options order-id="${invoiceNumber}" email="stat@allbizsupplies.biz" />
  <br/>
`;
