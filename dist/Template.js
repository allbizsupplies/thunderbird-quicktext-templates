const colors = {
  success: "#00ce00",
  warning: "#ffee4e",
  lightBlueGrey: "#f5f5ff",
};

const metrics = {
  spacer: "0.5em",
  halfSpacer: "0.25em",
  doubleSpacer: "1em",
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
      "give us print ready files before 9am and we will dispatch your order in the afternoon",
  },
];

const getServicePriorityUpgradeOptions = (servicePriority) => {
  const servicePriorityIndex = servicePriorityOptions.findIndex(
    ({ name }) => name === servicePriority.name
  );
  return servicePriorityOptions.reduce(
    (upgradeOptions, option, index) =>
      index > servicePriorityIndex
        ? [...upgradeOptions, option]
        : upgradeOptions,
    []
  );
};

const getTextInput = (label) =>
  this.mQuicktext
    .get_input([label, "text"])
    .replace(/&/g, "&amp;amp;")
    .replace(/"/g, "&quot;");

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

const setSubject = (value) => {
  this.mWindow.document.getElementById("msgSubject").value = value;
};

const clearRecipients = (field) => {
  this.mWindow.document
    .getElementById(`${field}AddrInput`)
    .closest(".address-container")
    .querySelectorAll("mail-address-pill")
    .forEach((pill) => pill.remove());
};

const addRecipients = (field, recipients) => {
  this.mWindow.awAddRecipientsArray(`addr_${field}`, recipients);
};

const setTo = (value) => {
  clearRecipients("to");
  addRecipients("to", [value]);
};

const getFrom = () => this.mQuicktext.get_from(["email"]);

const parseOrderIDFromSubject = () => {
  const subject = this.mQuicktext.get_subject();
  const matches = subject.match(/\[Order #(.+)\]/);
  return matches.length === 2 ? matches[1] : "";
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
  const template = templates[templateName];
  const wrappedOutput = Components.wrapper(template());
  return processTemplate(wrappedOutput);
};

const getStyleAttribute = (attributes) =>
  attributes !== undefined && attributes.style !== undefined
    ? attributes.style
    : "";

const Components = {
  wrapper: (content, attributes) => `
    <div style="
      width: 750px;
    ">
      <table style="
        border-collapse: collapse;
        width: 100%;
        ${getStyleAttribute(attributes)}
      ">
        ${content}
      </table>
    </div>
  `,

  row: (content, attributes) => `
    <tr>
      <td style="
        padding: ${metrics.halfSpacer} 0;
        ${getStyleAttribute(attributes)}
      ">
        ${content}
      </td>
    </tr>
  `,

  p: (content, attributes) => Components.row(content, attributes),

  ul: (content, attributes) =>
    Components.row(`
    <ul style="
      padding-top: 0;
      padding-bottom: 0;
      margin: 0;
      ${getStyleAttribute(attributes)}
    ">
      ${content}
    </ul>
  `),

  ol: (content, attributes) =>
    Components.row(`
    <ol style="
      padding-top: 0;
      padding-bottom: 0;
      margin: 0;
      ${getStyleAttribute(attributes)}
    ">
      ${content}
    </ol>
  `),

  li: (content, attributes) => `
    <li style="
      padding: 0;
      margin: 0;
      ${getStyleAttribute(attributes)}
    ">
      ${content}
    </li>
  `,

  heading: (content, attributes) =>
    Components.row(
      `
      <strong style="
        font-size: 1.35em;
      ">
        ${content}
      </strong>`,
      attributes
    ),

  subheading: (content, attributes) =>
    Components.row(
      `
      <strong style="
        font-size: 1.25em;
      ">
        ${content}
      </strong>`,
      attributes
    ),

  block: (content, attributes) => `
    <tr>
      <td style="
        padding: ${metrics.spacer} 0;
      ">
        <table style="
          border-collapse: collapse;
          width: 100%;
        ">
          <tr>
            <td style="
              padding:${metrics.spacer} ${metrics.doubleSpacer};
              background-color: ${colors.lightBlueGrey};
              ${getStyleAttribute(attributes)};
            ">
              <table style="
                border-collapse: collapse;
                width: 100%;
              ">
                ${content}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `,

  "button-link": (content, attributes) => `
    <a href="${attributes.href}" style="
      display: inline-block;
      text-align: center;
      padding:${metrics.spacer} ${metrics.doubleSpacer};
      border-radius: 6em;
      background-color: black;
      color: white;
      text-decoration: none;
      ${getStyleAttribute(attributes)}
    ">
      ${content}
    </a>
  `,

  "print-order-details": (content, attributes) => {
    const orderID = attributes["order-id"];
    if (attributes["service-priority"]) {
      const servicePriority = attributes["service-priority"];
      const servicePriorityUpgradeOptions =
        getServicePriorityUpgradeOptions(servicePriority);

      return `
        ${Components.block(`
          ${orderID ? Components.p(`Order ID: ${orderID}`) : ""}
          ${Components.p(`Project name: ${attributes["project-name"]}`)}
          ${Components.p(`
            Your order's turnaround time:
            <strong>${servicePriority.label}</strong>
            ${
              servicePriority.description
                ? `<span>(${servicePriority.description})</span>`
                : ""
            }
          `)}
          ${Components.p(`
            Estimated completion date:
            <strong>${
              attributes["estimated-completion-date"]
                ? attributes["estimated-completion-date"]
                : "N/A (not in production queue)"
            }</strong>
          `)}
          ${
            attributes["estimated-completion-date"] === undefined
              ? `
                ${Components.p(`
                  We will give you an estimated completion date when
                  we put your order into the production queue.
                `)}
              `
              : ""
          }
          ${
            attributes["offer-service-priority-upgrade"] !== undefined
              ? `
                ${Components.p(`
                  If you need your job to be turned around sooner than this,
                  please contact us ASAP to discuss options.
                `)}
                ${Components.ul(`
                  ${servicePriorityUpgradeOptions
                    .map(
                      (option) => `
                    ${Components.li(`
                      ${option.label}
                      ${option.description ? `(${option.description})` : ``}
                  `)}
                `
                    )
                    .join("")}
                `)}
            `
              : ``
          }
          
        `)}
      `;
    } else {
      return `
        ${Components.block(`
          ${orderID ? Components.p(`Order ID: ${orderID}`) : ""}
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
        Call us on (08) 8326 2899, quote order ID ${attributes["order-id"]},
        and we will take payment for your order.
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
        <strong>Please email a remittance advice to <a href="mailto:${
          attributes["email"] || `accounts@allbizsupplies.biz`
        }">
        ${
          attributes["email"] || `accounts@allbizsupplies.biz`
        }</a> so we can proceed with your order.</strong>
      `)}
    `)}

    ${Components.block(`
      ${Components.p(`
        <strong>Pay on account</strong>
      `)}

      ${Components.p(`
        If you have a credit account at Allbiz, please reply to this email and
        give us your account number. (You can find your account number on your
        invoices or statements.)
      `)}

      ${Components.p(`
        If you would like to apply for an account:
      `)}

      ${Components.ol(`
        ${Components.li(`
          Fill out a 
          <a href="http://cdn.allbizsupplies.biz/forms/eFORM_Account_30day.pdf">
            Credit Account Application Form
          </a>
          and return by email to
          <a href="mailto:accounts@allbizsupplies.biz">
            accounts@allbizsupplies.biz
          </a>.
          It may take several days to process your account application.
        `)}
        ${Components.li(`
          Email us at <a href="mailto:${
            attributes["email"] || `accounts@allbizsupplies.biz`
          }">${attributes["email"] || `accounts@allbizsupplies.biz`}</a>
          and tell us that you have submitted an account application. We'll
          proceed with your order once you account application has been
          processed.
        `)}
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
 */

setSubject(`About Allbiz Supplies`);

return template`
  <heading>About Allbiz Supplies</heading>

  <p>
    Allbiz is a family-owned Adelaide business based in Lonsdale. We've been 
    supplying businesses and organisations with office supplies, a wide range 
    of education and craft supplies, and printing services for over 35 years.
  </p>

  <p>
    As a member of Office Choice, we're able to offer competitive prices on a 
    wide range of office supplies. We do daily deliveries o Adelaide and its 
    surrounds, and we can also deliver orders Australia-wide.
  </p>

  <p>
    Below is a link to our website and our contact information. Please don???t 
    hesitate to ring or email if we can be of help with your Education, 
    Cleaning or Art and Craft Supplies, General Stationery and Printing.
  </p>

  <block>
    <p>
      General home page: 
      <a href="https://allbizsupplies.biz/">allbizsupplies.biz</a>
    </p>
  </block>

  <block>
    <p>
      Buy office supplies: 
      <a href="https://allbiz.officechoice.com.au/">
        allbiz.officechoice.com.au
      </a>
    </p>

    <p>
      Includes office supplies, cleaning, art and craft and 
      educational materials.
    </p>
  </block>

  <block>
    <p>
      Order printing online: 
      <a href="https://shop.allbizsupplies.biz/">shop.allbizsupplies.biz</a>
    </p>
  </block>
  <br/>
`;

};

templates.account_notifications__AccountApplication = () => {
/**
 * name: Credit account application
 */

setSubject(`Credit account application`);

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
  <br/>
`;

};

templates.account_notifications__AccountCreated = () => {
/**
 * name: Account created
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

setSubject(`Your account has been created`);

return template`
  <heading>Your account is ready to use</heading>

  <block>
    <p>
      Account number: ${accountNumber}<br/>
      Account name: ${accountName}<br/>
    </p>
  </block>
 
  <subheading>
    Ordering online using your account
  </subheading>

  <p>
    <strong>To order printing online:</strong>
  </p>

  <ol>
    <li>
      Sign up for a login here:
      <a href="https://shop.allbizsupplies.biz/user_registration.php">
        https://shop.allbizsupplies.biz/user_registration.php
      </a>.
    </li>
    <li>
      Send an email to
      <a href="mailto:print@allbizsupplies.biz">print@allbizsupplies.biz</a>
      that says "Please link my account ${accountNumber} to my login: youremail@example.com".
    </li>
    <li>
      We will notify you when your login has been linked to your new account.
    </li>
    <li>
      Log in to your account here:
      <a href="https://shop.allbizsupplies.biz/user_login.php">
        https://shop.allbizsupplies.biz/user_login.php
      </a>.
    </li>
    <li>
      When you place an order, you will have the option to pay on account
      instead of paying on credit card.
    </li>
  </ol>
  
  <p>
    <strong>To order office supplies online:</strong>
  </p>

  <ol>
    <li>
      We automatically create a login for your when we set up your account.
      You should have received an email with your login details.<br/>
      If you didn't get your login details then email us at
      <a href="mailto:stat@allbizsupplies.biz">stat@allbizsupplies.biz</a>
      and we'll set it up for you.
    </li>
    <li>
      Log in to your account here:
      <a href="https://allbiz.officechoice.com.au/customer/account/login/">
        https://allbiz.officechoice.com.au/customer/account/login/
      </a>
    </li>
    <li>
      When you place an order, you will have the option to pay on account
      instead of paying on credit card.
    </li>
  </ol>
  <br/>
 `;

};

templates.account_notifications__InvoiceArrached = () => {
/**
 * name: Invoice
 */

setSubject(`Invoice`);

return template`
  <heading>
    Invoice
  </heading>

  <p>
    Please find your invoice attached.
  </p>
  <br/>
`;

};

templates.account_notifications__UserAccountCreated = () => {
/**
 * name: User account created
 */

const [accountNumber, accountName, emailAddress, password] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
  { label: "Email address" },
  { label: "Password" },
]);

setSubject(`Your login details for our online shop`);

return template`
  <heading>We have created your user account</heading>

  <block>
    <p>
      Account number: ${accountNumber}<br/>
      Account name: ${accountName}
    </p>
  </block>

  <block style="background-color: #B8EEBB">
    <p>
      Your login details:
    </p>
    <p>
      Email: ${emailAddress}<br/>
      Password: ${password}
    </p>
  </block>

  <ol>
    <li>
      Log in to your account here:
      <a href="https://allbiz.officechoice.com.au/customer/account/login/">
        https://allbiz.officechoice.com.au/customer/account/login/
      </a>
    </li>
    <li>
      When you place an order, you will have the option to pay on account
      ("purchase order") instead of paying on credit card.
    </li>
  </ol>
  <br/>
 `;

};

templates.account_notifications__UserAccountDetailsRequest = () => {
/**
 * name: Request user details for website login
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

setSubject(`Login details for Allbiz online shop`);

return template`
  <heading>Please provide some details for your online login</heading>

  <block>
    <p>
      Account number: ${accountNumber}<br/>
      Account name: ${accountName}<br/>
    </p>
  </block>
 
  <p>
    Please provide the following details so that we can create your user
    account on our online store:
  </p>

  <ul>
    <li>
      The email address for the user account.
    </li>
    <li>
      The contact name for the user account.
    </li>
  </ul>

  <p>
    Once we create your user account, we will send you an email with your
    login details.
  </p>
  <br/>
 `;

};

templates.internal_accounts__AccountApplication = () => {
/**
 * name: Account application
 */

setSubject(`Account application`);
setTo(`accounts@allbizsupplies.biz`);

return template`
  <p>
    Customer's account application is attached.
  </p>
  <br/>
`;

};

templates.internal_accounts__AccountCashPayment = () => {
/**
 * name: Account cash payment
 */

const [invoiceNumber] = getInputs([
  { label: "Invoice number (leave blank if not applicable)" },
]);

const [accountNumber, accountName] = invoiceNumber
  ? ["", ""]
  : getInputs([{ label: "Account number" }, { label: "Account name" }]);

const [paymentAmount, repName] = getInputs([
  { label: "Payment amount" },
  { label: "Taken by" },
]);

setSubject(`Account payment taken in cash`);
setTo(`accounts@allbizsupplies.biz`);

return template`
  <p>
    We have taken an account payment in cash.
  </p>

  <block>  
    <p>
      <strong>Payment details:</strong><br />
      ${
        invoiceNumber
          ? `
          Invoice number: ${invoiceNumber}<br />
        `
          : `
          Invoice number: N/A (customer paying off account balance)<br />
          Account number: ${accountNumber}<br />
          Account name: ${accountName}<br />
        `
      }
      Payment amount: ${paymentAmount}<br />
      Taken by: ${repName}
    </p>
  </block>
  <br/>
`;

};

templates.internal_accounts__CreditRequest = () => {
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

};

templates.internal_accounts__PhoneMessage = () => {
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

  <br/>
  <br/>
  <br/>
`;

};

templates.internal_accounts__UpdateCustomerContactDetails = () => {
/**
 * name: Update customer contact details
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

setSubject(`Update customer contact details`);
setTo(`accounts@allbizsupplies.biz`);

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
  <br/>
`;

};

templates.internal_accounts__UpdateCustomerDeliveryAddress = () => {
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

};

templates.internal_accounts__UpdateCustomerDeliveryInstructions = () => {
/**
 * name: Update customer delivery instructions
 */

const [accountNumber, accountName] = getInputs([
  { label: "Account number" },
  { label: "Account name" },
]);

const [deliveryInstructionsValue] = getInputs([
  {
    label: "Delivery instructions",
    options: [
      { label: "Deliver by Allbiz Driver" },
      { label: "Deliver by Courier" },
      { label: "SMS when ready to collect" },
      { label: "Email when ready to collect", email: true },
      { label: "Call when ready to collect" },
      { label: "other", other: true },
    ],
  },
]);

const deliveryInstructions = deliveryInstructionsValue.other
  ? getInputs([{ label: "Delivery instructions (other)" }]).shift()
  : deliveryInstructionsValue.email
  ? `
    ${deliveryInstructionsValue.label}:<br />
    ${getInputs([{ label: "Email address" }]).shift()}
  `
  : deliveryInstructionsValue.label;

setSubject(`Update customer delivery instructions`);
setTo(`accounts@allbizsupplies.biz`);

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
  <br/>
`;

};

templates.internal_requisitions__PrintStockRequisition = () => {
/**
 * name: Print stock requisition
 */

const [orderID, projectName, dueDate] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  { label: "Due date for stock" },
]);

let itemIndex = 0;
const items = [];
while (true) {
  const itemCode = getInputs([{ label: `Item #${itemIndex + 1} code` }]);
  if (itemCode == "" && itemIndex > 0) {
    break;
  }
  const itemDesc = getInputs([{ label: `Item #${itemIndex + 1} description` }]);
  const itemQuantity = getInputs([
    { label: `Item #${itemIndex + 1} quantity` },
  ]);
  items.push({
    itemCode,
    itemDesc,
    itemQuantity,
  });
  itemIndex++;
}

setSubject(`Print stock requisition`);
setTo(`purch@allbizsupplies.biz`);

const itemsRows = items.reduce((output, item) => {
  return (
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
    `
  );
}, "");

return template`
  <heading>
    Print order requisition
  </heading>

  <block>
    <p>
      Order ID: ${orderID}<br />
      Project name: ${projectName}<br />
      Due date for stock: ${dueDate}
    </p>
  </block>

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
        ">Item quantity</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>
  <br/>
`;

};

templates.print_order_notifications__AwaitingInformation = () => {
/**
 * name: Awaiting information
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

setSubject(
  `${
    orderID ? `[Order #${orderID}]` : ""
  } We need more info so we can start your order`
);

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
  <br/>
`;

};

templates.print_order_notifications__AwaitingPrintReadyFiles = () => {
/**
 * name: Awaiting print ready files
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

setSubject(
  `${
    orderID ? `[Order #${orderID}]` : ""
  } Please send print-ready PDF files so we can start your order`
);

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
  <br/>
`;

};

templates.print_order_notifications__DepositRequired = () => {
/**
 * name: Deposit required
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} Deposit required for your order`
);

return template`
  <heading>
    We need a deposit payment for your order
  </heading>

  <p>
    Your invoice is attached.
  </p>
  
  <p>
    Please pay a 50% deposit (or the full amount of the invoice) so we can start your order. 
  </p>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <payment-options order-id="${orderID}" email="print@allbizsupplies.biz" />
  <br/>
`;

};

templates.print_order_notifications__FixArtwork = () => {
/**
 * name: Fix artwork
 */

const [orderID, projectName, artworkVersion] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Artwork version",
    options: [
      { value: 1, label: "First version" },
      { value: 2, label: "Second version" },
      { value: 3, label: "Third version or greater" },
    ],
  },
]);

const artworkVersionNumber =
  artworkVersion.value >= 3
    ? getInputs([{ label: "Artwork version number" }])
    : artworkVersion.value;

const proofCharge = `16.50`;
const setupHourlyCharge = `90.00`;

const accruedProofCharges =
  artworkVersion.value >= 3
    ? getInputs([{ label: "Accrued artwork charges for rejected proofs" }])
    : 0;

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} Your artwork needs to be fixed`
);

return template`
  <heading>
    Your artwork needs to be fixed
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
  />

  ${
    artworkVersion.value === 1
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
  <br/>
`;

};

templates.print_order_notifications__HardcopyProofReady = () => {
/**
 * name: Hardcopy proof ready
 */

const [orderID, projectName, servicePriority] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} Hardcopy proof is ready to view`
);

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
    We can't put your order into the production queue until you approve
    your proof.
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

  <tr>
    <td>
      <table style="border-collapse: collapse; width: 100%">
        <tr>
          <td style="padding: 0.25em 0.5rem; text-align: right">
            <button-link href="${encodeMailUrl(
              getFrom(),
              `Proof approved for order ${orderID}`,
              `I have checked the proof for order ${orderID} and confirm that it is ready for production.`
            )}">
              Approve proof
            </button-link>
          </td>
          <td style="padding: 0.25em 0.5rem">
            <button-link href="${encodeMailUrl(
              getFrom(),
              `Artwork changes required for order ${orderID}`,
              `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
            )}">
              Request changes
            </button-link>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <br/>
`;

};

