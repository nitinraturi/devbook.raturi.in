// Runs `astro build` and fails if Astro logs a warning or error, so new warnings
// can't slip into a passing build. Output is passed through unchanged.
import { spawn } from 'node:child_process';
import { stripVTControlCharacters } from 'node:util';

const child = spawn('npx', ['astro', 'build', ...process.argv.slice(2)], { stdio: ['inherit', 'pipe', 'pipe'] });
let log = '';
for (const [stream, out] of [
	[child.stdout, process.stdout],
	[child.stderr, process.stderr],
]) {
	stream.on('data', (chunk) => {
		out.write(chunk);
		log += chunk;
	});
}
child.on('close', (code) => {
	if (code !== 0) process.exit(code ?? 1);
	const found = stripVTControlCharacters(log)
		.split('\n')
		.filter((line) => /\[(WARN|ERROR)\]/.test(line));
	if (found.length) {
		console.error(`\nBuild logged ${found.length} warning(s) or error(s); fix them rather than hiding them:`);
		for (const line of found) console.error(`  ${line.trim()}`);
		process.exit(1);
	}
});
