/**
 * name: Order ready to collect
 * subject: Your order is ready to collect
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
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
