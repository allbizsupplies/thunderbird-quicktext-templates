const colors = {
  success: "#00ce00",
  warning: "#ffd100",
  lightBlueGrey: "#eeedff",
};

const metrics = {
  spacer: "0.5em",
  halfSpacer: "0.25em",
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
    description:
      "(give us print ready files before 9am and we will dispatch your order in the afternoon)",
  },
];

const getTextInput = (label) => this.mQuicktext.get_input([label, "text"]);

const getSelectInput = (label, options) => {
  const optionLabels = options.map(({ label }) => label);
  const selectedOptionLabel = this.mQuicktext.get_input([
    label,
    "select",
    optionLabels.join(";"),
  ]);
  return options.find(({ label }) => label == selectedOptionLabel);
};

const getInputs = (fieldDefinitions) => {
  return fieldDefinitions.map((fieldDefinition) => {
    const { label } = fieldDefinition;
    return fieldDefinition.options
      ? getSelectInput(label, fieldDefinition.options)
      : getTextInput(label);
  });
};

const encodeObject = (value) =>
  this.mWindow
    ? "json:" + this.mWindow.btoa(JSON.stringify(value))
    : "json:" + btoa(JSON.stringify(value));

const decodeObject = (value) =>
  this.mWindow
    ? JSON.parse(this.mWindow.atob(value.split(":")[1]))
    : JSON.parse(atob(value.split(":")[1]));

const encodeMailUrl = function (mailTo, subject, body) {
  return `mailto:${mailTo}?subject=${encodeURIComponent(
    subject
  )}&amp;amp;body=${encodeURIComponent(body)}`;
};

const template = function (strings, ...values) {
  return strings.reduce((output, string, index) => {
    const value = values[index];
    if (index < values.length) {
      if (value instanceof Object || value instanceof Array) {
        const encodedValue = encodeObject(value);
        return `${output}${string}${encodedValue}`;
      }
      return `${output}${string}${value}`;
    }
    return `${output}${string}`;
  }, "");
};

const renderNode = function (node) {
  const ELEMENT_NODE = this.mWindow
    ? this.mWindow.Node.ELEMENT_NODE
    : Node.ELEMENT_NODE;
  if (node.nodeType === ELEMENT_NODE) {
    const content = Array.from(node.childNodes)
      .map((node) => renderNode(node))
      .join("");
    const component = Components[node.tagName];
    if (component !== undefined) {
      const attributes = parseNodeAttributes(node);
      return component(content, attributes);
    }
    node.innerHTML = content;
    return node.outerHTML;
  }

  return node.nodeValue;
};

const parseNodeAttributes = function (node) {
  const attributes = {};
  for (let i = 0; i < node.attributes.length; i++) {
    const { name, value } = node.attributes[i];
    if (value.match(/^json:/)) {
      attributes[name] = decodeObject(value);
    } else {
      attributes[name] = value;
    }
  }
  return attributes;
};

const processTemplate = function (templateOutput) {
  const parser = this.mWindow ? new this.mWindow.DOMParser() : new DOMParser();
  const doc = parser.parseFromString(templateOutput, "text/xml");
  const output = renderNode(doc.documentElement);
  return output;
};

const renderTemplate = () => {
  const [templateName] = this.mVariables;
  const templateOutput = templates[templateName]();
  const wrappedOutput = Components.wrapper(templateOutput);
  return processTemplate(wrappedOutput);
};

