/**
 * name: Deposit required
 */

return {
  subject: () => {
    const [orderID] = getInputs([{ label: "Order ID" }]);
    return `${orderID ? `[Order #${orderID}]` : ""} Deposit required for your order`;
  },
  body: () => {
    const orderID = parseOrderIDFromSubject();
    const [
      projectName,
      depositPaymentAmount,
      servicePriority,
    ] = getInputs([
      { label: "Project name" },
      { label: "Deposit amount" },
      {
        label: "Service priority",
        options: servicePriorityOptions,
      },
    ]);

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
  },
};
