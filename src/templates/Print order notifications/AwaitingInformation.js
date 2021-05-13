/**
 * name: Awaiting information
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
  } We need more info so we can start your order`
);

return template`
  <heading>
    We need more info before we can make your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Please give us the following information so we can start making your order:
  </p>

  <ul>
    <li></li>
  </ul>
`;
