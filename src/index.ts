import { createServer } from "http";
import serveStatic from "serve-static";
import finalhandler from "finalhandler";
import path from "path";
import { fileURLToPath } from "url";

// __dirname の代替（ESM環境で必要）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// public フォルダを static ファイルとして提供する
const serve = serveStatic(path.join(__dirname, "../public"));

const server = createServer((req, res) => {
  if (req.url?.startsWith("/static")) {
    // "/static" を削除して実ファイルに対応させる
    req.url = req.url.replace("/static", "");
    serve(req, res, finalhandler(req, res));
  } else {
    // それ以外は 404 を返す
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
