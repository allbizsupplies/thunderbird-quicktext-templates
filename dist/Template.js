
const colors = {
  primary: "#00ce00",
  warning: "#ffd100",
  lightGrey: "#eeedff",
};

const servicePriorityOptions = [
  {
    name: "standard",
    label: "Standard (5-10 days)",
    description: null,
  },
  {
    name: "priority",
    label: "Priority (4-5 days)",
    description: null,
  },
  {
    name: "express",
    label: "Express (2-3 days)",
    description: null,
  },
  {
    name: "same_day",
    label: "Same Day",
    description: "(give us print ready files before 9am and we will dispatch your order in the afternoon)",
  },
];


const getTextInput = (name) => this.mQuicktext.get_input([name, "text"]);

const getSelectInput = (name, options) => {
  const labels = options.map(({ label }) => label);
  const selectedLabel = this.mQuicktext.get_input([
    name,
    "select",
    labels.join(";"),
  ]);
  return options.find(({ label }) => label == selectedLabel);
};

const getInputs = (fieldDefinitions) => {
  return fieldDefinitions.map(fieldDefinition => {
    const { name } = fieldDefinition;
    return fieldDefinition.options
      ? getSelectInput(name, fieldDefinition.options)
      : getTextInput(name);
  });
};

const encodeMailUrl = function (mailTo, subject, body) {
  return `mailto:${mailTo}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};


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


const templates = {}

templates.account_notifications__AboutAllbiz = () => {
/**
 * name: About Allbiz Supplies
 * subject: About Allbiz Supplies
 */

return container(`
  ${heading(`
    About Allbiz Supplies
  `)}

  ${paragraph(`
    Allbiz is a family-owned Adelaide business based in Lonsdale.
    We've been supplying businesses and organisations with office 
    supplies, a wide range of education and craft supplies, and 
    printing services for over 35 years.
  `)}

  ${paragraph(`
    As a member of Office Choice, we're able to offer competitive 
    prices on a wide range of office supplies. We do daily deliveries 
    to Adelaide and its surrounds, and we can also deliver orders 
    Australia-wide.
  `)}

  ${paragraph(`
    Below is a link to our website and our contact information. 
    Please don’t hesitate to ring or email if we can be of help 
    with your Education, Cleaning or Art and Craft Supplies, General
    Stationery and Printing.
  `)}

  ${block(`
    ${paragraph(`
      General home page: ${link(
        `https://allbizsupplies.biz/`,
        `allbizsupplies.biz`
      )}
    `)}
  `)}

  ${block(`
    ${paragraph(`
      Buy office supplies: ${link(
        `https://allbiz.officechoice.com.au`,
        `allbiz.officechoice.com.au`
      )}
    `)}

    ${paragraph(`
      Includes office supplies, cleaning, art and craft and educational materials.
    `)}
  `)}

  ${block(`
    ${paragraph(`
      Order printing online: ${link(
        `https://shop.allbizsupplies.biz/`,
        `shop.allbizsupplies.biz`
      )}
    `)}
  `)}
`);

};

templates.account_notifications__AccountApplication = () => {
/**
 * name: Credit account application
 * subject: Credit account application
 */

return container(`
  ${heading(`
    Credit account application
  `)}

  ${paragraph(`
    Please find an account application attached.
  `)}

  ${paragraph(`
    You can return the completed form by email or post.
  `)}

  ${block(`
    ${paragraph(`
      <strong>Email:</strong><br />
      ${link(`stat@allbizsupplies.biz`)}
    `)}

    ${paragraph(`
      <strong>Post:</strong><br />
      125 O'Sullivan Beach Road<br />
      Lonsdale SA 5160
    `)}
  `)}
`);

};

templates.account_notifications__CreditAccountOpened = () => {
/**
 * name: Credit account opened
 * subject: Credit account opened
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);

return container(`
  ${heading(`
    Credit account opened
  `)}

  ${paragraph(`
    Your credit account is now open and ready to use.
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${subheading(`
    Use this account on our online store
  `)}

  ${paragraph(`
    To use this account on our online store, ${link(`allbiz.officechoice.com.au`)},
    just reply to this email and let us know the email address and contact name you
    would like to use for your login.
  `)}
`);

};

templates.account_notifications__InvoiceArrached = () => {
/**
 * name: Invoice
 * subject: Invoice
 */

return container(`
  ${heading(`
    Invoice
  `)}

  ${paragraph(`
    Please find your invoice attached.
  `)}
`);

};

templates.internal_accounts__AccountApplication = () => {
/**
 * name: Account application
 * subject: Account application
 */

return container(`
  ${paragraph(`
    Customer's account application is attached.
  `)}
`);

};

templates.internal_accounts__AccountCashPayment = () => {
/**
 * name: Account cash payment
 * subject: Account payment taken in cash
 */

const [accountNumber, accountName, paymentAmount, repName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
  { name: "Payment amount" },
  { name: "Taken by" },
]);

return container(`
  ${paragraph(`
    Customer's account application is attached.
  `)}

  ${block(`  
    ${paragraph(`
      <strong>Payment details:</strong><br />
      Account number: ${accountNumber}<br />
      Account name: ${accountName}<br />
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    `)}
  `)}
`);

};

