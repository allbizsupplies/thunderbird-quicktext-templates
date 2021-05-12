/**
 * name: Order ready to collect
 */

return {
  subject: () => {
    const [orderID] = getInputs([{ label: "Order ID" }]);
    return `${orderID ? `[Order #${orderID}]` : ""} Your order is ready to collect`;
  },
  body: () => {
    const orderID = parseOrderIDFromSubject();
    const [projectName] = getInputs([
      { label: "Project name" },
    ]);

    return template`
      <heading>
        Order ready to collect
      </heading>
    
      <print-order-details
        order-id="${orderID}"
        project-name="${projectName}"
      />
      
      <p>
        Your order is ready to collect. Please contact us if you need us to deliver it to you.
      </p>
    `;
  },
};
