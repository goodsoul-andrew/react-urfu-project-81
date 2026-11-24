import type { Rename } from "./Rename.js";
import Tag from "./Tag.js";

type FieldOptions = {
    as?: "input" | "textarea";
    [key: string]: string | number | boolean | undefined
};

type FieldConfig = {
    name: string;
    options: FieldOptions;
};

type FormTemplate = Record<string, string | number | boolean>;

class FormBuilder {
    private fields = new Map<string, FieldConfig>();
    private _hasSubmit: boolean = false;

    constructor (private template: FormTemplate) {}

    input (name: string, options: FieldOptions = {}) {
        if (!(name in this.template)) {
            throw new Error(`Field '${name}' does not exist in the template.`);
        }
        this.fields.set(name, { name, options });
    }

    submit (value: string = "Save") {
        this.fields.set("submit", {name: "submit", options: {type: "submit", value: value, }})
        this._hasSubmit = true;
    }

    hasSubmit(): boolean {
        return this._hasSubmit;
    }

    getField(name: string): FieldConfig | undefined {
        return this.fields.get(name);
    }
}


type FormForParams = {
    url?: string;
    method?: "post" | "put" | "delete" | "get";
};

type FormParams = Rename<FormForParams, "url", "action">;

function generateLabel(key: string): Tag {
    return new Tag("label", { for: `${key}-input` }, key);
}

function generateInput(key: string, value: string | number | boolean, config?: FieldConfig): Tag {
    const cleanedOptions = { ...config?.options };
    delete cleanedOptions.as;
    if (config?.options.as === "textarea") {
        return new Tag("textarea", { id: `${key}-input`, name: key, cols: 20, rows: 40, ...cleanedOptions }, String(value));
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

export default function form(template: FormTemplate, settings: FormForParams, f?: (builder: FormBuilder) => void): string {
    const builder = new FormBuilder(template);
    f?.(builder);

    const { url, ...rest } = settings;
    const params: FormParams = {
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
        inputs.push(new Tag("input", { id:`${submitConfig?.name ?? "submit"}-button`, ...(submitConfig?.options ?? {}),}));
    }

    return new Tag(
        "form",
        params as unknown as Record<string, string>,
        inputs
    ).toString();
}
