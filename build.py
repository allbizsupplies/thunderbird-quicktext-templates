#!/usr/bin/python3

from enum import Enum
import os
import re
import xml


SRC_DIR = "./src"

TEMPLATE_DIR = os.path.join(SRC_DIR, "templates")


class TemplateType:
    PLAINTEXT = 0
    HTML = 1


def main():
    if not os.path.exists("./dist"):
        os.mkdir("dist")
    if not os.path.exists("./dist/templates"):
        os.mkdir("./dist/templates")
    menus, scripts = collect_templates()
    with open(os.path.join("./dist", "Template.js"), "w") as file:
        file.write(compile_template_scripts(scripts))
    with open(os.path.join("./dist", "scripts.xml"), "w") as file:
        document = render_scripts(scripts)
        file.write(document)
    for menu in menus:
        with open(os.path.join("./dist", "templates", menu["title"] + ".xml"), "w") as file:
            document = render_templates(menu)
            file.write(document)


def collect_common_scripts():
    scripts = []
    return "\n\n".join(scripts)


def compile_template_scripts(template_scripts):
    script = ""
    with open(os.path.join(SRC_DIR, "template.js"), "r") as file:
        script += file.read()
    script += "const templates = {}\n\n"
    for template_script in template_scripts:
        script += "templates." + \
            template_script["name"] + \
            " = () => {\n" + template_script["body"] + "\n};\n\n"
    script += "renderTemplate();"
    return script


def collect_templates():
    menus = []
    scripts = []
    for menu_title in os.listdir(TEMPLATE_DIR):
        texts = []
        dirpath = os.path.join(TEMPLATE_DIR, menu_title)
        for filename in os.listdir(dirpath):
            filepath = os.path.join(dirpath, filename)
            script_name = snakecase(menu_title) + "__" + filename.split(".")[0]
            text_name, text_subject, script_body = parse_template(filepath)
            texts.append({
                "name": text_name,
                "subject": text_subject,
                "body": "[[SCRIPT=Template|{}]]".format(script_name),
            })
            scripts.append({
                "name": script_name,
                "body": script_body,
            })
        menus.append({
            "title": menu_title,
            "texts": texts,
        })
    return menus, scripts


def render_scripts(scripts):
    document = '<?xml version="1.0"?>\n'
    document += '<quicktext version="2">\n'
    document += '<filetype>scripts</filetype>\n'
    template_script = compile_template_scripts(scripts)
    document += '<script>\n'
    document += '<name><![CDATA[Template]]></name>\n'
    document += '<body><![CDATA[{}]]></body>\n'.format(template_script)
    document += '</script>\n'
    document += '</quicktext>\n'
    return document


def render_templates(menu):
    document = '<?xml version="1.0"?>\n'
    document += '<quicktext version="2">\n'
    document += '<filetype>templates</filetype>\n'
    document += '<menu>\n'
    document += '<title><![CDATA[{title}]]></title>\n'.format(
        title=menu["title"])
    document += '<texts>\n'
    for text in menu["texts"]:
        document += '<text shortcut="" type="{template_type}">\n'.format(
            template_type=TemplateType.HTML)
        document += '<name><![CDATA[{name}]]></name>\n'.format(
            name=text["name"])
        document += '<subject><![CDATA[{subject}]]></subject>\n'.format(
            subject=text["subject"])
        document += '<body><![CDATA[{body}]]></body>\n'.format(
            body=text["body"])
        document += '</text>\n'
    document += '</texts>\n'
    document += '</menu>\n'
    document += '</quicktext>\n'
    return document


def parse_template(filepath):
    frontmatter = {}
    with open(filepath, "r") as file:
        lines = file.readlines()
    for line in lines:
        matches = re.match("^[ ]*\*{1}[ ]*([a-z]*):[ ]*(.*)", line)
        if matches:
            key = matches[1]
            value = matches[2].strip()
            frontmatter[key] = value
        elif re.match("^[ ]*\*/[ ]*$", line) is not None:
            break
    text_name = frontmatter["name"]
    text_subject = frontmatter["subject"]
    with open(filepath, "r") as file:
        script_body = file.read()
    return text_name, text_subject, script_body


def remove_whitespace(script):
    """Rmeove all whitespace and newlines."""
    for i in range(10):
        script = script.replace("  ", " ")
    script = re.sub("\n", "", script)
    script = re.sub("\r", "", script)
    return script


def snakecase(value):
    return value.lower().replace(" ", "_")


if __name__ == "__main__":
    main()
