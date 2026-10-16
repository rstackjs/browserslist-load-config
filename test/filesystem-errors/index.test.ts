import fs from 'node:fs';
import { afterEach, expect, rs, test } from 'rstack/test';
import { loadConfig } from '../../src';

afterEach(() => {
  rs.restoreAllMocks();
});

for (const method of ['existsSync', 'statSync'] as const) {
  test.each(['ENOENT', 'EACCES', 'ERR_ACCESS_DENIED', 'EIO'])(
    `handles ${method} error %s`,
    (code) => {
      const error = Object.assign(new Error(code), { code });
      rs.spyOn(fs, 'existsSync').mockReturnValue(true);
      rs.spyOn(fs, method).mockImplementation(() => {
        throw error;
      });

      if (code === 'EIO') {
        expect(() => loadConfig({ path: __dirname })).toThrow(error);
      } else {
        expect(loadConfig({ path: __dirname })).toBeUndefined();
      }
    },
  );
}
