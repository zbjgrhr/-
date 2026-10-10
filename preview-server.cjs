/* Zero-dependency local server for the statically exported portfolio in /out. */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.join(__dirname, "out");
const requestedPort = process.env.PORT ? Number(process.env.PORT) : 0;
const types = {
  ".css": "text/css; charset=utf-8", ".gif": "image/gif", ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".woff": "font/woff", ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = decoded === "/" ? "/index.html" : decoded;
  const candidate = path.resolve(root, "." + requested);
  if (!candidate.startsWith(root)) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  const directoryIndex = path.join(candidate, "index.html");
  return fs.existsSync(directoryIndex) ? directoryIndex : null;
}

const server = http.createServer((request, response) => {
  const file = resolveFile(request.url || "/");
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(file).pipe(response);
});

server.on("error", (error) => {
  console.error("\n预览启动失败：", error.message);
  console.error("请把这个窗口中的报错截图发给我。\n");
  process.exitCode = 1;
});

server.listen(requestedPort, "127.0.0.1", () => {
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : requestedPort;
  const url = `http://127.0.0.1:${port}/`;
  console.log(`\n作品集预览已启动：${url}\n按 Ctrl + C 结束预览。\n`);
  const browser = spawn("cmd.exe", ["/c", "start", "", url], {
    detached: true,
    stdio: "ignore",
  });
  browser.unref();
});