templates.print_order_notifications__InProduction = () => {
/**
 * name: In production
 */

const [orderID, projectName, servicePriority, estimatedCompletionDate] =
  getInputs([
    { label: "Order ID" },
    { label: "Project name" },
    {
      label: "Service priority",
      options: servicePriorityOptions,
    },
    { label: "Estimated completion date" },
  ]);

setSubject(
  `${
    orderID ? `[Order #${orderID}]` : ""
  } Your order is in the production queue`
);

return template`
  <heading>
    We have put your order into the production queue
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
    estimated-completion-date="${estimatedCompletionDate}"
    offer-service-priority-upgrade=""
  />
  <br/>
`;

};

templates.print_order_notifications__OrderDispatched = () => {
/**
 * name: Order dispatched
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
]);

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} We have dispatched your order`
);

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
  <br/>
`;

};

templates.print_order_notifications__OrderReadyToCollect = () => {
/**
 * name: Order ready to collect
 */

const [orderID, projectName] = getInputs([
  { label: "Order ID" },
  { label: "Project name" },
]);

setSubject(
  `${orderID ? `[Order #${orderID}]` : ""} Your order is ready to collect`
);

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
  <br/>
`;

};

templates.print_order_notifications__PartOrderDispatched = () => {
/**
 * name: Part order dispatched
 */
const [orderID, shipmentType] = getInputs([
  { label: "Order ID" },
  {
    label: "Part order type",
    options: [
      { isRemainder: false, label: "This is the first part of the order" },
      { isRemainder: true, label: "This is the final part of the order" },
    ],
  },
]);

const { isRemainder } = shipmentType;

setSubject(
  `${
    orderID ? `[Order #${orderID}]` : ""
  } Part of your order has been dispatched`
);

return isRemainder
  ? template`
    <heading>
      We've dispatched the remainder of your order
    </heading>

    <block>
      <p>
        Order number: ${orderID}
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
        Order number: ${orderID}
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
    <br/>
  `;

};

templates.print_order_notifications__ProofApprovalRequired = () => {
/**
 * name: Proof approval required
 */

const [orderID, projectName, servicePriority, version, artworkCharge] =
  getInputs([
    { label: "Order ID" },
    { label: "Project name" },
    {
      label: "Service priority",
      options: servicePriorityOptions,
    },
    { label: "Proof version number" },
    { label: "Accrued artwork charge (leave blank if not applicable)" },
  ]);

setSubject(`${orderID ? `[Order #${orderID}]` : ""} Proof approval required`);

return template`
  <heading>
    Proof approval required
  </heading>

  <print-order-details
    order-id="${orderID}"
    project-name="${projectName}"
    service-priority="${servicePriority}"
  />

  <block style="background-color:${colors.warning}">
    <p>
      Proof version: ${version}
    </p>
    ${
      artworkCharge
        ? `
      <p>Your artwork charge so far: $${artworkCharge}</p>
    `
        : ``
    }
    <p>
      If you make changes that are not part of the directions that you've 
      discussed with us, then you will incur additional charges to cover
      these changes.
    </p>
  </block>

  <p>
    Your proof is attached. Please check it carefully and send us your
    approval if everything is correct.
  </p>

  <p>
    We can't put your order into the production queue until you approve
    your proof.
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

  <p>
    <strong>Warning about colour printing:</strong>
    if your job will be printed in colour, and you need to check the exact colours that will be
    printed, then you should contact us to arrange a <em>production proof</em>. (Your screen
    and printer cannot accurately reproduce the colours of the final product.)
  </p>

  <tr>
    <td>
      <table style="border-collapse: collapse; width: 100%">
        <tr>
          <td style="padding: 0.25em 0.5rem; text-align: right">
            <button-link href="${encodeMailUrl(
              getFrom(),
              `Proof approved for order ${orderID}`,
              `I have checked the proof for order ${orderID} and confirm that it is ready for production.`
            )}">
              Approve proof
            </button-link>
          </td>
          <td style="padding: 0.25em 0.5rem">
            <button-link href="${encodeMailUrl(
              getFrom(),
              `Artwork changes required for order ${orderID}`,
              `Please make the following changes to the artwork for order ${orderID}:\n\n\n`
            )}">
              Request changes
            </button-link>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <br/>
