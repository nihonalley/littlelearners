const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const ITEMS = ["index.html", "css", "js", "games"];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

function copy(source, destination) {
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });

    for (const item of fs.readdirSync(source)) {
      copy(path.join(source, item), path.join(destination, item));
    }

    return;
  }

  fs.copyFileSync(source, destination);
}

for (const item of ITEMS) {
  const source = path.join(ROOT, item);

  if (fs.existsSync(source)) {
    copy(source, path.join(DIST, item));
  }
}

console.log("Build complete: dist/");
