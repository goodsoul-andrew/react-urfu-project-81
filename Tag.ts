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

    toString(): string {
        let propString = Object.keys(this.props).map((key) => `${key}="${this.props[key as keyof typeof this.props]}"`).join(" ")
        if (this.isSingular()) return `<${this.tagName}  ${propString}/>`
        if (this.content instanceof String || this.content === null) {
            return `<${this.tagName} ${propString}>${this.content}</${this.tagName}>`
        } else{
            let contentString = (this.content as Tag[]).map(el => el.toString()).join("")
            return `<${this.tagName} ${propString}>${contentString}</${this.tagName}>`
        }
    }
}

export default Tag;