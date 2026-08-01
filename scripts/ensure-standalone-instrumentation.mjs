import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const source = path.join(process.cwd(), ".next", "server", "instrumentation.js");
const destination = path.join(process.cwd(), ".next", "standalone", ".next", "server", "instrumentation.js");

await mkdir(path.dirname(destination), { recursive: true });
await copyFile(source, destination);

console.log("Standalone instrumentation entry verified.");
