/**
 * name: Awaiting print ready files
 * subject: Please send print-ready PDF files so we can start your order
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
    We need print ready PDF files before we can make your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Please send us the following print ready PDF files so we can start making your order.
  `)}

  ${list([``])}
`);
