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
