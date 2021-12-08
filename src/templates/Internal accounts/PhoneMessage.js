/**
 * name: Phone message
 */

const [name, phoneNumber, repName] = getInputs([
  { label: "From (name)" },
  { label: "Phone number" },
  { label: "Message taken by" },
]);

setSubject(`Phone message`);
setTo(`accounts@allbizsupplies.biz`);

return template`
  <heading>
    Phone message
  </heading>

  <block>
    <p>
      Name: ${name}<br />
      Phone number: ${phoneNumber}
    </p>

    <p>
      Taken by: ${repName}
    </p>
  </block>

  <p>
    <strong>Message:</strong><br />
  </p>

  <p></p>
`;
