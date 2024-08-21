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
  "/auth",
  "/auth/signin",
  "/auth/signup",
]


export const restrictedRoutes = [
  "/admin",
  "/police",
  "/detective"
]

/**
 * The prefix for the auth api
 * @type {string}
 */

export const apiAuthPrefix = "/api/v1/users/citizens"

export const DEFAULT_LOGIN_REDIRECT = "/"