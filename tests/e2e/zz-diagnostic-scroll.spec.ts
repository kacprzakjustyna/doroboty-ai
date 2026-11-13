// TEMPORARY diagnostic for the flaky "offer section links survive copied URLs" test.
// Records every scroll-related call and the document height in the copied tab.
// Remove once the root cause is fixed.
import { test } from "@playwright/test";

for (let run = 0; run < 12; run++) {
  test(`diagnostic copied-tab scroll ${run}`, async ({ page, context }) => {
    await context.addInitScript(() => {
      const log: unknown[] = [];
      (window as unknown as { __scrollLog: unknown[] }).__scrollLog = log;
      const t0 = performance.now();
      const snap = (what: string, extra: Record<string, unknown> = {}) =>
        log.push({
          t: Math.round(performance.now() - t0),
          what,
          y: Math.round(window.scrollY),
          docH: document.documentElement.scrollHeight,
          vh: window.innerHeight,
          emp: document.getElementById("employer")?.getBoundingClientRect().top,
          fonts: document.fonts?.status,
          ...extra,
        });
      const stack = () => (new Error().stack ?? "").split("\n").slice(2, 5).join(" | ");
      const sIV = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (...a) {
        snap("scrollIntoView:before", { id: (this as Element).id, arg: JSON.stringify(a) });
        sIV.apply(this, a as []);
        snap("scrollIntoView:after", { id: (this as Element).id });
      };
      const sTo = window.scrollTo.bind(window);
      window.scrollTo = ((...a: unknown[]) => {
        snap("scrollTo", { arg: JSON.stringify(a), stack: stack() });
        (sTo as (...x: unknown[]) => void)(...a);
      }) as typeof window.scrollTo;
      const focus = HTMLElement.prototype.focus;
      HTMLElement.prototype.focus = function (o?: FocusOptions) {
        snap("focus", { tag: this.tagName, id: this.id, opts: JSON.stringify(o ?? null) });
        focus.call(this, o);
      };
      let last = -1;
      window.addEventListener(
        "scroll",
        () => {
          if (Math.round(window.scrollY) !== last) {
            last = Math.round(window.scrollY);
            snap("scroll-event");
          }
        },
        { passive: true },
      );
      new ResizeObserver(() => snap("resize-doc")).observe(document.documentElement);
      const sizes = new Map<Element, number>();
      const name = (el: Element) =>
        `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${[...el.classList].slice(0, 2).join(".")}`;
      const watch = new ResizeObserver((entries) => {
        for (const e of entries) {
          const h = Math.round(e.target.getBoundingClientRect().height * 100) / 100;
          const before = sizes.get(e.target);
          sizes.set(e.target, h);
          if (before !== undefined && before !== h)
            snap("grew", {
              el: name(e.target),
              from: before,
              to: h,
              faces: [...document.fonts]
                .filter((f) => f.status === "loaded")
                .map((f) => `${f.family}:${f.weight}`)
                .join(","),
            });
        }
      });
      const observeAll = () =>
        document
          .querySelectorAll(
            "header, footer, main, article, nav, section, aside, .pp-offer-grid > *, .pp-offer-grid > * > *, .pp-offer-hero *, img",
          )
          .forEach((el) => {
            if (!sizes.has(el)) {
              sizes.set(el, Math.round(el.getBoundingClientRect().height * 100) / 100);
              watch.observe(el);
            }
          });
      new MutationObserver(observeAll).observe(document, { childList: true, subtree: true });
      document.fonts?.ready.then(() => snap("fonts-ready"));
      window.addEventListener("load", () => snap("load"));
    });
    await page.goto("/#/oferty/ai-product-manager");
    const employer = page.getByRole("link", { name: "O firmie", exact: true });
    const destination = await employer.evaluate((link) => (link as HTMLAnchorElement).href);
    await employer.focus();
    await page.keyboard.press("Enter");
    const copied = await context.newPage();
    await copied.goto(destination);
    await copied.locator("#employer").waitFor();
    await copied.waitForFunction(() => document.activeElement?.id === "employer");
    const y = (await copied.locator("#employer").boundingBox())!.y;
    const log = await copied.evaluate(
      () => (window as unknown as { __scrollLog: unknown[] }).__scrollLog,
    );
    console.log(`DIAG run=${run} final_y=${y.toFixed(2)} ${JSON.stringify(log)}`);
  });
}
