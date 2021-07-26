/**
 * name: Order ready to collect
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
]);

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} Your order is ready to collect`
);

return template`
  <heading>
    Order ready to collect
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
  />
  
  <p>
    Your order is ready to collect. Please contact us if you need us to deliver it to you.
  </p>

  <block style="background-color:#ffee4e;">
    <p><strong>Collecting orders during COVID-19 lockdown</strong></p>
    <ol>
      <li>Call us once you arrive in the car park.</li>
      <li>We will meet you at the front of the store and give you your order. </li>
    </ol>
  </block>
`;
