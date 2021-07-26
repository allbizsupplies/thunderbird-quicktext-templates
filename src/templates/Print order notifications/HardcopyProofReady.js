/**
 * name: Hardcopy proof ready
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
  `${orderID ? `[Order #${orderID}]` : ""} Hardcopy proof is ready to view`
);

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

  <tr>
    <td>
      <table style="border-collapse: collapse; width: 100%">
        <tr>
          <td style="padding: 0.25em 0.5rem; text-align: right">
            <button-link href="${encodeMailUrl(
              getFrom(),
              `Proof approved for order ${orderID}`,
              `I have checked the proof for order ${orderID} and confirm that it is ready for production.`
            )}">
              Approve proof
            </button-link>
          </td>
          <td style="padding: 0.25em 0.5rem">
            <button-link href="${encodeMailUrl(
              getFrom(),
              `Artwork changes required for order ${orderID}`,
              `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
            )}">
              Request changes
            </button-link>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;
