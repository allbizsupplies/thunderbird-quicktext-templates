/**
 * name: Hardcopy proof ready
 * subject: Hardcopy proof is ready to view
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

return template`
  <heading>
    Hardcopy proof ready to view
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Your hardcopy proof is ready to view in-store. Please contact us if
    you need us to deliver it to you.
  </p>

  <p>
    We can't put your order into the production queue until you approve
    your proof.
  </p>

  <p>
    <strong>Check everything!</strong> You are responsible for ensuring
    that your job doesn't have any mistakes of any kind.
  </p>

  <ul>
    <li>Check all spelling, numbers, and names.</li>
    <li>Make sure nothing is missing.</li>
    <li>Make sure everything is in the right place.</li>
    <li>Go back and check it again.</li>
  </ul>

  <div style="text-align:center">
    <p>
      <button-link href="${encodeMailUrl(
        `print@allbizsupplies.biz`,
        `Proof approved for order ${orderID}`,
        `I have checked the proof for order ${orderID} and confirm that it is ready for production.`
      )}">
        Approve proof
      </button-link>
      <button-link href="${encodeMailUrl(
        `print@allbizsupplies.biz`,
        `Artwork changes required for order ${orderID}`,
        `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
      )}">
        Request changes
      </button-link>
    </p>
  </div>
`;
