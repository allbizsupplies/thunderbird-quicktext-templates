/**
 * name: Order ready to collect
 */

 return {
  subject: () => `Your order is ready to collect`,
  body: () => template`
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
  `,
};
