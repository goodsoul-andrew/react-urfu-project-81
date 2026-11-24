import type { Rename } from "./Rename.js";
import Tag from "./Tag.js";

type LabelHtml = Record<string, string>;

type FieldOptions = {
    as?: "input" | "textarea";
    label?: string;
    labelHtml?: LabelHtml;
    [key: string]: string | number | boolean | LabelHtml | undefined;
};

type FieldConfig = {
    name: string;
    options: FieldOptions;
};

type FormTemplate = Record<string, string | number | boolean>;

class FormBuilder {
    private fields = new Map<string, FieldConfig>();
    private _hasSubmit = false;

    constructor(private template: FormTemplate) {}

    input(name: string, options: FieldOptions = {}) {
        if (!(name in this.template)) {
            throw new Error(`Field '${name}' does not exist in the template.`);
        }
        this.fields.set(name, { name, options });
    }

    submit(value: string = "Save") {
        this.fields.set("submit", { name: "submit", options: { type: "submit", value } });
        this._hasSubmit = true;
    }

    hasSubmit() {
        return this._hasSubmit;
    }

    getField(name: string) {
        return this.fields.get(name);
    }
}

type FormForParams = {
    url?: string;
    method?: "post" | "put" | "delete" | "get";
};

type FormParams = Rename<FormForParams, "url", "action">;

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateLabel(key: string, config?: FieldConfig): Tag {
    const options = config?.options ?? {};
    const text = (options.label as string | undefined) ?? capitalize(key);
    const htmlAttrs = (options.labelHtml as LabelHtml | undefined) ?? {};
    return new Tag("label", { for: key, ...htmlAttrs }, text);
}

function cleanOptions(config?: FieldConfig): Record<string, string | number | boolean> {
    const source = { ...(config?.options ?? {}) };
    delete source.as;
    delete source.label;
    delete source.labelHtml;
    const result: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(source)) {
        if (v !== undefined) {
            result[k] = v as string | number | boolean;
        }
    }
    return result;
}

function generateInput(key: string, value: string | number | boolean, config?: FieldConfig): Tag {
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

export default function formFor(
    template: FormTemplate,
    settings: FormForParams,
    f?: (builder: FormBuilder) => void,
): string {
    const builder = new FormBuilder(template);
    f?.(builder);

    const { url, ...rest } = settings;
    const params: FormParams = {
        method: rest.method ?? "post",
        action: url ?? "#",
    };

    const inputs = Object.entries(template).filter(el => builder.getField(el[0])).flatMap(([key, value]) => [
        generateLabel(key, builder.getField(key)),
        generateInput(key, value, builder.getField(key)),
    ]);

    if (builder.hasSubmit()) {
        const submitConfig = builder.getField("submit");
        const submitValue = (submitConfig?.options.value as string | undefined) ?? "Save";
        inputs.push(new Tag("input", { type: "submit", value: submitValue }));
    }

    return new Tag("form", params as unknown as Record<string, string>, inputs).toString();
}