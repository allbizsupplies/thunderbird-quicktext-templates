/**
 * name: Couriers Please: redeliver consignment
 */

const [consignmentID] = getInputs([{ label: "Consignment number" }]);

setSubject(`Redeliver consignment`);
setTo(`contact@couriersplease.com.au`);

return template`
  <heading>
    Redeliver consignment
  </heading>

  <block>
    <p>Consignment ID: <strong>${consignmentID}</strong></p>
  </block>

  <p>
    <strong>New delivery instructions:</strong>
    <br />
    <br />
    <br />
  </p>
  <br/>
`;
