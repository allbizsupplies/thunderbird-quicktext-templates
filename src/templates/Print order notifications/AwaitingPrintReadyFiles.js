/**
 * name: Awaiting print ready files
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

setSubject(
  `${
    orderID ? `[Order #${orderID}]` : ""
  } Please send print-ready PDF files so we can start your order`
);

return template`
  <heading>
    We need print ready PDF files before we can make your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Please send us the following print ready PDF files so we can start making your order.
  </p>

  <ul>
    <li></li>
  </ul>
`;
