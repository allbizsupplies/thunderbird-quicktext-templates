/**
 * name: Fix artwork
 * subject: Your artwork needs to be fixed
 */

const [orderID, projectName, artworkVersion] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Artwork version",
    options: [
      { value: 1, label: "First version", },
      { value: 2, label: "Second version", },
      { value: 3, label: "Third version or greater", },
    ],
  },
]);

const artworkVersionNumber = artworkVersion.value >= 3
  ? getInputs([
    { label: "Artwork version" }
  ])
  : artworkVersion.value;

const proofCharge = `16.50`;
const setupHourlyCharge = `90.00`;

const accruedProofCharges = artworkVersion.value >= 3
  ? getInputs([
    { label: "Accrued artwork charges for rejected proofs" }
  ])
  : 0;

return template`
  <heading>
    Your artwork needs to be fixed
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
  />

  ${artworkVersion.value === 1
    ? `
      <block style="background-color:${colors.warning}">
        <p>Artwork version: ${artworkVersionNumber}</p>
        <p>Warning: we will need to charge a fee of $${proofCharge} once you submit three versions.</p>
      </block>`
    : artworkVersion.value === 2
    ? `
      <block style="background-color:${colors.warning}">
        <p>Artwork version: ${artworkVersionNumber}</p>
        <p>Warning: we will need to charge a fee of $${proofCharge} if the new artwork is not correct.</p>
      </block>`
    : `
      <block style="background-color:${colors.warning}">
        <p>Artwork version: ${artworkVersionNumber}</p>
        <p>Accrued artwork setup charge: $${accruedProofCharges}</p>
        <p>Warning: this setup charge will increase if the new artwork is not correct.</p>
      </block>
    `
  }
  
  <p>
    Please fix the following problems with your artwork:
  </p>

  <ul>
    <li>Please send your artwork as a PDF file (PDF/X-1a is best)</li>
    <li>Embed all fonts in your PDF, or convert all type to paths/curves/outlines</li>
    <li>Increase your image resolution to 300ppi</li>
    <li>Increase your image resolution to 600ppi</li>
    <li>Convert all colours to CMYK (do not use RGB or spot colours)</li>
    <li>Convert all colours to RGB (do not use CMYK or spot colours)</li>
    <li>Convert all colours to spot colours (do not use CMYK or RGB colours)</li>
    <li>Flatten transparent layers</li>
    <li>Add 3mm bleed</li>
    <li>Add 3mm safe area between text and the edge of the artwork</li>
    <li>Define a trim box for the final cut size of your artwork</li>
  </ul>

  <p>
    If you're unsure how to make these changes, please contact us
    so we can set up the artwork for you. We charge $${setupHourlyCharge}
    per hour for artwork design and setup.
  </p>
`;
