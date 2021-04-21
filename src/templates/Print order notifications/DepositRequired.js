/**
 * name: Deposit required
 * subject: Deposit required for your order
 */

const [orderID, projectName, depositPaymentAmount, servicePriority] = getInputs(
  [
    { label: "Order ID" },
    { label: "Project name" },
    { label: "Deposit amount" },
    {
      label: "Service priority",
      options: servicePriorityOptions,
    },
  ]
);

return template`
  <heading>
    We need a deposit payment for your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Please pay us the following deposit amount so we can start your order.
  </p>

  <block>
    <p>
      Deposit payment required: $${depositPaymentAmount}
    </p>
  </block>

  <payment-options order-id="${orderID}" />
`;
