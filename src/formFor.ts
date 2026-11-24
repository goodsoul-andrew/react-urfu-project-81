import type { Rename } from "./Rename.js";
import Tag from "./Tag.js";

type FieldOptions = {
    as?: "input" | "textarea";
    [key: string]: string | number | boolean
};

type FieldConfig = {
    name: string;
    options: FieldOptions;
};

type FormTemplate = Record<string, string | number | boolean>;

class FormBuilder {
    private fields = new Map<string, FieldConfig>();

    constructor(private template: FormTemplate) {}

    input(name: string, options: FieldOptions = {}) {
        if (!(name in this.template)) {
            throw new Error(`Field '${name}' does not exist in the template.`);
        }
        this.fields.set(name, { name, options });
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

function generateInput(key: string, value: string | number | boolean, config?: FieldConfig): Tag {
    const cleanedOptions = {...config?.options};
    delete cleanedOptions?.as;
    if (config?.options.as === "textarea") {
        return new Tag("textarea", { name: key, ...cleanedOptions }, String(value));
    }
    switch (typeof value) {
        case "number":
            return new Tag("input", { name: key, type: "number", value: String(value), ...cleanedOptions });
        case "boolean":
            return new Tag("input", { name: key, type: "checkbox", value: "true", ...cleanedOptions });
        case "string":
            return new Tag("input", { name: key, type: "text", value, ...cleanedOptions });
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

    const inputs = Object.entries(template).map(([key, value]) => generateInput(key, value, builder.getField(key)) );

    return new Tag(
        "form",
        params as unknown as Record<string, string>,
        inputs
    ).toString();
}
