/**
 * name: Web order payment required
 * subject: Payment required for web order
 */

const [orderNumber, paymentAmount] = getInputs(
  [
    { name: "Web order number" },
    { name: "Payment amount required" },
  ]
);

return container(`
  ${heading(`
    Web order payment required
  `)}

  ${eChoicePaymentDetails(orderNumber, paymentAmount)}

  ${paragraph(`
    Your web order is ready for dispatch, however for security reasons
    we need to cancel the credit card payment that you made online, 
    and have not charged your credit card.
  `)}

  ${block(`
    ${paragraph(`Order number: ${orderID}`)}
    ${paragraph(`Payment required: ${paymentAmount}`)}
  `, colors.lightGrey)}

  ${paymentOptions}
`);