const Components = {
  wrapper: (content) => `
    <div style="width:100%;max-width:750px;">
      ${content}
    </div>
  `,

  p: (content) => `
    <p style="margin:0;padding:${metrics.spacer} 0;">
      ${content}
    </p>
  `,

  ul: (content) => `
    <ul style="margin:0;padding:${metrics.halfSpacer} 0 ${metrics.halfSpacer} 1em;">
      ${content}
    </ul>
  `,

  ol: (content) => `
    <ol style="margin:0;padding:${metrics.halfSpacer} 0 ${metrics.halfSpacer} 1em;">
      ${content}
    </ol>
  `,

  li: (content) => `
    <li style="margin:0;padding:0.1em 0;">
      ${content}
    </li>
  `,

  heading: (content) => `
    <p style="font-size:1.5em;text-align:center;margin:0;padding:${metrics.spacer} 0;">
      <strong>${content}</strong>
    </p>
  `,

  subheading: (content) => `
    <p style="font-size:1.25em;text-align:center;margin:0;padding:${metrics.spacer} 0;">
      <strong>${content}</strong>
    </p>
  `,

  block: (content) => `
    <div style="padding:${metrics.spacer} 0;">
      <div style="padding:${metrics.spacer} 1em;background-color:${colors.lightBlueGrey}">
        ${content}
      </div>
    </div>
  `,

  "button-link": (content, attributes) => `
    <a href="${attributes.href}" style="display:inline-block;text-align:center;padding:${metrics.spacer} 1em;border-radius:6em;background-color:black;color:white;text-decoration:none;">
      ${content}
    </a>
  `,

  "print-order-details": (content, attributes) => {
    if (attributes["service-priority"]) {
      return `
        ${Components.block(`
          ${Components.p(`Order ID: ${attributes["order-id"]}`)}
          ${Components.p(`Project name: ${attributes["project-name"]}`)}
          ${Components.p(`
            Your order's turnaround time:
            <strong>${attributes["service-priority"].label}</strong>
            ${
              attributes["service-priority"]
                ? `<span style="">${attributes["service-priority"].description}</span>`
                : ""
            }
          `)}
          ${Components.p(`
            Estimated completion date:
            <strong>${
              attributes["estimated-completion-date"]
                ? attributes["estimated-completion-date"]
                : "N/A"
            }</strong>
          `)}
          ${
            attributes["estimated-completion-date"] === undefined
              ? `
                ${Components.p(`
                  <span style="font-size:0.8em">We will give you an estimated completion date when your order is ready for production.</span>
                `)}
              `
              : ""
          }
        `)}
      `;
    } else {
      return `
        ${Components.block(`
          ${Components.p(`Order ID: ${attributes["order-id"]}`)}
          ${Components.p(`Project name: ${attributes["project-name"]}`)}
        `)}
      `;
    }
  },

  "payment-options": (content, attributes) => `
    ${Components.subheading(`Payment Options`)}

    ${Components.block(`
      ${Components.p(`
        <strong>Pay by credit/debit card over the phone</strong>
      `)}

      ${Components.p(`
        Call us on (08) 8326 2899, quote order ID ${attributes["order-id"]}, and we will take payment for your order.
      `)}
    `)}

    ${Components.block(`
      ${Components.p(`
        <strong>Pay by EFT</strong>
      `)}

      ${Components.p(`
        You can make a direct deposit into our bank account:
      `)}

      ${Components.p(`
        BSB: 015-259<br/>
        ACC: 107844828<br/>
        Account Name: Allbiz Supplies Pty. Ltd.
      `)}

      ${Components.p(`
        Please email us a remittance advice so we can proceed with your order.
      `)}
    `)}
  `,
};

if (this.mQuicktext === undefined) {
  module.exports = {
    servicePriorityOptions,
    template,
    processTemplate,
    renderTemplate,
    Components,
    encodeObject,
    decodeObject,
    encodeMailUrl,
  };
}
const templates = {}

templates.account_notifications__AboutAllbiz = () => {
/**
 * name: About Allbiz Supplies
 * subject: About Allbiz Supplies
 */

return template`
  <heading>About Allbiz Supplies</heading>

  <p>
    Allbiz is a family-owned Adelaide business based in Lonsdale.
    We've been supplying businesses and organisations with office 
    supplies, a wide range of education and craft supplies, and 
    printing services for over 35 years.
  </p>

  <p>
    As a member of Office Choice, we're able to offer competitive 
    prices on a wide range of office supplies. We do daily deliveries 
    to Adelaide and its surrounds, and we can also deliver orders 
    Australia-wide.
  </p>

  <p>
    Below is a link to our website and our contact information. 
    Please don’t hesitate to ring or email if we can be of help 
    with your Education, Cleaning or Art and Craft Supplies, General
    Stationery and Printing.
  </p>

  <block>
    <p>
      General home page: <a href="https://allbizsupplies.biz/">allbizsupplies.biz</a>
    </p>
  </block>

  <block>
    <p>
      Buy office supplies: <a href="https://allbiz.officechoice.com.au/">allbiz.officechoice.com.au</a>
    </p>

    <p>
      Includes office supplies, cleaning, art and craft and educational materials.
    </p>
  </block>

  <block>
    <p>
      Order printing online: <a href="https://shop.allbizsupplies.biz/">shop.allbizsupplies.biz</a>
    </p>
  </block>
`;

};

