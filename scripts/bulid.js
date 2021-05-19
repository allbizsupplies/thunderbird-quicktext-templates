const fs = require("fs");
const path = require("path");

const SRC_DIR = path.normalize("./src");
const DIST_DIR = path.normalize("./dist");
const SRC_TEMPLATE_DIR = path.normalize(`${SRC_DIR}/templates`);
const DIST_TEMPLATE_DIR = path.normalize(`${DIST_DIR}/templates`);

const TemplateType = {
  PLAINTEXT: 0,
  HTML: 1,
};

const getScriptName = (dirname, filename) =>
  `${snakecase(dirname)}__${filename.split(".")[0]}`;

const snakecase = (value) => value.toLowerCase().replace(/ /g, "_");

const collectTemplateMenus = () => {
  const dirnames = fs.readdirSync(SRC_TEMPLATE_DIR);
  const menus = dirnames.map((dirname) => {
    const dirpath = path.normalize(`${SRC_TEMPLATE_DIR}/${dirname}`);
    const filenames = fs.readdirSync(dirpath);
    const templates = filenames.map((filename) => {
      const filepath = path.normalize(`${dirpath}/${filename}`);
      const templateName = parseTemplateName(filepath);
      const scriptName = getScriptName(dirname, filename);
      return {
        name: templateName,
        body: `[[SCRIPT=Template|${scriptName}]]`,
      };
    });
    return {
      title: dirname,
      templates,
    };
  });
  return menus;
};

const buildScript = () => {
  const dirnames = fs.readdirSync(SRC_TEMPLATE_DIR);
  const scripts = dirnames.map((dirname) => {
    const dirpath = path.normalize(`${SRC_TEMPLATE_DIR}/${dirname}`);
    const filenames = fs.readdirSync(dirpath);
    const scripts = filenames.map((filename) => {
      const filepath = path.normalize(`${dirpath}/${filename}`);
      const scriptName = getScriptName(dirname, filename);
      const scriptBody = fs.readFileSync(filepath, "utf8");
      return {
        name: scriptName,
        body: scriptBody,
      };
    });
    const common = fs.readFileSync(path.normalize(`${SRC_DIR}/template.js`));
    return (
      scripts.reduce(
        (output, script) => `${output}

        templates.${script.name} = = () => {
          ${script.body}
        };
    `,
        `${common}
      
      const templates = {};
    `
      ) +
      `
      return renderTemplate();`
    );
  });
};

const renderScriptImport = () => {
  const script = buildScript();

  return `
    <?xml version="1.0"?>
    <quicktext version="2">
      <filetype>scripts</filetype>
      <script>
        <name><![CDATA[Template]]></name>
        <body><![CDATA[${script}]]></body>
      </script>
    </quicktext>
  `;
};

const renderTemplatesMenuImport = (menu) => {
  const { title, templates } = menu;

  return `
    <?xml version="1.0"?>
    <quicktext version="2">
      <filetype>templates</filetype>
      ${menus}
      <menu>
        <title><![CDATA[${title}]]></title>
        <texts>
          ${templates.reduce(
            (output, template) => `${output}
          <text shortcut="" type="${TemplateType.HTML}">
            <name><![CDATA[${template.name}]]></name>
            <body><![CDATA[${template.body}]]></body>
          </text>
          `,
            ""
          )}
        </texts>
      </menu>
    </quicktext>
  `;
};

// Remove the dist folder.
fs.rmdirSync(DIST_DIR, {
  recursive: true,
});

// Recreate the dist and dist/template folders.
fs.mkdirSync(DIST_DIR);
fs.mkdirSync(DIST_TEMPLATE_DIR);

// Write the scripts import file.
const scriptFilepath = path.normalize(`${DIST_DIR}/scripts.xml`);
const scriptContent = renderScriptImport();
fs.writeFileSync(scriptFilepath, scriptContent);

// Write the template import files.
const menus = collectTemplateMenus();
for (let menu of menus) {
  const menuFilepath = path.normalize(`${DIST_TEMPLATE_DIR}/${title}.xml`);
  const menuContent = renderTemplatesMenuImport();
  fs.writeFileSync(menuFilepath, menuContent);
}
