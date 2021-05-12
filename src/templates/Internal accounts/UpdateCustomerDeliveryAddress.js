/**
 * name: Update customer delivery address
 */

return {
  subject: () => `Update customer delivery address`,
  body: () => {
    const [accountNumber, accountName] = getInputs([
      { label: "Account number" },
      { label: "Account name" },
    ]);
    
    return template`
      <heading>
        Update customer delivery address
      </heading>
    
      <block>
        <p>
          Account number: ${accountNumber}<br />
          Account name: ${accountName}
        </p>
      </block>
    
      <p>
        <strong>New delivery address:</strong>
      </p>
    
      <p></p>
    `;
    
  },
};

