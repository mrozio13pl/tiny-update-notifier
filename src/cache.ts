import fs from 'fs';
import path from 'path';
import cachedir from 'cachedir';
import type { Pkg } from './types';
import { debug } from './debug';

export class Cache {
    private readonly dir: string;
    private readonly fp: string;

    constructor(pkg: Pkg) {
        this.dir = cachedir('tiny-update-notifier');
        this.fp = path.join(this.dir, `${pkg.name}`);

        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir, { recursive: true });
        }

        debug('directory:', this.dir);
        debug('filepath:', this.fp);
    }

    async create(): Promise<void> {
        if (fs.existsSync(this.fp)) {
            try {
                const content = await this.read();
                // check if file is valid and not empty
                if (content && !isNaN(content)) return;
                debug('cache file is invalid, rewritting');
            } catch {
                // get rid of cache file if it's not a valid file
                await fs.promises.unlink(this.fp);
            }
        }

        await fs.promises.writeFile(this.fp, String(Date.now()), 'utf8');
    }

    async read(): Promise<number> {
        return Number.parseInt(await fs.promises.readFile(this.fp, 'utf8'));
    }

    async update(): Promise<void> {
        await fs.promises.writeFile(this.fp, String(Date.now()), 'utf8');
    }
}