templates.internal_accounts__PhoneMessage = () => {
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

};

templates.internal_accounts__UpdateCustomerContactDetails = () => {
/**
 * name: Update customer contact details
 * subject: Update customer contact details
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);

return container(`
  ${heading(`
    Update customer contact details
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${paragraph(`
    <strong>New contact details:</strong><br />
    <strong>Name:</strong>&nbsp;<br />
    <strong>Phone:</strong>&nbsp;<br />
    <strong>Email:</strong>&nbsp;
  `)}
`);

};

templates.internal_accounts__UpdateCustomerDeliveryAddress = () => {
/**
 * name: Update customer delivery address
 * subject: Update customer delivery address
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);

return container(`
  ${heading(`
    Update customer delivery address
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${paragraph(`
    <strong>New delivery address:</strong>
  `)}

  ${paragraph(``)}
`);

};

templates.internal_accounts__UpdateCustomerDeliveryInstructions = () => {
/**
 * name: Update customer delivery instructions
 * subject: Update customer delivery instructions
 */

const [accountNumber, accountName] = getInputs([
  { name: "Account number" },
  { name: "Account name" },
]);
const [deliveryInstructionsValue] = getInputs([
  {
    name: "Delivery instructions",
    options: [
      { label: "Deliver (Allbiz Driver)" },
      { label: "Deliver (Courier)" },
      { label: "SMS when ready to collect" },
      { label: "Call when ready to collect" },
      { label: "other" },
    ],
  },
]);
const deliveryInstructions =
  deliveryInstructionsValue.label == "other"
    ? (deliveryInstructions = getInputs([{ name: "Delivery instructions" }]))
    : deliveryInstructionsValue.label;

return container(`
  ${heading(`
    Update customer delivery instructions
  `)}

  ${block(`
    ${paragraph(`
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    `)}
  `)}

  ${paragraph(`
    <strong>New delivery instructions:</strong><br />
    ${deliveryInstructions}
  `)}
`);

};

