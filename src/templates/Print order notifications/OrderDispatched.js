/**
 * name: Order dispatched
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
]);

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} We have dispatched your order`
);

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
