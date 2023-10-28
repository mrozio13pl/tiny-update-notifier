import tsup, { defineConfig } from 'tsup';
import fs from 'fs/promises';
import { exec } from 'child_process';

export const BANNER = "import { createRequire } from 'module';const require = createRequire(import.meta.url);";

const config = defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    dts: true,
    minify: 'terser',
    format: ['cjs', 'esm'],
    noExternal: ['semver', 'cachedir'],
    banner: {
        js: BANNER
    }
});

await tsup.build(config);

const cjsOutput = './dist/index.js';
const bannerRegex = /import\s*\{\s*createRequire\s*as\s*\w+\s*\}\s*from\s*["']module["']\s*;\s*const\s+\w+\s*=\s*e\(import\.meta\.url\)\s*;/;
const content = await fs.readFile(cjsOutput, 'utf8');
await fs.writeFile(cjsOutput, content.replace(bannerRegex, 'const r=require;'), 'utf8');

exec('node cjstest.cjs', (error, stdout, stderr) => {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    if (error !== null) {
        console.log(`cjstest error: ${error}`);
    }
});