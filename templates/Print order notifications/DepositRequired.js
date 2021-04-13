/**
 * name: Deposit required
 * subject: Deposit required for your order
 */

const [orderID, projectName, depositPaymentAmount, servicePriority] = getInputs(
  [
    { name: "Order ID" },
    { name: "Project name" },
    { name: "Deposit amount" },
    {
      name: "Service priority",
      options: servicePriorityOptions,
    },
  ]
);

return container(`
  ${heading(`
    We need a deposit payment for your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Please pay us the following deposit amount so we can start your order.
  `)}

  ${block(
    `
    ${paragraph(`
      Deposit payment required: $${depositPaymentAmount}
    `)}
  `,
    colors.lightGrey
  )}

  ${paymentOptions}
`);
