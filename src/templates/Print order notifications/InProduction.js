/**
 * name: In production
 */

return {
  subject: () => {
    const [orderID] = getInputs([{ label: "Order ID" }]);
    return `${orderID ? `[Order #${orderID}]` : ""} Your order is in the production queue`;
  },
  body: () => {
    const orderID = parseOrderIDFromSubject();
    const [
      projectName,
      servicePriority,
      estimatedCompletionDate,
    ] = getInputs([
      { label: "Project name" },
      {
        label: "Service priority",
        options: servicePriorityOptions,
      },
      { label: "Estimated completion date" },
    ]);

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
  },
};
