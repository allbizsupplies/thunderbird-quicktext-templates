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
              attributes["service-priority"].description
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
