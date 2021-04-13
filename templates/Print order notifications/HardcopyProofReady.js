/**
 * name: Hardcopy proof ready
 * subject: Hardcopy proof is ready to view
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
    Hardcopy proof ready to view
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Your hardcopy proof is ready to  view in-store. Please contact us if you need us to deliver it to you.
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

  <div style="text-align:center">
    ${paragraph(`
      ${button(
        `Approve proof`,
        encodeMailUrl(
          `print@allbizsupplies.biz`,
          `Proof approved for order ${orderID}`,
          `I have checked the proof for ${orderID} and confirm that it is ready for production.`
        )
      )}
      ${button(
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
