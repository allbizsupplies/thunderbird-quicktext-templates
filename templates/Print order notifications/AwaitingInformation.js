/**
 * name: Awaiting information
 * subject: We need more info so we can start your order
 */

const [orderID, projectName, servicePriority] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
  {
    name: "Service priority",
    options: servicePriorityOptions,
  },
]);

return container(`
  ${heading(`
    We need more info before we can make your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Please give us the following information so we can start making your order:
  `)}

  ${list([``])}
`);
