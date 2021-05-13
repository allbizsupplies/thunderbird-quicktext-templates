/**
 * name: ETA request
 */

const [purchaseOrderNumber] = getInputs([{ label: "Purchase order number" }]);

setSubject(`ETA for purchase order`);

return template`
  <heading>
    ETA for purchase order
  </heading>

  <p>
    Please provide an ETA for the following items from our purchase order ${purchaseOrderNumber}:
  </p>

  <ul>
    <li></li>
  </ul>

  <p>
    Thank you.
  </p>
`;
