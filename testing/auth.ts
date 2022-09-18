export interface ZoteraAuth {
  /**
   * Initialize the auth plugin
   */
  initialize(): Promise<void>;

  /**
   * Login a user.
   * @param {string} username username
   * @param {string} password password
   * @returns {Promise<string | null>} username or null if login failed.
   */
  login(username: string, password: string): Promise<string | null>;

  /**
   * Registers a user
   * @param {string} username username
   * @param {string} password password
   */
  register?(username: string, password: string): Promise<void>;
  publish(): Promise<void>;
  unpublish(): Promise<void>;
  access?(): Promise<void>;
}
