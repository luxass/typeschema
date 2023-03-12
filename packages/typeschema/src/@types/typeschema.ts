import type ts from "typescript";

export interface RunFlags {
  watch?: boolean;
  config?: string;
}

export interface InitFlags {
  type?: string;
}

export interface TypeSchemaConfig {
  plugins?: TypeSchemaPlugin[];
  tsconfig?: string | ts.CompilerOptions;
  entry: string[];
}

export type HookParameters<
  Hook extends keyof PluginHooks,
  Fn = PluginHooks[Hook]
> = Fn extends (...args: any) => any ? Parameters<Fn>[0] : never;

export interface TypeSchemaPlugin {
  name: string;
  hooks: PluginHooks;
}

export interface TypeSchemaContext {
  config: TypeSchemaConfig;
  hooks: PluginHook;
}

export interface PluginHooks {
  config?: (ctx: {
    config: TypeSchemaConfig;
    watch: boolean;
  }) => void | Promise<void>;
  ast?: (ctx: { config: TypeSchemaConfig; ast: {} }) => void | Promise<void>;
  transform?: (ctx: {
    config: TypeSchemaConfig;
    transformers: {};
  }) => void | Promise<void>;

  // TODO: Add more hooks
  // e.g api like rollup has.
}

export interface PluginHook {
  call: <Hook extends keyof PluginHooks>(
    hook: Hook,
    params: HookParameters<Hook>
  ) => Promise<void>;
}
