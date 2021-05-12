/**
 * name: Quote request
 */

return {
  subject: () => `Price and availability`,
  body: () => {
    return template`
    <heading>
      Quote request
    </heading>
  
    <p>
      Please provide a price and availability for the following items:
    </p>
  
    <ul>
      <li></li>
    </ul>
  
    <p>
      Thank you.
    </p>
  `;
  },
};
