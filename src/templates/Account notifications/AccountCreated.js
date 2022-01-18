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