templates.account_notifications__AccountApplication = () => {
/**
 * name: Credit account application
 * subject: Credit account application
 */

return template`
  <heading>
    Credit account application
  </heading>

  <p>
    Please find an account application attached.
  </p>

  <p>
    You can return the completed form by email or post.
  </p>

  <block>
    <p>
      <strong>Email:</strong><br />
      stat@allbizsupplies.biz
    </p>

    <p>
      <strong>Post:</strong><br />
      125 O'Sullivan Beach Road<br />
      Lonsdale SA 5160
    </p>
  </block>
`;

};

templates.account_notifications__CreditAccountOpened = () => {
/**
 * name: Credit account opened
 * subject: Credit account opened
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

return template`
  <heading>
    Credit account opened
  </heading>

  <p>
    Your credit account is now open and ready to use.
  </p>

  <block>
    <p>
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    </p>
  </block>

  <subheading>
    Use this account on our online store
  </subheading>

  <p>
    To use this account on our online store, <a href="https://allbiz.officechoice.com.au">allbiz.officechoice.com.au</a>,
    just reply to this email and let us know the email address and contact name you
    would like to use for your login.
  </p>
`;

};

templates.account_notifications__InvoiceArrached = () => {
/**
 * name: Invoice
 * subject: Invoice
 */

return template`
  <heading>
    Invoice
  </heading>

  <p>
    Please find your invoice attached.
  </p>
`;

};

templates.internal_accounts__AccountApplication = () => {
/**
 * name: Account application
 * subject: Account application
 */

return template`
  <p>
    Customer's account application is attached.
  </p>
`;

};

templates.internal_accounts__AccountCashPayment = () => {
/**
 * name: Account cash payment
 * subject: Account payment taken in cash
 */

const [accountNumber, accountName, paymentAmount, repName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
  { label: "Payment amount" },
  { label: "Taken by" },
]);

return template`
  <p>
    We have taken an account payment in cash.
  </p>

  <block>  
    <p>
      <strong>Payment details:</strong><br />
      Account number: ${accountNumber}<br />
      Account name: ${accountName}<br />
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    </p>
  </block>
`;

};

templates.internal_accounts__PhoneMessage = () => {
/**
 * name: Phone message
 * subject: Phone message
 */

const [name, phoneNumber, repName] = getInputs([
  { label: "From (name)" },
  { label: "Phone number" },
  { label: "Message taken by" },
]);

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

};

templates.internal_accounts__UpdateCustomerContactDetails = () => {
/**
 * name: Update customer contact details
 * subject: Update customer contact details
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

return template`
  <heading>
    Update customer contact details
  </heading>

  <block>
    <p>
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    </p>
  </block>

  <p>
    <strong>New contact details:</strong><br />
    Name:<br />
    Phone:<br />
    Email:
  </p>
`;

};

templates.internal_accounts__UpdateCustomerDeliveryAddress = () => {
/**
 * name: Update customer delivery address
 * subject: Update customer delivery address
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

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

  <p></p>
`;

};

templates.internal_accounts__UpdateCustomerDeliveryInstructions = () => {
/**
 * name: Update customer delivery instructions
 * subject: Update customer delivery instructions
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);
const [deliveryInstructionsValue] = getInputs([
  {
    label: "Delivery instructions",
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
    ? (deliveryInstructions = getInputs([{ label: "Delivery instructions" }]))
    : deliveryInstructionsValue.label;

return template`
  <heading>
    Update customer delivery instructions
  </heading>

  <block>
    <p>
      Account number: ${accountNumber}<br />
      Account name: ${accountName}
    </p>
  </block>

  <p>
    <strong>New delivery instructions:</strong><br />
    ${deliveryInstructions}
  </p>
`;

};

templates.print_order_notifications__AwaitingInformation = () => {
/**
 * name: Awaiting information
 * subject: We need more info so we can start your order
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

return template`
  <heading>
    We need more info before we can make your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Please give us the following information so we can start making your order:
  </p>

  <ul>
    <li></li>
  </ul>
`;

};

templates.print_order_notifications__AwaitingPrintReadyFiles = () => {
/**
 * name: Awaiting print ready files
 * subject: Please send print-ready PDF files so we can start your order
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

return template`
  <heading>
    We need print ready PDF files before we can make your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Please send us the following print ready PDF files so we can start making your order.
  </p>

  <ul>
    <li></li>
  </ul>
`;

};

templates.print_order_notifications__DepositRequired = () => {
/**
 * name: Deposit required
 * subject: Deposit required for your order
 */

const [orderID, projectName, depositPaymentAmount, servicePriority] = getInputs(
  [
    { label: "Order ID" },
    { label: "Project name" },
    { label: "Deposit amount" },
    {
      label: "Service priority",
      options: servicePriorityOptions,
    },
  ]
);

return template`
  <heading>
    We need a deposit payment for your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Please pay us the following deposit amount so we can start your order.
  </p>

  <block>
    <p>
      Deposit payment required: $${depositPaymentAmount}
    </p>
  </block>

  <payment-options order-id="${orderID}" />
`;

};

