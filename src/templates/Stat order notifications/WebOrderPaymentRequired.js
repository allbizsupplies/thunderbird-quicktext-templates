/**
 * name: Web order payment required
 */

const [orderID, paymentAmount] = getInputs([
  { label: "Web order number" },
  { label: "Payment amount required" },
]);

setSubject(`Payment required for web order`);

return template`
  <heading>
    Web order payment required
  </heading>

  <echoice-payment-details
    order-number="${orderID}"
    payment-amount="${paymentAmount}"
  />

  <p>
    Your web order is ready for dispatch, however for security reasons
    we need to cancel the credit card payment that you made online, 
    and have not charged your credit card.
  </p>

  <block>
    <p>Order number: ${orderID}</p>
    <p>Payment required: ${paymentAmount}</p>
  </block>

  <payment-options order-id="${orderID}" />
  <br/>
`;
