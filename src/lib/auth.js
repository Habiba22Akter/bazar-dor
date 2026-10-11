import "server-only";

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.BETTER_AUTH_DB_URL;

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URL সেট করুন।");
}

const client =
  globalThis.bazarMongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalThis.bazarMongoClient = client;
}

const socialProviders = {};

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(client.db(), {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  socialProviders,

  onAPIError: {
    errorURL: "/sign-in",
  },
});













// import "server-only";

// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";

// const uri = process.env.BETTER_AUTH_DB_URL;

// if (!uri) {
//   throw new Error("BETTER_AUTH_DB_URL সেট করুন।");
// }

// const client =
//   globalThis.bazarMongoClient || new MongoClient(uri);

// if (process.env.NODE_ENV !== "production") {
//   globalThis.bazarMongoClient = client;
// }

// const socialProviders = {};

// if (
//   process.env.GOOGLE_CLIENT_ID &&
//   process.env.GOOGLE_CLIENT_SECRET
// ) {
//   socialProviders.google = {
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   };
// }

// if (
//   process.env.GITHUB_CLIENT_ID &&
//   process.env.GITHUB_CLIENT_SECRET
// ) {
//   socialProviders.github = {
//     clientId: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   };
// }

// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL,
//   secret: process.env.BETTER_AUTH_SECRET,

//   database: mongodbAdapter(client.db(), {
//     client,
//   }),

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: false,
//     requireEmailVerification: false,
//     minPasswordLength: 8,
//     maxPasswordLength: 128,
//   },

//   socialProviders,

//   onAPIError: {
//     errorURL: "/sign-in",
//   },
// });