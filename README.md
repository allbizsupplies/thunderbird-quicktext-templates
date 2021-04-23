
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

How this project generates templates, and how to maintain them
--------------------------------------------------------------

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
1. Metadata: the name and subject we should use for this template in the Quicktext menu
2. User Inputs: we prompt the user to give us two bits of information: an order ID and project name.
3. Template markup: we use XML to express the content that should be returned by this template.

When we run `build.py`, it collects these templates and makes a bunch of template import files, found in `dist/templates`. You import these to create the menu items that appear in the Quicktext menu. It also collects these templates and combines them with the code in `src/template.js` to make a complete JavaScript script that contains all of the logic needed to actually make the templates work.

`src/template.js` contains a few things:
1. Some info, including colours and service priority options.
2. The code to show input boxes and multiple choice lists to the user.
3. The code to turn the template XML into HTML markup.
