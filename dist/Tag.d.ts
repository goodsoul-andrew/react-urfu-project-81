declare class Tag {
    static readonly singularTags: Set<string>;
    readonly tagName: string;
    readonly props: object;
    readonly content: string | Tag[] | null;
    constructor(tagName: string, props: object, content?: string | Tag[]);
    isSingular(): boolean;
    toString(tabLevel?: number): string;
}
export default Tag;
