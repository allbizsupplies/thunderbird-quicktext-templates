/**
 * name: Update customer delivery address
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

setSubject(`Update customer delivery address`);
setTo(`accounts@allbizsupplies.biz`);

return template`
  <heading>
    Update customer delivery address
  </heading>

  <block>
    <p>
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    </p>
  </block>

  <p>
    <strong>New delivery address:</strong>
  </p>

  <br/>
  <br/>
  <br/>
`;
