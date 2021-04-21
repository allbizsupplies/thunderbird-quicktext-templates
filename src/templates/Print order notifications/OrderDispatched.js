/**
 * name: Order dispatched
 * subject: We have dispatched your order
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
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
