/**
 * name: In production
 */

const [orderID, projectName, servicePriority, estimatedCompletionDate] =
  getInputs([
    { label: "Order ID" },
    { label: "Project name" },
    {
      label: "Service priority",
      options: servicePriorityOptions,
    },
    { label: "Estimated completion date" },
  ]);

setSubject(
  `${
    orderID ? `[Order #${orderID}]` : ""
  } Your order is in the production queue`
);

return template`
  <heading>
    We have put your order into the production queue
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
    estimated-completion-date="${estimatedCompletionDate}"
    offer-service-priority-upgrade=""
  />
`;
