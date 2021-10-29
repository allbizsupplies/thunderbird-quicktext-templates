/**
 * name: Print stock requisition
 */

const [orderID, projectName, dueDate] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  { label: "Due date for stock" },
]);

let itemIndex = 0;
const items = [];
while (true) {
  const itemCode = getInputs([{ label: `Item #${itemIndex + 1} code` }]);
  if (itemCode == "" && itemIndex > 0) {
    break;
  }
  const itemDesc = getInputs([{ label: `Item #${itemIndex + 1} description` }]);
  const itemQuantity = getInputs([
    { label: `Item #${itemIndex + 1} quantity` },
  ]);
  items.push({
    itemCode,
    itemDesc,
    itemQuantity,
  });
  itemIndex++;
}

setSubject(`Print stock requisition`);

const itemsRows = items.reduce((output, item) => {
  return (
    output +
    `
      <tr>
        <td style="
          text-align: left;
          padding: ${metrics.halfSpacer}
        ">${item.itemCode}</td>
        <td style="
          text-align: left;
          padding: ${metrics.halfSpacer}
        ">${item.itemDesc}</td>
        <td style="
          text-align: right;
          padding: ${metrics.halfSpacer}
        ">${item.itemQuantity}</td>
      </tr>
    `
  );
}, "");

return template`
  <heading>
    Print order requisition
  </heading>

  <block>
    <p>
      Order ID: ${orderID}<br />
      Project name: ${projectName}<br />
      Due date for stock: ${dueDate}
    </p>
  </block>

  <table style="
    border-collapse: collapse;
    width: 100%;
  ">
    <thead>
      <tr>
        <th style="
          text-align: left;
          padding: ${metrics.halfSpacer}
        ">Item code</th>
        <th style="
          text-align: left;
          padding: ${metrics.halfSpacer}
        ">Item description</th>
        <th style="
          text-align: right;
          padding: ${metrics.halfSpacer}
        ">Item quantity</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>
`;
