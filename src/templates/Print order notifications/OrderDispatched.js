/**
 * name: Order dispatched
 */

return {
  subject: () => {
    const [orderID] = getInputs([{ label: "Order ID" }]);
    return `${orderID ? `[Order #${orderID}]` : ""} We have dispatched your order`;
  },
  body: () => {
    const orderID = parseOrderIDFromSubject();
    const [projectName] = getInputs([
      { label: "Project name" },
    ]);

    return template`
      <heading>
        Order dispatched
      </heading>
    
      <print-order-details
        order-id="${orderID}"
        project-name="${projectName}"
      />
    
      <p>
        Your order has been dispatched.
      </p>
    `;
  },
};
