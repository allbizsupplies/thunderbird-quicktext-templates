/**
 * name: Credit request
 */

const [invoiceNumber] = getInputs([{ label: "Invoice number" }]);

const [creditReasonValue] = getInputs([
  {
    label: "Credit reason",
    options: [
      { label: "Returned to stock" },
      { label: "Faulty item(s)" },
      { label: "Duplicate invoice" },
      { label: "other", other: true },
    ],
  },
]);

const creditReason = creditReasonValue.other
  ? getInputs([{ label: "Credit reason (other)" }]).shift()
  : creditReasonValue.label;

let itemIndex = 0;
const items = [];
let enterNextItem = true;
while (enterNextItem) {
  const itemCode = getInputs([{ label: `Item #${itemIndex + 1} code` }]);
  if (itemCode != "") {
    const [itemDesc, itemQuantity] = getInputs([
      { label: `Item #${itemIndex + 1} description` },
      { label: `Item #${itemIndex + 1} quantity to be credited` },
    ]);
    items.push({
      itemCode,
      itemDesc,
      itemQuantity,
    });
    itemIndex++;
  } else {
    enterNextItem = false;
  }
}

setSubject(`Credit request`);
setTo(`accounts@allbizsupplies.biz`);

const itemsRows = () =>
  items.reduce(
    (output, item) =>
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
    `,

    ""
  );

return template`
  <heading>
    Credit request
  </heading>

  <block>
    <p>
      Invoice number: ${invoiceNumber}<br />
      Reason for credit: ${creditReason}<br />
    </p>
  </block>

  ${
    items.length > 0
      ? `
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
              ">Quantity to credit</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows()}
          </tbody>
        </table>
      `
      : `
        <p>Credit all items on invoice.</p>
      `
  }

  <br/>
`;