templates.print_order_notifications__HardcopyProofReady = () => {
/**
 * name: Hardcopy proof ready
 * subject: Hardcopy proof is ready to view
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

return template`
  <heading>
    Hardcopy proof ready to view
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Your hardcopy proof is ready to view in-store. Please contact us if
    you need us to deliver it to you.
  </p>

  <p>
    We won't start making your job until you approve your proof.
  </p>

  <p>
    <strong>Check everything!</strong> You are responsible for ensuring
    that your job doesn't have any mistakes of any kind.
  </p>

  <ul>
    <li>Check all spelling, numbers, and names.</li>
    <li>Make sure nothing is missing.</li>
    <li>Make sure everything is in the right place.</li>
    <li>Go back and check it again.</li>
  </ul>

  <div style="text-align:center">
    <p>
      <button-link href="${encodeMailUrl(
        `print@allbizsupplies.biz`,
        `Proof approved for order ${orderID}`,
        `I have checked the proof for order ${orderID} and confirm that it is ready for production.`
      )}">
        Approve proof
      </button-link>
      <button-link href="${encodeMailUrl(
        `print@allbizsupplies.biz`,
        `Artwork changes required for order ${orderID}`,
        `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
      )}">
        Request changes
      </button-link>
    </p>
  </div>
`;

};

templates.print_order_notifications__InProduction = () => {
/**
 * name: In production
 * subject: We are making your order
 */

const [orderID, projectName, servicePriority, estimatedCompletionDate] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
  { label: "Estimated completion date" },
]);

return template`
  <heading>
    We have started making your order
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
    estimated=completion-date="${estimatedCompletionDate}"
  />
`;

};

templates.print_order_notifications__OrderDispatched = () => {
/**
 * name: Order dispatched
 * subject: We have dispatched your order
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
]);

return template`
  <heading>
    Order dispatched
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
  />

  <p>
    Your order has been dispatched.
  </p>
`;

};

templates.print_order_notifications__OrderReadyToCollect = () => {
/**
 * name: Order ready to collect
 * subject: Your order is ready to collect
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
]);

return template`
  <heading>
    Order ready to collect
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
  />
  
  <p>
    Your order is ready to collect. Please contact us if you need us to deliver it to you.
  </p>
`;

};

templates.print_order_notifications__PartOrderDispatched = () => {
/**
 * name: Part order dispatched
 * subject: Part of your order has been dispatched
 */

 const [orderNumber, shipmentType] = getInputs([
  { label: "Order number" },
  {
    label: "Part order type",
    options: [
      { isRemainder: false, label: "This is the first part of the order" },
      { isRemainder: true, label: "This is the final part of the order" },
    ],
  },
]);

const { isRemainder } = shipmentType;

return isRemainder
  ? template`
    <heading>
      We've dispatched the remainder of your order
    </heading>

    <block>
      <p>
        Order number: ${orderNumber}
      </p>
    </block>

    <p>
      We've dispatched the remaining items in your order.
    </p>
  `
  : template`
    <heading>
      We've dispatched part of your order
    </heading>

    <block>
      <p>
        Order number: ${orderNumber}
      </p>
    </block>

    <p>
      We've dispatched part of your order to make sure you get
      your items as soon as possible.
    </p>

    <p>
      We will dispatch the remainder of your order once the items
      are ready to ship.
    </p>
  `;

};

