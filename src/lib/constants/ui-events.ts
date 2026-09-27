/**
 * Window-level custom events used to talk to a singleton overlay that is
 * mounted once in `RoleLandingPage` — a trigger anywhere in the tree can open
 * it without threading state through the chrome.
 */
export const COMMAND_PALETTE_EVENT = 'app:command-palette';
