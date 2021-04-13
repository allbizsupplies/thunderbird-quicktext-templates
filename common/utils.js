const getTextInput = (name) => this.mQuicktext.get_input([name, "text"]);

const getSelectInput = (name, options) => {
  const labels = options.map(({ label }) => label);
  const selectedLabel = this.mQuicktext.get_input([
    name,
    "select",
    labels.join(";"),
  ]);
  return options.find(({ label }) => label == selectedLabel);
};

const getInputs = (fieldDefinitions) => {
  return fieldDefinitions.map(fieldDefinition => {
    const { name } = fieldDefinition;
    return fieldDefinition.options
      ? getSelectInput(name, fieldDefinition.options)
      : getTextInput(name);
  });
};

const encodeMailUrl = function (mailTo, subject, body) {
  return `mailto:${mailTo}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};