templates.print_order_notifications__AwaitingInformation = () => {
/**
 * name: Awaiting information
 * subject: We need more info so we can start your order
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
    We need more info before we can make your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Please give us the following information so we can start making your order:
  `)}

  ${list([``])}
`);

};

templates.print_order_notifications__AwaitingPrintReadyFiles = () => {
/**
 * name: Awaiting print ready files
 * subject: Please send print-ready PDF files so we can start your order
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
    We need print ready PDF files before we can make your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Please send us the following print ready PDF files so we can start making your order.
  `)}

  ${list([``])}
`);

};

templates.print_order_notifications__DepositRequired = () => {
/**
 * name: Deposit required
 * subject: Deposit required for your order
 */

const [orderID, projectName, depositPaymentAmount, servicePriority] = getInputs(
  [
    { name: "Order ID" },
    { name: "Project name" },
    { name: "Deposit amount" },
    {
      name: "Service priority",
      options: servicePriorityOptions,
    },
  ]
);

return container(`
  ${heading(`
    We need a deposit payment for your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Please pay us the following deposit amount so we can start your order.
  `)}

  ${block(
    `
    ${paragraph(`
      Deposit payment required: $${depositPaymentAmount}
    `)}
  `,
    colors.lightGrey
  )}

  ${paymentOptions}
`);

};

templates.print_order_notifications__HardcopyProofReady = () => {
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

};

templates.print_order_notifications__InProduction = () => {
/**
 * name: In production
 * subject: We are making your order
 */

const [orderID, projectName, servicePriority, estimatedCompletionDate] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
  {
    name: "Service priority",
    options: servicePriorityOptions,
  },
  { name: "Estimated completion date" },
]);

return container(`
  ${heading(`
    We have started making your order
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, estimatedCompletionDate)}
`);

};

templates.print_order_notifications__OrderDispatched = () => {
/**
 * name: Order dispatched
 * subject: We have dispatched your order
 */

const [orderID, projectName] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
]);

return container(`
  ${heading(`
    Order dispatched
  `)}

  ${printOrderDetails(orderID, projectName)}

  ${paragraph(`
    Your order has been dispatched.
  `)}
`);

};

templates.print_order_notifications__OrderReadyToCollect = () => {
/**
 * name: Order ready to collect
 * subject: Your order is ready to collect
 */

const [orderID, projectName] = getInputs([
  { name: "Order ID" },
  { name: "Project name" },
]);

return container(`
  ${heading(`
    Order ready to collect
  `)}

  ${printOrderDetails(orderID, projectName)}

  ${paragraph(`
    Your order is ready to collect. Please contact us if you need us to deliver it to you.
  `)}
`);

};

templates.print_order_notifications__PartOrderDispatched = () => {
/**
 * name: Part order dispatched
 * subject: Part of your order has been dispatched
 */

return container(`
  ${heading(`
    We've dispatched part of your order
  `)}

  ${paragraph(`
    We've dispatched part of your order to make sure you get
    your items as soon as possible.
  `)}

  ${paragraph(`
    We will dispatch the remainder of your order once the items
    are ready to ship.
  `)}
