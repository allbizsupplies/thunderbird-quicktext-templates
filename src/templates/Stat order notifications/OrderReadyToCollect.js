/**
 * name: Order ready to collect
 */

setSubject(`Your order is ready to collect`);

return template`
  <heading>
    Order ready to collect
  </heading>

  <p>
    Items ready for collection:
  </p>

  <ul>
    <li></li>
  </ul>

  <p>
    Please contact us if you need us to deliver this order to you.
  </p>

  <block style="background-color:#ffee4e;">
    <p><strong>Collecting orders during COVID-19 lockdown</strong></p>
    <ol>
      <li>Call us once you arrive in the car park.</li>
      <li>We will meet you at the front of the store and give you your order. </li>
    </ol>
  </block>
`;
