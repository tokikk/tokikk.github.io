const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const { parse } = require('csv-parse/sync');

const SOURCE_CSV_URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
const OUTPUT_DIR = process.cwd();
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'holidays.json');

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function toIsoDateJp(csvDate) {
  // Expecting formats like YYYY/M/D or YYYY/MM/DD
  if (!csvDate) return null;
  const parts = String(csvDate).trim().split('/').map((p) => p.trim());
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  const yyyy = y.padStart(4, '0');
  const mm = m.padStart(2, '0');
  const dd = d.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function fetchCsvBuffer(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  }
  // Node fetch returns an ArrayBuffer; convert to Buffer
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log(`Fetching: ${SOURCE_CSV_URL}`);
  const buffer = await fetchCsvBuffer(SOURCE_CSV_URL);

  // Government CSV is Shift_JIS encoded; decode to UTF-8
  const csvText = iconv.decode(buffer, 'Shift_JIS');

  // Parse CSV. We avoid relying on headers; pick rows that look like date + name.
  const records = parse(csvText, {
    skip_empty_lines: true,
    relax_column_count: true,
  });

  const holidayByIsoDate = {};

  for (const row of records) {
    if (!Array.isArray(row) || row.length < 2) continue;
    const [dateRaw, nameRaw] = row;
    const iso = toIsoDateJp(dateRaw);
    if (!iso) continue; // skip header or invalid rows
    const name = String(nameRaw || '').trim();
    if (!name) continue;
    holidayByIsoDate[iso] = name;
  }

  const outputJson = JSON.stringify(holidayByIsoDate, null, 2);

  ensureDirectoryExists(OUTPUT_DIR);
  fs.writeFileSync(OUTPUT_FILE, outputJson, 'utf8');

  console.log(`Wrote ${Object.keys(holidayByIsoDate).length} holidays to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


