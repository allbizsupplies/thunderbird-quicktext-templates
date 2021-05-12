/**
 * name: Awaiting information
 */

return {
  subject: () => {
    const [orderID] = getInputs([{ label: "Order ID" }]);
    return `${orderID ? `[Order #${orderID}]` : ""} We need more info so we can start your order`;
  },
  body: () => {
    const orderID = parseOrderIDFromSubject();
    const [projectName, servicePriority] = getInputs([
      { label: "Project name" },
      {
        label: "Service priority",
        options: servicePriorityOptions,
      },
    ]);

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
  },
};
