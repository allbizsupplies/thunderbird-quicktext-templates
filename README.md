# Thunderbird Quicktext Scripts

JavaScript-based templates for Thunderbird's Quicktext addon.

## How to import templates into Thunderbird

This imports two things:

1. The menu items that appear in the Quicktext bar.
2. The script that actually makes these templates work.

Steps:

1. Download this project.
2. In Thunderbird, open Quicktext's settings (under Tools > Quicktext in the menu bar).
3. In the Quicktext window, select File > Import > Scripts from the menu bar. Select `scripts.xml` from the `dist` folder in this project and click Open.
4. In the Quicktext window again, select File > Import > Templates from the menu bar. Go to the `dist/templates` folder in this project and select the templates menu you want to import.
5. Repeat step 4 until you've imported all of the menus you want.

## How to add new templates

You need to know how to write ES6 JavaScript (ECMAScript2015) in order to create and edit templates.

### Creating a new template

Create a new `.js` file in one of the folders in `src/templates`. The folder name is the menu name that the template will belong to. You can create a new folder if you want a new menu. Don't put any spaces in the name of the `.js` file.

At the top of the file, add a JavaScript block comment. For example:

```js
/**
 * name: Greeting
 */
```

Following the comment, add a retrun statement that returns an object with two properties, `subject` and `body`. Both of these values must be functions that take no arguments and return a string. For example:

```js
return {
  subject: () => `Greetings!`,
  body: () => template`Hello, fellow Earthling`,
};
```

Note: the tag `template` is used to wrap the body message in some HTML that
improves the formatting of the message.

### Collecting user input

If you need to collect input from the user for the template, add a call to `getInputs`. `getInputs` takes one argument, which is a list of objects. Each object needs to have at least one attribute, `label`, which is used to identify the input. By default, the user will be asked to type into a text box, but if your object includes an `opions` attribute then the user will be prompted to choose from a multiple choice list.

For example:

```js
/**
 * name: Greeting
 */

return {
  subject: () => `Greetings!`,
  body: () => {
    const [fromName, toName] = getInputs([
      { label: "My name" },
      { label: "Recipient's name" },
    ]);

    return template`Greetings, ${toName}! My name is ${fromName}.`;
  },
};
```

### Using HTML in your template

You can also include some HTML in the body message, but not the subject:

```js
/**
 * name: Greeting
 */

return {
  subject: () => `Greetings!`,
  body: () => {
    const [fromName, toName] = getInputs([
      { label: "My name" },
      { label: "Recipient's name" },
    ]);

    return template`
      <p>Greetings, ${toName}! My name is ${fromName}</p>
    `;
  },
};
```

Some common HTML tags (`p`, `ul`, `ol`, and `li`) will receive some extra styles before they are added to the template to make sure they have nice padding around them.

You must use XHTML, which means that closed tags must have a slash.

This is OK: `<br />`

This won't work: `<br>`

The above template will actually produce the following body HTML (Assuming someone named Gazurgleblurg is writing to someone named John):

```html
<div style="width:100%;max-width:750px;">
  <p style="margin:0;padding:0.5em 0;">
    Greetings, John! My name is Gazurgleblurg.
  </p>
</div>
```

### Special XML elements (that are turned into HTML)

These templates can also include some special XML tags which are turned into HTML when they are rendered:

#### `heading`

Use this instead of using HTML's `h1`. This will render some large, bold text.

```xml
<heading>This is a heading</heading>
```

#### `subheading`

Use this instead of using HTML's `h2`. This will render some large, bold text, but smaller than the text rendered by `heading`.

```xml
<heading>This is a subheading</heading>
```

Note: don't use HTML `h3` to `h6`, either. You don't need them. It's an email, not a blog article.

#### `block`

This produces a lightly-shaded box that can contain other elements.

```xml
<block>
  <p>Project name: ${projectName}</p>
</block>
```

#### `button-link`

This produces a link styled to appear as a clickable button.

This tag takes one attribute:

| Name   | Description                                  | Required |
| :----- | :------------------------------------------- | :------- |
| `href` | The URL that the link will open when clicked | Required |

```xml
<button-link href="https://allbizsupplies.biz">
  Visit our website
</button-link>
```

#### `print-order-details`

This produces a block containing several lines of information about a print order

This tag takes several attributes:
| Name | Description | Required |
| :-- | :-- | :-- |
| `order-id` | The order number for the job | Required |
| `project-name` | The name on the job (e.g. Catalogues) | Required |
| `service-priority` | An object representing the service priority | Optional |
| `estimated-completion-date` | The estimated completion date for the job | Optional |
| `offer-service-priority-upgrade` | If included, includes an offer to upgrade the order's priority and lists the customer's options | Optional |

A couple of notes:

`service-priority` expects you to provide one of the pre-defined service priority options:

- Standard
- Urgent
- Express (more urgent than Urgent)
- Same day

To get the user to select one of these options, use this code:

```js
const [servicePriority] = getInputs([
  {
    label: "Service priority",
    options: servicePriorityOptions,
  },
]);
```

This will give you an object that you can put straight into the XML tag:

```xml
<print-order-details
  order-id="${orderID}"
  project-name="${projectName}"
  service-priority="${servicePriority}"
  estimated-completion-date="${estimatedCompletionDate}"
  offer-service-priority-upgrade=""
/>
```

Note: the value for `offer-service-priority-upgrade` can be anything, so long as you include the attribute. HTML style valueless attributes are not supported, so you have to include the equals sign and the quotes, even if you don't put a value in there.

This is OK: `offer-service-priority-upgrade=""`

This is OK: `offer-service-priority-upgrade="yes"`

This is OK: `offer-service-priority-upgrade="please"`

This is not OK: `offer-service-priority-upgrade`

If you don't want to offer a service upgrade then leave that attribute out entirely.

Example without service upgrade offer:

```xml
<print-order-details
  order-id="${orderID}"
  project-name="${projectName}"
  service-priority="${servicePriority}"
  estimated-completion-date="${estimatedCompletionDate}"
/>
```

Example without service priority or estimated completion time:

```xml
<print-order-details
  order-id="${orderID}"
  project-name="${projectName}"
/>
```

Note, if you leave out `service-priority` then `estimated-completion-date` will also be ignored.

#### `payment-options`

Displays a block containing payment instructions to tell people how to pay for their by EFT or over the phone.

This tag takes one required attribute:

| Name       | Description                                                                 | Required |
| :--------- | :-------------------------------------------------------------------------- | :------- |
| `order-id` | The order ID that the customer needs to quote when they pay for their order | Required |

```xml
 <payment-options order-id="${orderID}" />
```

### Importing the new template into Quicktext

In order to actually use your new template, you have to run the build script. This is a Python script, so you need to have Python installed on your computer in order to run it.

Open a shell terminal in the project and run `python build.py`.
