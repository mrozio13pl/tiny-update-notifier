import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    dts: true,
    minify: true,
    format: ['cjs', 'esm'],
    removeNodeProtocol: true
});