templates.print_order_notifications__ProofApprovalRequired = () => {
/**
 * name: Proof approval required
 * subject: Proof approval required
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

return template`
  <heading>
    Proof approval required
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <p>
    Your proof is attached. Please check it carefully and sebd us your approval if everything is correct.
  </p>

  <p>
    We won't start making your job until you approve your proof.
  </p>

  <p><strong>Check everything!</strong> You are responsible for ensuring that your job doesn't have any mistakes of
  any kind.</p>

  <ul>
    <li>Check all spelling, numbers, and names.</li>
    <li>Make sure nothing is missing.</li>
    <li>Make sure everything is in the right place.</li>
    <li>Go back and check it again.</li>
  </ul>

  <p>
    <strong>Warning about colour printing:</strong>
    if your job will be printed in colour, and you need to check the exact colours that will be
    printed, then you should contact us to arrange a <em>production proof</em>. (Your screen
    and printer cannot accurately reproduce the colours of the final product.)
  </p>

  <div style="text-align:center">
    <p>
      <button-link href="${encodeMailUrl(
        `print@allbizsupplies.biz`,
        `Proof approved for order ${orderID}`,
        `I have checked the proof for order ${orderID} and confirm that it is ready for production.`
      )}">
        Approve proof
      </button-link>
      <button-link href="${encodeMailUrl(
        `print@allbizsupplies.biz`,
        `Artwork changes required for order ${orderID}`,
        `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
      )}">
        Request changes
      </button-link>
    </p>
  </div>
`;

};

templates.stat_order_notifications__OrderReadyToCollect = () => {
/**
 * name: Order ready to collect
 * subject: Your order is ready to collect
 */

return template`
  <heading>
    Order ready to collect
  </heading>

  <p>
    Items ready for collection:
  </p>

  <ul>
    <li></li>
  </ul>

  <p>
    Please contact us if you need us to deliver this order to you.
  </p>
`;

};

templates.stat_order_notifications__PartOrderDispatched = () => {
/**
 * name: Part order dispatched
 * subject: Part of your order has been dispatched
 */

const [orderNumber, shipmentType] = getInputs([
  { label: "Order number" },
  {
    label: "Part order type",
    options: [
      { isRemainder: false, label: "This is the first part of the order" },
      { isRemainder: true, label: "This is the final part of the order" },
    ],
  },
]);

const { isRemainder } = shipmentType;

return isRemainder
  ? template`
    <heading>
      We've dispatched the remainder of your order
    </heading>

    <block>
      <p>
        Order number: ${orderNumber}
      </p>
    </block>

    <p>
      We've dispatched the remaining items in your order.
    </p>
  `
  : template`
    <heading>
      We've dispatched part of your order
    </heading>

    <block>
      <p>
        Order number: ${orderNumber}
      </p>
    </block>

    <p>
      We've dispatched part of your order to make sure you get
      your items as soon as possible.
    </p>

    <p>
      We will dispatch the remainder of your order once the items
      are ready to ship.
    </p>
  `;

};

templates.stat_order_notifications__QuotationAttached = () => {
/**
 * name: Quotation
 * subject: Quotation
 */

return template`
  <heading>
    Quotation
  </heading>

  <p>
    Please find your quotation attached.
  </p>
`;

};

templates.stat_order_notifications__UpdatePurchaseOrder = () => {
/**
 * name: Update purchase order
 * subject: Update purchase order
 */

const [purchaseOrderNumber, attachmentType] = getInputs([
  { label: "Purchase order number" },
  {
    label: "Attachment Type",
    options: [
      { label: "Invoice" },
      { label: "Quote" },
    ],
  },
]);

return template`
  <heading>
    Purchase order amendment required
  </heading>

  <block>
    <p>
      Your purchase order: ${purchaseOrderNumber}
    </p>
  </block>

  <p>
    Please update your purchase order to match the attached ${attachmentType.label}.
  </p>
`;

};

templates.stat_order_notifications__WebOrderPaymentRequired = () => {
/**
 * name: Web order payment required
 * subject: Payment required for web order
 */

const [orderNumber, paymentAmount] = getInputs(
  [
    { label: "Web order number" },
    { label: "Payment amount required" },
  ]
);

return template`
  <heading>
    Web order payment required
  </heading>

  <echoice-payment-details
    order-number="${orderNumber}"
    payment-amount="${paymentAmount}"
  />

  <p>
    Your web order is ready for dispatch, however for security reasons
    we need to cancel the credit card payment that you made online, 
    and have not charged your credit card.
  </p>

  <block>
    <p>Order number: ${orderID}</p>
    <p>Payment required: ${paymentAmount}</p>
  </block>

  <payment-options order-id="${orderID}" />
`;

};

templates.supplier_requests__ETARequest = () => {
/**
 * name: Quote request
 * subject: Price and availability
 */

return template`
  <heading>
    Quote request
  </heading>

  <p>
    Please provide a price and availability for the following items:
  </p>

  <ul>
    <li></li>
  </ul>

  <p>
    Thank you.
  </p>
`;

};

templates.supplier_requests__QuoteRequest = () => {
/**
 * name: ETA request
 * subject: ETA for purchase order
 */

const [purchaseOrderNumber] = getInputs([
  { label: "Purchase order number" },
])

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

};

return renderTemplate();