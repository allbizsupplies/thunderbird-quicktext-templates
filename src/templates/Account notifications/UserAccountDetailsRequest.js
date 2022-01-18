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

 `;
