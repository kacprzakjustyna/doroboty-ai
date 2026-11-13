// Confirms that the production site serves the build of the current commit.
//
// Usage: node scripts/check-production.mjs <site-url> <path-to-local-dist/index.html>
//
// Vite gives every entry file a content hash (assets/index-<hash>.js), so a
// locally built index.html names exactly the files the deployed one must name.
// The script polls the site until those names appear, then checks that each
// asset answers. It exits non-zero on timeout or error, which fails the
// workflow and makes GitHub notify the person who pushed.
import { readFile } from "node:fs/promises";

const [siteArg, indexPath] = process.argv.slice(2);
if (!siteArg || !indexPath) {
  console.error("Usage: node scripts/check-production.mjs <site-url> <dist/index.html>");
  process.exit(2);
}
const site = siteArg.replace(/\/+$/, "");
const timeoutSeconds = Number(process.env.CHECK_TIMEOUT_SECONDS ?? 600);
const intervalSeconds = Number(process.env.CHECK_INTERVAL_SECONDS ?? 20);

const assetPattern = /(?:src|href)="\.?\/?(assets\/[^"]+)"/g;
const assetsIn = (html) => [...html.matchAll(assetPattern)].map((match) => match[1]);

const expected = assetsIn(await readFile(indexPath, "utf8"));
if (expected.length === 0) {
  console.error(`No hashed assets found in ${indexPath}; build output looks wrong.`);
  process.exit(1);
}
console.log(`Expecting ${site}/ to serve: ${expected.join(", ")}`);

const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
const deadline = Date.now() + timeoutSeconds * 1000;
let lastSeen = "nothing yet";

while (true) {
  try {
    const response = await fetch(`${site}/`, { cache: "no-store" });
    if (response.ok) {
      const served = assetsIn(await response.text());
      if (expected.every((asset) => served.includes(asset))) break;
      lastSeen = served.join(", ") || "a page without hashed assets";
    } else {
      lastSeen = `HTTP ${response.status}`;
    }
  } catch (error) {
    lastSeen = `request error: ${error.message}`;
  }
  if (Date.now() >= deadline) {
    console.error(
      `The site did not serve this commit's build within ${timeoutSeconds}s. ` +
        `Last seen: ${lastSeen}. Check the latest deploy in Netlify.`,
    );
    process.exit(1);
  }
  console.log(`Not published yet (seen: ${lastSeen}); retrying in ${intervalSeconds}s.`);
  await sleep(intervalSeconds);
}

const failures = [];
for (const asset of expected) {
  const response = await fetch(`${site}/${asset}`, { cache: "no-store" });
  if (!response.ok) failures.push(`${asset}: HTTP ${response.status}`);
}
const home = await fetch(`${site}/`, { cache: "no-store" });
if (!home.headers.get("strict-transport-security")) failures.push("missing HSTS header");
if (!home.headers.get("x-content-type-options")) failures.push("missing nosniff header");

if (failures.length > 0) {
  console.error(`Published, but checks failed: ${failures.join("; ")}`);
  process.exit(1);
}
console.log(`Production serves this commit's build and all ${expected.length} entry assets.`);
