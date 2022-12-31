import type { PluginContext, TypeSchemaPlugin } from "@typeschema/types";

export class PluginContainer {
  readonly plugins: TypeSchemaPlugin[] = [];
  context?: PluginContext;

  constructor(plugins: TypeSchemaPlugin[]) {
    this.plugins = plugins;
  }

  setContext(context: PluginContext) {
    this.context = context;
  }

  getContext() {
    if (!this.context) throw new Error("Plugin context is not set");
    return this.context;
  }

  async initialize() {
    for (const plugin of this.plugins) {
      await plugin.setup.call(this, this.getContext());
    }
  }
}
