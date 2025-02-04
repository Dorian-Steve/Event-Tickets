/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as constant from "../constant.js";
import type * as event from "../event.js";
import type * as storage from "../storage.js";
import type * as tickets from "../tickets.js";
import type * as user from "../user.js";
import type * as waitingList from "../waitingList.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  constant: typeof constant;
  event: typeof event;
  storage: typeof storage;
  tickets: typeof tickets;
  user: typeof user;
  waitingList: typeof waitingList;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
