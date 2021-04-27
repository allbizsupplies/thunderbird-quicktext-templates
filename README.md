
Thunderbird Quicktext Scripts
=============================

JavaScript-based templates for Thunderbird's Quicktext addon.

How to import templates into Thunderbird
----------------------------------------

This imports two things:
1. The menu items that appear in the Quicktext bar.
2. The script that actually makes these templates work.

Steps:
1. Download this project.
2. In Thunderbird, open Quicktext's settings (under Tools > Quicktext in the menu bar).
3. In the Quicktext window, select File > Import > Scripts from the menu bar. Select `scripts.xml` from the `dist` folder in this project and click Open.
4. In the Quicktext window again, select File > Import > Templates from the menu bar. Go to the `dist/templates` folder in this project and select the templates menu you want to import.
5. Repeat step 4 until you've imported all of the menus you want.

How these templates work
------------------------

Normally, you would make Quicktext templates by opening up the Quicktext settings and adding templates into the menu. Your templates will either consist of plain text or HTML code. If you look at a templates provided by this package, you won't find either of those. Instead, you'll see something like this:

```
[[SCRIPT=Template|print_order_notifications__ProofApprovalRequired]]
```

This is a Quicktext **tag**. A tag begins and ends with a paid of brackets (`[[` and `]]`). `SCRIPT` is the type of tag: it executes a JavaScript script file that returns some text or HTML. `Template` is the name of the script file being executed: this the script you imported in step 3 of the import process above. `print_order_notifications__ProofApprovalRequired` is an argument (or parameter) that is passed to the `Template` script.

The `Template` script has a list of templates that it can generate, and they are all named according to their menu location. In this example, `print_order_notifications__ProofApprovalRequired` is the template for proof approval messages located in the "Print order notifications" template menu.The `Template` script has a list of templates with these machine-friendly names; when the script runs, it grabs the template with the given name and returns its output.

How this project generates templates
------------------------------------

This project contains a list of template file in `src/templates`. Each template is located in a folder named after the menu the template belongs to. Each template contains some code that looks like this:

```js
// src/templates/Print order notifications/OrderReadyToCollect.js

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
```

This template has three parts:
1. Metadata: the name and subject we should use for this template in the Quicktext menu. This are written in a JavaScript block comment.
2. User Inputs: we prompt the user to give us two bits of information: an order ID and project name. The values supplied by the user are stored so we can use them in the template markup.
3. Template markup: we use XML to express the content that should be returned by this template. This markup can contain XHTML tags as well as specially defined tags that will be translated into valid HTML.

When we run `build.py`, it collects these templates and makes a bunch of template import files, found in `dist/templates`. You import these to create the menu items that appear in the Quicktext menu. It also collects these templates and combines them with the code in `src/template.js` to make a complete JavaScript script that contains all of the logic needed to actually make the templates work.

`src/template.js` contains a few things:
1. Some info, including colours and service priority options.
2. The code to show input boxes and multiple choice lists to the user. 
3. The code to turn the template XML into HTML markup.

How to add new templates
------------------------

### Creating a new template

Create a new `.js` file in one of the folders in `src/templates`. The folder name is the menu name that the template will belong to. You can create a new folder if you want a new menu. Don't put any spaces in the name of the `.js` file.

At the top of the file, add a JavaScript block comment:
```js
/**
 * name: The name of the template that will appear in the Quicktext menu bar
 * subject: The subject that will be set on the email when the template is selected
 */
 ```

If you need to collect input from the user for the template, add a call to `getInputs`. `getInputs` takes one argument, which is a list of objects. Each object needs to have at least one attribute, `label`, which is used to identify the input. By default, the user will be asked to type into a text box, but if your object includes an `opions` attribute then the user will be prompted to choose from a multiple choice list.

For example:
```js
const [name, quest, favouriteColour] = getInputs([
  { label: "What is your name?" },
  { label: "What is your quest?" },
  { label: "What is your favourite colour?", options: [
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
    { label: "I don't know", value: "unknown" },
  ]},
]);
```
Since we passed a list of three objects to `getInputs`, we get a list of three answers returned to us.
| value              | type of input           | type of value returned to us    |
| ---                | ---                     | ---                             |
| `name`             | text input              | a string                        |
| `quest`            | text input              | a string                        |
| `favouriteColour`  | multiple choice select  | an object (the selected option) |

Lastly, we need to return something to put in the email. For this we retuern a tagged template string.

Here's an example of a return value:
```js
return template`
  <block>
    <p>
      My name is ${name}.
    </p>
    <p>
      I am on a quest ${quest}.
    </p>
    <p>
      My favourite colour is ${favouriteColour.name}.
    </p>
  </block>
`;
```

There's some magic that happens behind the scenes when this template is used:
1. The placeholders `${name}`, `${quest}` and `${favouriteColour.value}` are replaced with their actual values.
2. The `block` element is replaced with some HTML that appears as a light grey box.
3. The `p` elements are updated with a style attribute to make sure they are spaced nicely.

This is what comes out when Sir Lancelot of Camelot uses the template:

```html
<div style="padding:1em 0;">
  <div style="padding:1em 1em;background-color:#eeedff;">
    <p style="margin:0;padding:1em 0;">
      My name is Sir Lancelot of Camelot
    </p>
    <p style="margin:0;padding:1em 0;">
      I an on a quest to seek the Holy Grail. 
    </p>
    <p style="margin:0;padding:1em 0;">
      My favourite colour is blue.
    </p>
  </div>
</div>
```

### Importing the new template into Quicktext

In order to actually use your new template, you have to run the build script. This is a Python script, so you need to have Python installed on your computer in order to run it.

Open a shell terminal in the project and run `python build.py`. 



