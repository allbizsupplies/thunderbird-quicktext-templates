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
