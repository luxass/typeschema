import { SyntaxKind } from 'typescript';

import { PluginContext } from './api';

export * from './storage';
export * from './auth';
export * from './manifest';

export interface TT {
  ll: string;
}

export interface TTPlugin {
  [key: string]: any;
}

export type GG = {
  [key: string]: any;
}

export interface LL extends TT {
  aa: string;
}

export interface AA extends {
  [key: string]: any;
}

/**
 * Zotera Configuration Object
 * @typeschema
 */
export interface ZoteraConfig {
  /**
   * The path where the configuration file is located.
   * @internal
   */
  __location: string;

  /**
   * Logging options
   */
  logging?: ZoteraLoggingConfig;

  /**
   * The directory to store plugins in.
   */
  pluginDir: string;

  /**
   * Zotera plugins to load.
   */
  plugins?: ZoteraPluginsConfig;

  /**
   * HTTPS options
   */
  https?: ZoteraHttpsConfig;

  /**
   * Authentication options
   */
  auth?: ZoteraAuthConfig;

  /**
   * Web options
   */
  web?: ZoteraWebConfig;

  /**
   * Id of the storage, that got registered
   */
  storage?: ZoteraStorageConfig;
}

export interface ZoteraHttpsConfig {
  key?: string;
  cert?: string;
  ca?: string;
}

export interface ZoteraPlugin {
  register(ctx: PluginContext<any>): void | Promise<void>;
  options?: any;
}

export type ZoteraPluginsConfig = (string | ZoteraPluginWithOptions)[];
export interface ZoteraPluginWithOptions {
  [key: string]: any;
}

export interface ZoteraLoggingConfig {
  /**
   * Output type
   * @default 'stdout'
   */
  type: 'stdout' | 'file';

  /**
   * The path to the log file.
   * Only used when `type` is `file`.
   * @default 'zotera.log'
   */
  destination?: string;

  /**
   * The minimum level of log messages to output.
   * @default 'info'
   */
  level: LogLevel;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'trace';

export interface ZoteraAuthConfig {
  /**
   * Should everyone be allowed to download extensions.
   * @default false
   */
  allowAnonymousDownload?: boolean;

  /**
   * Allow users to register.
   * @default true
   */
  allowRegistration?: boolean;

  /**
   * Auth provider to use.
   * These are registered through `auth.register()`.
   */
  provider?: string;

  /**
   * Algorithm to use for hashing passwords.
   */
  algorithm?: HTPasswdAlgorithms;

  /**
   * Location of the htpasswd file.
   * Only used if provider is not set or set to `htpasswd`.
   */
  location?: string;

  groups?: ZoteraAuthGroups;
}

export interface ZoteraAuthGroups {}

export interface ZoteraStorageConfig {
  provider?: string;
  location?: string;
}
export interface WebFooterOptions {
  message?: string;
  copyright?: string;
}

export interface ZoteraWebConfig {
  title?: string;
  logo?: string;
  footer?: WebFooterOptions;
}

export type OmitSafe<T extends object, K extends keyof T> = Omit<T, K>;
// export type NodeOptions = OmitSafe<ZoteraConfig, 'logging' | 'pluginDir' | '__location'>;
export type HTPasswdAlgorithms = 'sha256' | 'sha512' | 'bcrypt';

interface LA {
  bb: LB;
}

interface LB {
  cc: LA;
}

enum Test {
  A = 'V',
  B = 'D'
}

enum Test2 {
  A,
  B,
  C
}

// /**
//  * @native-enum alsdjkas
//  */
// enum Test3 {
//   A,
//   B,
//   C
// }

/**
 * @native-enum alsdjkas
 */
enum Test4 {
  A = 'V',
  B = 'D',
  C = 'A'
}

type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];

enum Test5 {
  A = 0,
  B = 1,
  C = 2
}



interface Haha {
  test: Test;
  test2: SyntaxKind;
}
