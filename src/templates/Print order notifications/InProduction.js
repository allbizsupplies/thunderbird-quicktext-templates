/**
 * name: In production
 * subject: We are making your order
 */

const [orderID, projectName, servicePriority, estimatedCompletionDate] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
  { label: "Estimated completion date" },
]);

return template`
  <heading>
    We have started making your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
    estimated-completion-date="${estimatedCompletionDate}"
  />
`;
