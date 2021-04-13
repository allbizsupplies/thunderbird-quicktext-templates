/**
 * name: About Allbiz Supplies
 * subject: About Allbiz Supplies
 */

return container(`
  ${heading(`
    About Allbiz Supplies
  `)}

  ${paragraph(`
    Allbiz is a family-owned Adelaide business based in Lonsdale.
    We've been supplying businesses and organisations with office 
    supplies, a wide range of education and craft supplies, and 
    printing services for over 35 years.
  `)}

  ${paragraph(`
    As a member of Office Choice, we're able to offer competitive 
    prices on a wide range of office supplies. We do daily deliveries 
    to Adelaide and its surrounds, and we can also deliver orders 
    Australia-wide.
  `)}

  ${paragraph(`
    Below is a link to our website and our contact information. 
    Please don’t hesitate to ring or email if we can be of help 
    with your Education, Cleaning or Art and Craft Supplies, General
    Stationery and Printing.
  `)}

  ${block(`
    ${paragraph(`
      General home page: ${link(
        `https://allbizsupplies.biz/`,
        `allbizsupplies.biz`
      )}
    `)}
  `)}

  ${block(`
    ${paragraph(`
      Buy office supplies: ${link(
        `https://allbiz.officechoice.com.au`,
        `allbiz.officechoice.com.au`
      )}
    `)}

    ${paragraph(`
      Includes office supplies, cleaning, art and craft and educational materials.
    `)}
  `)}

  ${block(`
    ${paragraph(`
      Order printing online: ${link(
        `https://shop.allbizsupplies.biz/`,
        `shop.allbizsupplies.biz`
      )}
    `)}
  `)}
`);
