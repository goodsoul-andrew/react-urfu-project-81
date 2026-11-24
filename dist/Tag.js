class Tag {
    constructor(tagName, props, content) {
        this.content = null;
        this.tagName = tagName;
        this.props = props;
        if (!this.isSingular() && content) {
            this.content = content;
        }
    }
    isSingular() {
        return Tag.silngularTags.has(this.tagName);
    }
    toString(tabLevel = 0) {
        const tab = (tabLevel > 0) ? "\n" + "  ".repeat(tabLevel) : "";
        const endTab = (tabLevel > 0) ? "  ".repeat(tabLevel - 1) : "";
        let propString = (Object.keys(this.props).length > 0 ? " " : "") + Object.keys(this.props).map((key) => `${key}="${this.props[key]}"`).join(" ");
        if (this.isSingular())
            return `${tab}<${this.tagName}${propString}/>`;
        if (typeof this.content === 'string' || this.content === null) {
            return `${tab}<${this.tagName}${propString}>${this.content ?? ''}</${this.tagName}>`;
        }
        else {
            let contentString = this.content.map(el => el.toString(tabLevel)).join("");
            return `${tab}<${this.tagName}${propString}>${contentString}\n${endTab}</${this.tagName}>`;
        }
    }
}
Tag.silngularTags = new Set(["img", "input", "br"]);
export default Tag;
