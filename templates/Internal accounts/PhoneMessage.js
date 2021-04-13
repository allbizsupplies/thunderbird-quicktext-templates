/**
 * name: Phone message
 * subject: Phone message
 */

const [name, phoneNumber, repName] = getInputs([
  { name: "From (name)" },
  { name: "Phone number" },
  { name: "Message taken by" },
]);

return container(`
  ${heading(`
    Phone message
  `)}

  ${block(`
    ${paragraph(`
      Name: ${name}<br />
      Phone number: ${phoneNumber}
    `)}

    ${paragraph(`
      Taken by: ${repName}
    `)}
  `)}

  ${paragraph(`
    <strong>Message:</strong><br />
  `)}

  ${paragraph(``)}
`);
