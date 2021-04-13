/**
 * name: In production
 * subject: We are making your order
 */

const [orderID, projectName, servicePriority, estimatedCompletionDate] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
  {
    name: "Service priority",
    options: servicePriorityOptions,
  },
  { name: "Estimated completion date" },
]);

return container(`
  ${heading(`
    We have started making your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, estimatedCompletionDate)}
`);
