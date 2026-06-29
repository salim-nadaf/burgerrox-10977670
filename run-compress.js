import { execSync } from 'child_process';

const targetScript = 'C:\\Users\\Sumaiya\\.gemini\\antigravity\\brain\\1d5c69eb-3e29-45b5-b96e-6761e1f160ec\\scratch\\compress-images.mjs';
const runDir = 'C:\\Users\\Sumaiya\\.gemini\\antigravity\\scratch\\burgerrox-10977670';

try {
  console.log('Running script with local node_modules context...');
  execSync(`node "${targetScript}"`, { cwd: runDir, stdio: 'inherit' });
} catch (e) {
  console.error('Execution failed:', e);
}
