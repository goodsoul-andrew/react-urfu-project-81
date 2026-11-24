type FieldOptions = {
    as: "input" | "textarea";
    [key: string]: string | number | boolean;
};
type FieldConfig = {
    name: string;
    options: FieldOptions;
};
type FormTemplate = Record<string, string | number | boolean>;
declare class FormBuilder {
    private template;
    private fields;
    private _hasSubmit;
    constructor(template: FormTemplate);
    input(name: string, options?: FieldOptions): void;
    submit(value?: string): void;
    hasSubmit(): boolean;
    getField(name: string): FieldConfig | undefined;
}
type FormForParams = {
    url?: string;
    method?: "post" | "put" | "delete" | "get";
};
export default function form(template: FormTemplate, settings: FormForParams, f?: (builder: FormBuilder) => void): string;
export {};
