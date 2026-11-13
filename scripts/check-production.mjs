// Confirms that the production site is serving the application correctly.
//
// Usage: node scripts/check-production.mjs <site-url>
//
// One check is: the page answers, it names at least one hashed asset, every
// asset it names answers, and the HSTS and nosniff headers are present. The
// check repeats until it passes or the time limit ends. Each request has its own
// timeout, so a hung or reset connection becomes a retry, not a crash.
//
// WHAT THIS NO LONGER PROVES: that the newest commit is live. Until 2026-11-13
// the script also built the commit in CI and required the live page to name
// exactly the hashed entry files that build produced, which did prove the deploy
// of that commit had landed. That comparison only holds while the CI build is
// byte-identical to Netlify's, and it is not: VITE_PUBLIC_POSTHOG_KEY is a build
// variable in the Netlify project only, Vite inlines its value into the entry
// chunk, and the two builds therefore hash differently (CI
// assets/index-BeYB5eFB.js against the served assets/index-cZbaOk1F.js). The
// check was red on every push to main while the site was healthy.
//
// So a failed or stuck Netlify deploy that leaves the previous build serving
// correctly now passes here, and only Netlify's own deploy log shows it. What
// still fails: the site not answering, a page that names no hashed assets or
// names one that does not resolve (a half-published or broken deploy), and a
// missing security header. Restoring the old guarantee means giving CI the same
// key, as a GitHub Actions secret passed to the build step; only the repository
// owner can add it. See docs/tasks/production-check-false-alarm.md.
const [siteArg] = process.argv.slice(2);
if (!siteArg) {
  console.error("Usage: node scripts/check-production.mjs <site-url>");
  process.exit(2);
}
const site = siteArg.replace(/\/+$/, "");
const timeoutSeconds = Number(process.env.CHECK_TIMEOUT_SECONDS ?? 120);
const intervalSeconds = Number(process.env.CHECK_INTERVAL_SECONDS ?? 20);
const requestSeconds = Number(process.env.CHECK_REQUEST_SECONDS ?? 15);

const assetPattern = /(?:src|href)="\.?\/?(assets\/[^"]+)"/g;
const assetsIn = (html) => [...new Set([...html.matchAll(assetPattern)].map((match) => match[1]))];

console.log(
  `Checking that ${site}/ answers, resolves every hashed asset it names ` +
    `and sends the security headers.`,
);

const get = (url) =>
  fetch(url, { cache: "no-store", signal: AbortSignal.timeout(requestSeconds * 1000) });

// One complete check. Returns null when everything passes, otherwise what was wrong.
// On success `served` holds the assets that were checked, for the final message.
let served = [];
async function attempt() {
  const home = await get(`${site}/`);
  if (!home.ok) return `page answered HTTP ${home.status}`;
  const assets = assetsIn(await home.text());
  if (assets.length === 0) return "page names no hashed assets, so it is not this application";
  const problems = [];
  if (!home.headers.get("strict-transport-security")) problems.push("missing HSTS header");
  if (!home.headers.get("x-content-type-options")) problems.push("missing nosniff header");
  for (const asset of assets) {
    const response = await get(`${site}/${asset}`);
    await response.arrayBuffer();
    if (!response.ok) problems.push(`${asset}: HTTP ${response.status}`);
  }
  if (problems.length) return problems.join("; ");
  served = assets;
  return null;
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
console.log(
  `Production is healthy: ${site}/ answers with both security headers ` +
    `and serves ${served.join(", ")}.`,
);
