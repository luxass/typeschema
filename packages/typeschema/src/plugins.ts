import type { TypeSchemaPlugin } from "../plugin";
import type { PluginHook } from "./@types/typeschema";

export function createHooks(plugins?: readonly TypeSchemaPlugin[]): PluginHook {
  const pluginMap = new Map<string, TypeSchemaPlugin>();

  for (const plugin of plugins || []) {
    if (pluginMap.has(plugin.name)) {
      throw new TypeError(`Duplicate plugin name: ${plugin.name}`);
    }
    pluginMap.set(plugin.name, plugin);
  }

  return {
    call: async (hook, params) => {
      for (const plugin of pluginMap.values()) {
        if (plugin.hooks[hook]) {
          await plugin.hooks[hook](params);
        }
      }
    }
  };
}
