import { getLatestVersion } from './getLatestVersion';
import { Cache } from './cache';
import semiff from 'semiff';
import type { Options, Update } from './types';

/**
 * Check if an update is available.
 * @param {Options} options Arguments
 * @returns {Update | false}
 * @async
 *
 * @example
 * ```ts
 * import updateNotifier from 'tiny-update-notifier';
 * import packageJson from './package.json' assert { type: 'json' };
 *
 * try {
 *     const update = await updateNotifier({ pkg: packageJson });
 *
 *     if (update) {
 *         console.log(`New version of ${update.name} available!`);
 *         console.log(`Update: ${update.current} → ${update.latest} (${update.type})`);
 *     }
 * } catch {
 *     console.log('Couldn\'t get the latest version.');
 * }
 * ```
 *
 * Output if a newer version is available:
 * ```md
 * New version of test available!
 * Update: 1.0.0 → 3.3.0 (major)
 * ```
 */
export default async function updateNotifier(options: Options): Promise<Update | false> {
    // prevent common mistakes
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unnecessary-condition
    if (!options || !options.pkg || !options.pkg.name || !options.pkg.version) {
        throw new Error('pkg.name and pkg.version are required');
    }

    let cache: Cache | undefined;

    options = { cache: true, checkInterval: 60 * 60 * 24 * 1e3, ...options };

    if (options.cache) {
        cache = new Cache(options.pkg);
        try {
            const latestCheck = await cache.read();

            if (latestCheck + options.checkInterval! > Date.now()) {
                return false;
            }
        } catch {
            await cache.create();
        }
    }

    const latestVersion = await getLatestVersion(options.pkg.name, options.distTag, options.timeout);
    await cache?.update();

    const diff = semiff(options.pkg.version, latestVersion);

    if (diff) {
        return {
            name: options.pkg.name,
            current: options.pkg.version,
            latest: latestVersion,
            type: diff
        };
    }

    return false;
}