/**
 * An array of routes that are public
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
];

/**
 * An array of routes that are protected
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
]

/**
 * The prefix for the auth api
 * @type {string}
 */
export const apiAuthPrefix = "/api/v1/users/citizens"

export const DEFAULT_LOGIN_REDIRECT = "/"
