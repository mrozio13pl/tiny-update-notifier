import updater from './dist/index.mjs';

try {
    const update = await updater({ pkg: { name: 'test', version: '1.0.0'}, checkInterval: 3e3 });

    if (update) {
        console.log(`\n       New version of ${update.name} available!`);
        console.log(`       Update: ${update.current} → ${update.latest} (${update.type})\n`);
    }
} catch {
    console.log('Couldn\'t get the latest version.');
}