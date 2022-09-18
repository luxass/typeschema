import { ZoteraAuth } from './auth';
import { ZoteraStorage } from './storage';
import { ZoteraConfig } from './types';

export { ZoteraAuth, ZoteraStorage };

export interface PluginContext<T extends object> {
  log: ZoteraLoggingContext;
  auth: ZoteraAuthContext;
  storage: ZoteraStorageContext;
  routing: ZoteraRoutingContext;
  config: ZoteraConfig;
  options: T;
}

export interface ZoteraLoggingContext {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

export interface ZoteraStorageContext {
  register(id: string, storage: ZoteraStorage): void;
}

export interface ZoteraAuthContext {
  register(id: string, auth: ZoteraAuth): void;
}

// TODO: Add types to this because types <3
type Handler = (req: any, res: any) => void | Promise<void>;

export interface ZoteraRoutingContext {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  put(path: string, handler: Handler): void;
  delete(path: string, handler: Handler): void;
}
