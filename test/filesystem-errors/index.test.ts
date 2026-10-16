import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, rs, test } from 'rstack/test';
import { loadConfig } from '../../src';

let root: string;
let child: string;
let config: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'browserslist-fs-errors-'));
  child = path.join(root, 'child');
  config = path.join(child, '.browserslistrc');
  fs.mkdirSync(child);
  fs.writeFileSync(path.join(root, '.browserslistrc'), 'chrome 120');
  fs.writeFileSync(config, 'firefox 120');
});

afterEach(() => {
  rs.restoreAllMocks();
  fs.rmSync(root, { recursive: true, force: true });
});

for (const method of ['existsSync', 'statSync'] as const) {
  test.each(['ENOENT', 'EACCES', 'ERR_ACCESS_DENIED'])(
    `continues searching parent directories when ${method} throws %s`,
    (code) => {
      const original = fs[method];
      rs.spyOn(fs, method).mockImplementation((...[file]) => {
        if (file === config) {
          throw Object.assign(new Error(code), { code });
        }
        return original(file);
      });

      expect(loadConfig({ path: child })).toEqual(['chrome 120']);
    },
  );

  test(`rethrows unexpected ${method} errors`, () => {
    const error = Object.assign(new Error('I/O error'), { code: 'EIO' });
    const original = fs[method];
    rs.spyOn(fs, method).mockImplementation((...[file]) => {
      if (file === config) {
        throw error;
      }
      return original(file);
    });

    expect(() => loadConfig({ path: child })).toThrow(error);
  });
}
