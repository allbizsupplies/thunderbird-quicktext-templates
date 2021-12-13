/**
 * name: Deposit required
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
  `${orderID ? `[Order #${orderID}]` : ""} Deposit required for your order`
);

return template`
  <heading>
    We need a deposit payment for your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Your invoice is attached.
  </p>
  
  <p>
    Please pay a 50% deposit (or the full amount of the invoice) so we can start your order. 
  </p>

  <payment-options order-id="${orderID}" email="print@allbizsupplies.biz" />
`;
