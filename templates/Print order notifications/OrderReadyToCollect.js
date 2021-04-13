/**
 * name: Order ready to collect
 * subject: Your order is ready to collect
 */

const [orderID, projectName] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
]);

return container(`
  ${heading(`
    Order ready to collect
  `)}

  ${printOrderDetails(orderID, projectName)}

  ${paragraph(`
    Your order is ready to collect. Please contact us if you need us to deliver it to you.
  `)}
`);
