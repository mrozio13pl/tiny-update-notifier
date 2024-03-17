import https from 'node:https';
import { debug } from './utils/debug';

/**
 * Get latest version of npm package.
 * @param {string} pkgName Package name
 * @param {string} distTag Dist-tag which will be used to find the latest
 * @param {number} timeout Request timeout
 * @returns {Promise<string>} Latest version
 */
export function getLatestVersion(pkgName: string, distTag = 'latest', timeout = 30_000): Promise<string> {
    const url = `https://registry.npmjs.org/-/package/${pkgName}/dist-tags`;

    return new Promise<string>((resolve, reject) => {
        const request = https.get(url, res => {
            let body = '';

            res
                .on('data', data => (body += data))
                .on('end', () => {
                    try {
                        const json = JSON.parse(body);
                        const version = json[distTag];
                        debug('npm registry response:', json);

                        if (!version) reject(new Error(`Couldn't get version for dist-tag: ${distTag}`));
                        else resolve(version);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', err => { reject(err) });
        });

        const timeout_id = setTimeout(() => {
            request.destroy();
            reject(new Error('Request timed out'));
        }, timeout);

        request.on('close', () => {
            clearTimeout(timeout_id);
        });
    });
}