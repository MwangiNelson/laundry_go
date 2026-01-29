import fs from "fs";
import path from "path";

// Files that are commonly generated and may have encoding issues
const filesToFix = ["database.types.ts"];

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

filesToFix.forEach((file) => {
  const filePath = path.join(__dirname, file);

  if (fs.existsSync(filePath)) {
    try {
      // Read as buffer
      const buffer = fs.readFileSync(filePath);

      // Decode (handles UTF-16 with BOM or UTF-8)
      let content;
      if (buffer[0] === 0xff && buffer[1] === 0xfe) {
        // UTF-16 LE with BOM
        content = buffer.toString("utf16le").slice(1); // Remove BOM
      } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
        // UTF-16 BE with BOM
        content = buffer.toString("utf16be").slice(1); // Remove BOM
      } else {
        content = buffer.toString("utf8");
      }

      // Write as UTF-8 without BOM
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✓ Fixed encoding for ${file}`);
    } catch (error) {
      console.error(`✗ Error fixing ${file}:`, error.message);
    }
  }
});
//
