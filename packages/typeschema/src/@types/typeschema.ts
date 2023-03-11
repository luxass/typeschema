import type ts from "typescript";

export interface TypeSchemaConfig {
  plugins?: TypeSchemaPlugin[];
  tsconfig?: string | ts.CompilerOptions;
  entry: string[];
}

export type HookParameters<
  Hook extends keyof TypeSchemaPlugin["hooks"],
  Fn = TypeSchemaPlugin["hooks"][Hook]
> = Fn extends (...args: any) => any ? Parameters<Fn>[0] : never;

export interface TypeSchemaPlugin {
  name: string;
  hooks: {
    config?: (ctx: {
      config: TypeSchemaConfig;
      mode: "dev" | "build";
    }) => void | Promise<void>;
    ast?: (ctx: {}) => void | Promise<void>;
    transform?: (ctx: {}) => void | Promise<void>;
  };
}

export interface TypeSchemaContext {
  config: TypeSchemaConfig;
  hooks: PluginHook;
}

export interface PluginHook {
  call: <Hook extends keyof TypeSchemaPlugin["hooks"]>(
    hook: Hook,
    params: HookParameters<Hook>
  ) => Promise<void>;
}
