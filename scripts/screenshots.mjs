import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../../docs/screenshots");
fs.mkdirSync(outDir, { recursive: true });

const BASE_URL = "http://localhost:5173";
const VIEWPORTS = [
  { name: "desktop-1440px", width: 1440, height: 900 },
  { name: "tablet-768px", width: 768, height: 1024 },
  { name: "mobile-390px", width: 390, height: 844 },
];

const PAGES = [
  { name: "overview", path: "/", waitFor: ".spending-pace, [data-testid='overview'], main", delay: 2000 },
  { name: "transactions", path: "/transactions", waitFor: "table, [data-testid='transaction-list'], main", delay: 2000 },
  { name: "budgets", path: "/budgets", waitFor: "main", delay: 2000 },
  { name: "reports", path: "/reports", waitFor: "main", delay: 2000 },
  { name: "accounts", path: "/accounts", waitFor: "main", delay: 2000 },
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const pg of PAGES) {
      const url = `${BASE_URL}${pg.path}`;
      console.log(`  Navigating to ${url}...`);
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
        await sleep(pg.delay);

        // scroll to load any lazy content
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(300);

        const filename = `${pg.name}-${vp.name}.png`;
        const filepath = path.join(outDir, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`  ✓ Saved: ${filename}`);
      } catch (err) {
        console.error(`  ✗ Failed ${pg.name} @ ${vp.name}:`, err.message);
      }
    }

    // Also capture the Add Transaction drawer open
    try {
      await page.goto(`${BASE_URL}/transactions`, { waitUntil: "networkidle0", timeout: 15000 });
      await sleep(1500);
      // Try to click the Add transaction button
      const addBtn = await page.$("button");
      const buttons = await page.$$("button");
      for (const btn of buttons) {
        const text = await btn.evaluate((el) => el.textContent?.trim() ?? "");
        if (text.toLowerCase().includes("add") || text.toLowerCase().includes("transaction") || text.includes("+")) {
          await btn.click();
          await sleep(1000);
          break;
        }
      }
      const filename = `drawer-${vp.name}.png`;
      await page.screenshot({ path: path.join(outDir, filename), fullPage: true });
      console.log(`  ✓ Saved: ${filename}`);
    } catch (err) {
      console.error(`  ✗ Drawer screenshot failed @ ${vp.name}:`, err.message);
    }

    await page.close();
  }

  await browser.close();
  console.log("\n✅ All screenshots saved to docs/screenshots/");
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
