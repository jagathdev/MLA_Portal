import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server root folder (one level up from config)
dotenv.config({ path: path.join(__dirname, "..", ".env") });
