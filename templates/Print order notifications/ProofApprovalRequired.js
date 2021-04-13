/**
 * name: Proof approval required
 * subject: Proof approval required
 */

const [orderID, projectName, servicePriority] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
  {
    name: "Service priority",
    options: servicePriorityOptions,
  },
]);

return container(`
  ${heading(`
    Proof approval required
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Your proof is attached. Please check it carefully and seed us your approval if everything is correct.
  `)}

  ${paragraph(`
    We won't start making your job until you approve your proof.
  `)}

  ${paragraph(`<strong>Check everything!</strong> You are responsible for ensuring that your job doesn't have any mistakes of
  any kind.`)}

  ${list([
    `Check all spelling, numbers, and names.`,
    `Make sure nothing is missing.`,
    `Make sure everything is in the right place.`,
    `Go back and check it again.`,
  ])}

  ${paragraph(`
    <strong>Warning about colour printing:</strong>
    if your job will be printed in colour, and you need to check the exact colours that will be
    printed, then you should contact us to arrange a <em>production proof</em>. (Your screen
    and printer cannot accurately reproduce the colours on the final product.)`)}

  <div style="text-align:center">
    ${paragraph(`
      ${buttonLink(
        `Approve proof`,
        encodeMailUrl(
          `print@allbizsupplies.biz`,
          `Proof approved for order ${orderID}`,
          `I have checked the proof for ${orderID} and confirm that it is ready for production.`
        )
      )}
      ${buttonLink(
        `Request changes`,
        encodeMailUrl(
          `print@allbizsupplies.biz`,
          `Artwork changes required for order ${orderID}`,
          `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
        )
      )}
    `)}
  </div>
`);
