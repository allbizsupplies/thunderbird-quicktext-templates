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
