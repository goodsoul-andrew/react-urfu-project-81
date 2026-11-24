import Tag from "./Tag.js";
class FormBuilder {
    constructor(template) {
        this.template = template;
        this.fields = new Map();
        this._hasSubmit = false;
    }
    input(name, options = {}) {
        if (!(name in this.template)) {
            throw new Error(`Field '${name}' does not exist in the template.`);
        }
        this.fields.set(name, { name, options });
    }
    submit(value = "Save") {
        this.fields.set("submit", { name: "submit", options: { type: "submit", value } });
        this._hasSubmit = true;
    }
    hasSubmit() {
        return this._hasSubmit;
    }
    getField(name) {
        return this.fields.get(name);
    }
}
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function generateLabel(key, config) {
    const options = config?.options ?? {};
    const text = options.label ?? capitalize(key);
    const htmlAttrs = options.labelHtml ?? {};
    return new Tag("label", { for: key, ...htmlAttrs }, text);
}
function cleanOptions(config) {
    const source = { ...(config?.options ?? {}) };
    delete source.as;
    delete source.label;
    delete source.labelHtml;
    const result = {};
    for (const [k, v] of Object.entries(source)) {
        if (v !== undefined) {
            result[k] = v;
        }
    }
    return result;
}
function generateInput(key, value, config) {
    const options = cleanOptions(config);
    if (config?.options.as === "textarea") {
        return new Tag("textarea", { cols: 20, rows: 40, name: key, ...options }, String(value));
    }
    switch (typeof value) {
        case "number":
            return new Tag("input", { name: key, type: "number", value: String(value), ...options });
        case "boolean":
            return new Tag("input", { name: key, type: "checkbox", value: "true", ...options });
        case "string":
            return new Tag("input", { name: key, type: "text", value, ...options });
    }
}
export default function form(template, settings, f) {
    const builder = new FormBuilder(template);
    f?.(builder);
    const { url, ...rest } = settings;
    const params = {
        method: rest.method ?? "post",
        action: url ?? "#",
    };
    const inputs = Object.entries(template).flatMap(([key, value]) => [
        generateLabel(key, builder.getField(key)),
        generateInput(key, value, builder.getField(key)),
    ]);
    if (builder.hasSubmit()) {
        const submitConfig = builder.getField("submit");
        const submitValue = submitConfig?.options.value ?? "Save";
        inputs.push(new Tag("input", { type: "submit", value: submitValue }));
    }
    return new Tag("form", params, inputs).toString();
}