`);

};

templates.print_order_notifications__ProofApprovalRequired = () => {
/**
 * name: Proof approval required
 * subject: Proof approval required
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
    Proof approval required
  `)}

  ${printOrderDetails(orderID, projectName, servicePriority, "N/A")}

  ${paragraph(`
    Your proof is attached. Please check it carefully and seed us your approval if everything is correct.
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

  ${paragraph(`
    <strong>Warning about colour printing:</strong>
    if your job will be printed in colour, and you need to check the exact colours that will be
    printed, then you should contact us to arrange a <em>production proof</em>. (Your screen
    and printer cannot accurately reproduce the colours on the final product.)`)}

  <div style="text-align:center">
    ${paragraph(`
      ${buttonLink(
        `Approve proof`,
        encodeMailUrl(
          `print@allbizsupplies.biz`,
          `Proof approved for order ${orderID}`,
          `I have checked the proof for ${orderID} and confirm that it is ready for production.`
        )
      )}
      ${buttonLink(
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

};

templates.stat_order_notifications__OrderReadyToCollect = () => {
/**
 * name: Order ready to collect
 * subject: Your order is ready to collect
 */

return container(`
  ${heading(`
    Order ready to collect
  `)}

  ${paragraph(`
    Items ready for collection:
  `)}

  ${list([""])}

  ${paragraph(`
    Please contact us if you need us to deliver it to you.
  `)}
`);

};

templates.stat_order_notifications__PartOrderDispatched = () => {
/**
 * name: Remaining order items dispatched
 * subject: Part of your order has been dispatched
 */

const [orderNumber, shipmentType] = getInputs([
  { name: "Order number" },
  {
    name: "Part order type",
    options: [
      { isRemainder: false, label: "This is the first part of the order" },
      { isRemainder: true, label: "This is the final part of the order" },
    ],
  },
]);

const { isRemainder } = shipmentType;

return isRemainder
  ? container(`
    ${heading(`
      We've dispatched the remainder of your order
    `)}

    ${block(`
      ${paragraph(`
        Order number: ${orderNumber}
      `)}
    `)}

    ${paragraph(`
      We've dispatched the remaining items in your order.
    `)}
  `)
  : container(`
    ${heading(`
      We've dispatched part of your order
    `)}

    ${block(`
      ${paragraph(`
        Order number: ${orderNumber}
      `)}
    `)}

    ${paragraph(`
      We've dispatched part of your order to make sure you get
      your items as soon as possible.
    `)}

    ${paragraph(`
      We will dispatch the remainder of your order once the items
      are ready to ship.
    `)}
  `);

};

templates.stat_order_notifications__QuotationAttached = () => {
/**
 * name: Quotation
 * subject: Quotation
 */

return container(`
  ${heading(`
    Quotation
  `)}

  ${paragraph(`
    Please find your quotation attached.
  `)}
`);

};

templates.stat_order_notifications__UpdatePurchaseOrder = () => {
/**
 * name: Update purchase order
 * subject: Update purchase order
 */

const [purchaseOrderNumber, attachmentType] = getInputs([
  { name: "Purchase order number" },
  {
    name: "Attachment Type",
    options: [
      { label: "Invoice" },
      { label: "Quote" },
    ],
  },
]);

return container(`
  ${heading(`
    Purchase order amendment required
  `)}

  ${block(`
    ${paragraph(`
      Your purchase order: ${purchaseOrderNumber}
    `)}
  `)}

  ${paragraph(`
    Please update your purchase order to match the attached ${attachmentType.label}.
  `)}
`);

};

templates.stat_order_notifications__WebOrderPaymentRequired = () => {
/**
 * name: Web order payment required
 * subject: Payment required for web order
 */

const [orderNumber, paymentAmount] = getInputs(
  [
    { name: "Web order number" },
    { name: "Payment amount required" },
  ]
);

return container(`
  ${heading(`
    Web order payment required
  `)}

  ${eChoicePaymentDetails(orderNumber, paymentAmount)}

  ${paragraph(`
    Your web order is ready for dispatch, however for security reasons
    we need to cancel the credit card payment that you made online, 
    and have not charged your credit card.
  `)}

  ${block(`
    ${paragraph(`Order number: ${orderID}`)}
    ${paragraph(`Payment required: ${paymentAmount}`)}
  `, colors.lightGrey)}

  ${paymentOptions}
`);

};

templates.supplier_requests__ETARequest = () => {
/**
 * name: Quote request
 * subject: Price and availability
 */

return container(`
  ${heading(`
    Quote request
  `)}

  ${paragraph(`
    Please provide a price and availability for the following items:
  `)}

  ${list([""])}

  ${paragraph(`
    Thank you.
  `)}
`);

};

templates.supplier_requests__QuoteRequest = () => {
/**
 * name: ETA request
 * subject: ETA for purchase order
 */

const [purchaseOrderNumber] = getInputs([
  { name: "Purchase order number" },
])

return container(`
  ${heading(`
    ETA for purchase order
  `)}

  ${paragraph(`
    Please provide an ETA for the following items from our purchase order ${purchaseOrderNumber}:
  `)}

  ${list([""])}

  ${paragraph(`
    Thank you.
  `)}
`);

};


const [templateName] = this.mVariables;

return templates[templateName]();