// Confirms that the production site serves the build of the current commit.
//
// Usage: node scripts/check-production.mjs <site-url> <path-to-local-dist/index.html>
//
// Vite gives every entry file a content hash (assets/index-<hash>.js), so a
// locally built index.html names exactly the files the deployed one must name.
// The script repeats one complete check (page names those files, every file
// answers, security headers present) until it passes or the time limit ends.
// Each request has its own timeout, so a hung or reset connection becomes a
// retry, not a crash. A commit that does not change the build (for example
// docs only) passes as soon as the site serves the unchanged build.
import { readFile } from "node:fs/promises";

const [siteArg, indexPath] = process.argv.slice(2);
if (!siteArg || !indexPath) {
  console.error("Usage: node scripts/check-production.mjs <site-url> <dist/index.html>");
  process.exit(2);
}
const site = siteArg.replace(/\/+$/, "");
const timeoutSeconds = Number(process.env.CHECK_TIMEOUT_SECONDS ?? 600);
const intervalSeconds = Number(process.env.CHECK_INTERVAL_SECONDS ?? 20);
const requestSeconds = Number(process.env.CHECK_REQUEST_SECONDS ?? 15);

const assetPattern = /(?:src|href)="\.?\/?(assets\/[^"]+)"/g;
const assetsIn = (html) => [...html.matchAll(assetPattern)].map((match) => match[1]);

const expected = assetsIn(await readFile(indexPath, "utf8"));
if (expected.length === 0) {
  console.error(`No hashed assets found in ${indexPath}; build output looks wrong.`);
  process.exit(1);
}
console.log(`Expecting ${site}/ to serve: ${expected.join(", ")}`);

const get = (url) =>
  fetch(url, { cache: "no-store", signal: AbortSignal.timeout(requestSeconds * 1000) });

// One complete check. Returns null when everything passes, otherwise what was wrong.
async function attempt() {
  const home = await get(`${site}/`);
  if (!home.ok) return `page answered HTTP ${home.status}`;
  const served = assetsIn(await home.text());
  if (!expected.every((asset) => served.includes(asset)))
    return `not published yet (page names: ${served.join(", ") || "no hashed assets"})`;
  const problems = [];
  if (!home.headers.get("strict-transport-security")) problems.push("missing HSTS header");
  if (!home.headers.get("x-content-type-options")) problems.push("missing nosniff header");
  for (const asset of expected) {
    const response = await get(`${site}/${asset}`);
    await response.arrayBuffer();
    if (!response.ok) problems.push(`${asset}: HTTP ${response.status}`);
  }
  return problems.length ? `published, but ${problems.join("; ")}` : null;
}

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
const deadline = Date.now() + timeoutSeconds * 1000;
while (true) {
  let problem;
  try {
    problem = await attempt();
  } catch (error) {
    problem = `request error: ${error.cause?.code ?? error.name ?? "unknown"} (${error.message})`;
  }
  if (problem === null) break;
  if (Date.now() >= deadline) {
    console.error(
      `Production check failed within ${timeoutSeconds}s. Last result: ${problem}. ` +
        `Check the latest deploy in Netlify.`,
    );
    process.exit(1);
  }
  console.log(`${problem}; retrying in ${intervalSeconds}s.`);
  await sleep(intervalSeconds);
}
console.log(`Production serves this commit's build and all ${expected.length} entry assets.`);
