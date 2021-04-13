/**
 * name: Order dispatched
 * subject: We have dispatched your order
 */

const [orderID, projectName] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
]);

return container(`
  ${heading(`
    Order dispatched
  `)}

  ${printOrderDetails(orderID, projectName)}

  ${paragraph(`
    Your order has been dispatched.
  `)}
`);
