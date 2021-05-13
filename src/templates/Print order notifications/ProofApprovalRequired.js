/**
 * name: Proof approval required
 */

const [orderID, projectName, servicePriority, artworkCharge] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
  { label: "Accrued artwork charge (leave blank if not applicable)" },
]);

setSubject(`${orderID ? `[Order #${orderID}]` : ""} Proof approval required`);

return template`
  <heading>
    Proof approval required
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <block style="background-color:${colors.warning}">
    ${
      artworkCharge
        ? `
      <p>Your artwork charge so far: $${artworkCharge}</p>
    `
        : ``
    }
    <p>
      If you make changes that are not part of the directions that you've 
      discussed with us, then you will incur additional charges to cover
      these changes.
    </p>
  </block>

  <p>
    Your proof is attached. Please check it carefully and send us your
    approval if everything is correct.
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

  <p>
    <strong>Warning about colour printing:</strong>
    if your job will be printed in colour, and you need to check the exact colours that will be
    printed, then you should contact us to arrange a <em>production proof</em>. (Your screen
    and printer cannot accurately reproduce the colours of the final product.)
  </p>

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