`;

};

templates.stat_order_notifications__InvoicePaymentRequired = () => {
/**
 * name: Invoice payment required
 */

const [invoiceNumber] = getInputs([{ label: "Invoice number" }]);

setSubject(
  `${
    invoiceNumber ? `[Invoice #${invoiceNumber}]` : ""
  } Invoice payment required`
);

return template`
  <heading>
    Invoice payment required
  </heading>

  <p>
    Your invoice is attached. We will supply your order as soon as we receive payment.
    <br />
  </p>

  <payment-options order-id="${invoiceNumber}" email="stat@allbizsupplies.biz" />
  <br/>
`;

};

templates.stat_order_notifications__OrderReadyToCollect = () => {
/**
 * name: Order ready to collect
 */

setSubject(`Your order is ready to collect`);

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
  <br/>
`;

};

templates.stat_order_notifications__PartOrderDispatched = () => {
/**
 * name: Part order dispatched
 */

const [orderID, shipmentType] = getInputs([
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

setSubject(`Part of your order has been dispatched`);

return isRemainder
  ? template`
    <heading>
      We've dispatched the remainder of your order
    </heading>

    <block>
      <p>
        Order number: ${orderID}
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
        Order number: ${orderID}
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
    <br/>
  `;

};

templates.stat_order_notifications__QuotationAttached = () => {
/**
 * name: Quotation
 */

setSubject(`Quotation`);

return template`
  <heading>
    Quotation
  </heading>

  <p>
    Please find your quotation attached.
  </p>
  <br/>
`;

};

templates.stat_order_notifications__UpdatePurchaseOrder = () => {
/**
 * name: Update purchase order
 */

const [purchaseOrderNumber, attachmentType] = getInputs([
  { label: "Purchase order number" },
  {
    label: "Attachment Type",
    options: [{ label: "Invoice" }, { label: "Quote" }],
  },
]);

setSubject(`Update purchase order ${purchaseOrderNumber}`);

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
  <br/>
`;

};

templates.stat_order_notifications__WebOrderPaymentRequired = () => {
/**
 * name: Web order payment required
 */

const [orderID, paymentAmount] = getInputs([
  { label: "Web order number" },
  { label: "Payment amount required" },
]);

setSubject(`Payment required for web order`);

return template`
  <heading>
    Web order payment required
  </heading>

  <echoice-payment-details
    order-number="${orderID}"
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
  <br/>
`;

};

templates.supplier_requests__CouriersPleaseRedelivery = () => {
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

};

templates.supplier_requests__ETARequest = () => {
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
  <br/>
`;

};

templates.supplier_requests__QuoteRequest = () => {
/**
 * name: Quote request
 */

setSubject(`Price and availability`);

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
  <br/>
`;

};

return renderTemplate();