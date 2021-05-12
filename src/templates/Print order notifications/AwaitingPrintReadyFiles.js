/**
 * name: Awaiting print ready files
 */

return {
  subject: () => {
    const [orderID] = getInputs([{ label: "Order ID" }]);
    return `${orderID ? `[Order #${orderID}]` : ""} Please send print-ready PDF files so we can start your order`;
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
  },
};
