/**
 * Simple debug function
 * @param {...any} args messages
 */
export function debug(...args: unknown[]): void {
    if (process.env.TINY_UPDATE_NOTIFIER_DEBUG) console.log('DEBUG', ...args);
}