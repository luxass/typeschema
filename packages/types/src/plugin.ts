import type { TypeSchemaConfig } from "./config";

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
