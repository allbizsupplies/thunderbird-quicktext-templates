const {
  template,
  processTemplate,
  Components,
  servicePriorityOptions,
  encodeObject,
  decodeObject,
  encodeMailUrl,
} = require("./template");

const expectTemplateOutputToMatch = function (result, expectedResult) {
  expect(result.replace(/\n/gi, "").replace(/ /gi, "")).toMatch(
    expectedResult.replace(/\n/gi, "").replace(/ /gi, "")
  );
};

describe("template tag function", () => {
  test("renders template with string value", () => {
    const value = "foo";
    const result = template`
      ${value}
    `;
    expect(result).toMatch(/foo/i);
  });

  test("encodes object value", () => {
    const value = {
      foo: "bar",
    };
    const result = template`
      ${value}
    `;
    expect(result).toMatch(/json:eyJmb28iOiJiYXIifQ==/i);
  });
});

test("encodes and decodes object", () => {
  const value = { foo: "bar" };
  const result = decodeObject(encodeObject(value));
  expect(result.foo).toEqual(value.foo);
});

test("encodes mail URL", () => {
  const result = encodeMailUrl(`foo@bar.com`, `qux queebly`, `grault`);
  const expectedResult = `mailto:foo@bar.com?subject=qux%20queebly&amp;amp;body=grault`;
  expect(result).toEqual(expectedResult);
});

describe("processes template", () => {
  test("with single element", () => {
    const value = `<div>foo</div>`;
    const result = processTemplate(value);
    expectTemplateOutputToMatch(result, value);
  });

  test("with single element and attribute", () => {
    const value = `<div style="color:red">foo</div>`;
    const result = processTemplate(value);
    const expectedResult = `<div style="color:red">foo</div>`;
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with mail URL", () => {
    const mailURL = encodeMailUrl(`foo@bar.com`, `qux queebly`, `grault`);
    const value = `<div><a href="mailto:foo@bar.com">foo</a></div>`;
    const result = processTemplate(value);
    const expectedResult = `<div><a href="mailto:foo@bar.com">foo</a></div>`;
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with encoded mail URL", () => {
    const mailURL = encodeMailUrl(`foo@bar.com`, `qux queebly`, `grault`);
    const value = `<div><a href="${mailURL}">foo</a></div>`;
    const result = processTemplate(value);
    const expectedResult = `<div><a href="mailto:foo@bar.com?subject=qux%20queebly&amp;amp;body=grault">foo</a></div>`;
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with p component", () => {
    const value = `<p>foo</p>`;
    const result = processTemplate(value);
    const expectedResult = Components.p(`foo`);
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with p component inside div element", () => {
    const value = `<div><p>foo</p></div>`;
    const result = processTemplate(value);
    const expectedResult = "<div>" + Components.p(`foo`) + "</div>";
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with ul component", () => {
    const value = `<ul>foo</ul>`;
    const result = processTemplate(value);
    const expectedResult = Components.ul(`foo`);
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with ol component", () => {
    const value = `<ol>foo</ol>`;
    const result = processTemplate(value);
    const expectedResult = Components.ol(`foo`);
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with li component", () => {
    const value = `<li>foo</li>`;
    const result = processTemplate(value);
    const expectedResult = Components.li(`foo`);
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with ul and li components", () => {
    const value = `<ul><li>foo</li></ul>`;
    const result = processTemplate(value);
    const expectedResult = Components.ul(Components.li(`foo`));
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with heading component", () => {
    const value = `<heading>foo</heading>`;
    const result = processTemplate(value);
    const expectedResult = Components.heading(`foo`);
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with subheading component", () => {
    const value = `<subheading>foo</subheading>`;
    const result = processTemplate(value);
    const expectedResult = Components.subheading(`foo`);
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with button-link component", () => {
    const value = `<button-link href="grault">foo</button-link>`;
    const result = processTemplate(value);
    const expectedResult = Components["button-link"](`foo`, {
      href: "grault",
    });
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with payment-options component", () => {
    const value = `<payment-options order-id="foo" />`;
    const result = processTemplate(value);
    const expectedResult = Components["payment-options"](null, {
      "order-id": "foo",
    });
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with print-order-details component", () => {
    const servicePriority = encodeObject(servicePriorityOptions[0]);
    const value = `
      <print-order-details
        order-id="foo"
        project-name="bar"
        service-priority="${servicePriority}"
        estimated-completion-date="grault"
      />`;
    const result = processTemplate(value);
    const expectedResult = Components["print-order-details"](null, {
      "order-id": "foo",
      "project-name": "bar",
      "service-priority": servicePriorityOptions[0],
      "estimated-completion-date": "grault",
    });
    expectTemplateOutputToMatch(result, expectedResult);
  });

  test("with print-order-details component, omitting optional attributes", () => {
    const value = `
      <print-order-details
        order-id="foo"
        project-name="bar"
      />`;
    const result = processTemplate(value);
    const expectedResult = Components["print-order-details"](null, {
      "order-id": "foo",
      "project-name": "bar",
    });
    expectTemplateOutputToMatch(result, expectedResult);
  });
});
