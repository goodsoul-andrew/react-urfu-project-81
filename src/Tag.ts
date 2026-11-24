class Tag {
    static readonly silngularTags = new Set<string>(["img", "input", "br"])
    public readonly tagName: string
    public readonly props: object
    public readonly content: string | Tag[] | null = null;

    constructor (tagName: string, props: object, content?: string | Tag[]) {
        this.tagName = tagName;
        this.props = props;
        if (! this.isSingular() && content) {
            this.content = content;
        }
    }

    isSingular() {
        return Tag.silngularTags.has(this.tagName);
    }

    toString(tabLevel: number = 0): string {
        const tab = (tabLevel > 0) ? "\n" + "  ".repeat(tabLevel) : "";
        const endTab = (tabLevel > 0) ? "  ".repeat(tabLevel - 1) : "";
        let propString = (Object.keys(this.props).length > 0 ? " " : "") + Object.keys(this.props).map((key) => `${key}="${this.props[key as keyof typeof this.props]}"`).join(" ")
        if (this.isSingular()) return `${tab}<${this.tagName}${propString}/>`
        if (typeof this.content === 'string' || this.content === null) {
            return `${tab}<${this.tagName}${propString}>${this.content ?? ''}</${this.tagName}>`
        } else{
            let contentString = (this.content as Tag[]).map(el => el.toString(tabLevel)).join("")
            return `${tab}<${this.tagName}${propString}>${contentString}\n${endTab}</${this.tagName}>`
        }
    }
}

export default Tag;