/**
 * name: Credit account application
 */

return {
  subject: () => `Credit account application`,
  body: () => template`
    <heading>
      Credit account application
    </heading>

    <p>
      Please find an account application attached.
    </p>

    <p>
      You can return the completed form by email or post.
    </p>

    <block>
      <p>
        <strong>Email:</strong><br />
        stat@allbizsupplies.biz
      </p>

      <p>
        <strong>Post:</strong><br />
        125 O'Sullivan Beach Road<br />
        Lonsdale SA 5160
      </p>
    </block>
  `,
};
