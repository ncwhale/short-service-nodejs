import server  from "./index.js";

export async function mochaGlobalSetup() {
}

export async function mochaGlobalTeardown() {
  await server.close();
}