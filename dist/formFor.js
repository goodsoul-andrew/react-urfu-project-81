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
        this.fields.set("submit", { name: "submit", options: { type: "submit", value: value, } });
        this._hasSubmit = true;
    }
    hasSubmit() {
        return this._hasSubmit;
    }
    getField(name) {
        return this.fields.get(name);
    }
}
function generateLabel(key) {
    return new Tag("label", { for: `${key}-input` }, key);
}
function generateInput(key, value, config) {
    const cleanedOptions = { ...config?.options };
    delete cleanedOptions.as;
    if (config?.options.as === "textarea") {
        return new Tag("textarea", { id: `${key}-input`, name: key, ...cleanedOptions }, String(value));
    }
    switch (typeof value) {
        case "number":
            return new Tag("input", { id: `${key}-input`, name: key, type: "number", value: String(value), ...cleanedOptions });
        case "boolean":
            return new Tag("input", { id: `${key}-input`, name: key, type: "checkbox", value: "true", ...cleanedOptions });
        case "string":
            return new Tag("input", { id: `${key}-input`, name: key, type: "text", value, ...cleanedOptions });
    }
}
export default function form(template, settings, f) {
    const builder = new FormBuilder(template);
    f?.(builder);
    const { url, ...rest } = settings;
    const params = {
        ...rest,
        action: url ?? "#",
        method: rest.method ?? "post",
    };
    const inputs = Object.entries(template).flatMap(([key, value]) => [
        generateLabel(key),
        generateInput(key, value, builder.getField(key)),
    ]);
    if (builder.hasSubmit()) {
        const submitConfig = builder.getField("submit");
        inputs.push(new Tag("input", { id: `${submitConfig?.name ?? "submit"}-button`, ...(submitConfig?.options ?? {}), }));
    }
    return new Tag("form", params, inputs).toString();
}
