const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const shell = require("./utils/shell");
const { spawn } = require("child_process");

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const test = String(process.env.TEST) === "true";

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.post("/", async (req, res) => {
  try {
    /**
     * Write archive
     * Kill old process if exists
     * Remove old folder if exists
     * Extract archive
     * Install dependencies
     * Build
     * Run
     */
    if (req.body?.apiKey !== apiKey && !test) throw "err";

    const file = req.files?.file;
    if (!file) throw "errr";

    const md5 = file.md5;
    const appDir = __dirname + "/apps/" + md5;
    const shellScript = __dirname + "/" + md5 + ".sh";
    console.log("shell", shellScript);

    if (fs.existsSync(appDir)) {
      fs.rmSync(appDir, { recursive: true });
    }
    fs.mkdirSync(appDir);
    fs.writeFileSync(
      __dirname + "/apps/" + md5 + "/" + "app.tar.gz",
      file.data
    );
    fs.writeFileSync(shellScript, shell(md5));

    const logStream = fs.createWriteStream(
      __dirname + "/logs/" + md5 + ".log",
      { flags: "a" }
    );
    const proc = spawn("bash", [md5 + ".sh"]);

    proc.stdout.pipe(logStream);
    proc.stderr.pipe(logStream);
    proc.on("close", () => fs.rmSync(shellScript, { force: true }));

    res.sendStatus(200);
  } catch (err) {
    console.log("Error", err);
    res.sendStatus(500);
  }
});

const server = http.createServer(app);

server.listen(port, () => {
  if (!fs.existsSync(__dirname + "/apps")) {
    fs.mkdirSync(__dirname + "/apps");
  }
  if (!fs.existsSync(__dirname + "/logs")) {
    fs.mkdirSync(__dirname + "/logs");
  }
  console.log("Deployment server running on port ", port);
});
