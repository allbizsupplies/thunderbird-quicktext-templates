const container = (content) => `
  <div style="width:100%;max-width:750px;">
    ${content}
  </div>
`;

const heading = (content) => `
  <p style="font-size:1.5rem;text-align:center;margin:0;padding:0.5rem 0;">
    <strong>${content}</strong>
  </p>
`;

const subheading = (content) => `
  <p style="font-size:1.25rem;text-align:center;margin:0;padding:0.5rem 0;">
    <strong>${content}</strong>
  </p>
`;

const paragraph = (content) => `
  <p style="margin:0;padding:0.5rem 0;">
    ${content}
  </p>
`;

const list = (listItems, isOrdered) => `
  <${isOrdered ? `ol` : `ul`} style="margin:0;padding:0.25rem 0 0.25rem 1rem;">
    ${listItems
      .map(
        (content) => `
      <li style="margin:0;padding:0.1rem 0;">
        ${content}
      </li>
    `
      )
      .join("")}
  </${isOrdered ? `ol` : `ul`}>
`;

const block = (content, backgroundColor) => `
  <div style="padding:0.5rem 0;">
    <div style="padding:0.5rem 1rem;background-color:${backgroundColor ? backgroundColor : colors.lightGrey}">
      ${content}
    </div>
  </div>
`;

const link = (url, label) => `
  <a href="${url}">
    ${label ? label : url}
  </a>
`;

const buttonLink = (content, url, backgroundColor) => `
  <a href="${url}" style="display:inline-block;text-align:center;padding:0.5rem 1rem;border-radius:6em;background-color:black;color:white;text-decoration:none;">
    ${content}
  </a>
`;

const printOrderDetails = (
  orderID,
  projectname,
  servicePriority,
  estimatedCompletionDate
) => {
  if (servicePriority) {
    return block(
      `
      ${paragraph(`Order ID: ${orderID}`)}
      ${paragraph(`Project name: ${projectname}`)}
      ${paragraph(`
        Your order's turnaround time:
        <strong>${servicePriority.label}</strong>${
        servicePriority.description
          ? `&nbsp;<span style="">${servicePriority.description}</span>`
          : ""
      }
      `)}
      ${paragraph(`
        Estimated completion date:
        <strong>${estimatedCompletionDate}</strong>
      `)}
      ${
        estimatedCompletionDate == "N/A"
          ? paragraph(
              `<span style="font-size:0.8rem">We will give you an estimated completion date when your order is ready for production.</span>`
            )
          : ""
      }
    `,
      colors.lightGrey
    );
  } else {
    return block(
      `
      ${paragraph(`Order ID: ${orderID}`)}
      ${paragraph(`Project name: ${projectname}`)}
    `,
      colors.lightGrey
    );
  }
};

const paymentOptions = () => `
  ${subheading(`Payment Options`)}

  ${block(`
    ${paragraph(`
      <strong>Pay by credit/debit card over the phone</strong>
    `)}

    ${paragraph(`
      Call us on (08) 8326 2899, quote order ID ${orderID}, and we will take payment for your order.
    `)}
  `,
    colors.lightGrey
  )}

  ${block(`
    ${paragraph(`
      <strong>Pay by EFT</strong>
    `)}

    ${paragraph(`
      You can make a direct deposit into our bank account:
    `)}

    ${paragraph(`
      BSB: 015-259<br/>
      ACC: 107844828<br/>
      Account Name: Allbiz Supplies Pty. Ltd.
    `)}

    ${paragraph(`
      Please email us a remittance advice so we can proceed with your order.
    `)}
  `)}
`;
