/**
 * name: Invoice
 */

return {
  subject: () => `Invoice`,
  body: () => template`
    <heading>
      Invoice
    </heading>

    <p>
      Please find your invoice attached.
    </p>
  `,
};
