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
