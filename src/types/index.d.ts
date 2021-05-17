export interface Changes {
  originTemplateReplacement: string;
  files: FileChange[];
}

export interface FileChange {
  path: string;
  content: string;
}

export interface Config {
  defaultPrefix: string;
}
