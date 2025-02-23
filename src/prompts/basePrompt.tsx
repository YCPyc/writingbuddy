export class PromptTemplate {
  name: string;
  version: string;
  template: string;

  constructor(name: string, version: string, template: string) {
    this.name = name;
    this.version = version;
    this.template = template;
  }

  format(params: { [key: string]: string }): string {
    return this.template.replace(/{(\w+)}/g, (_, key) => params[key] || "");
  }
}
