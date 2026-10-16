import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, rs, test } from 'rstack/test';
import { loadConfig } from '../../src';

let root: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'browserslist-cache-'));
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ browserslist: ['chrome 120'] }),
  );
});

afterEach(() => {
  rs.restoreAllMocks();
  fs.rmSync(root, { recursive: true, force: true });
});

test.each(['package.json', '.browserslistrc'])('caches explicit %s', (file) => {
  const config = path.join(root, file);
  if (file === '.browserslistrc') fs.writeFileSync(config, 'chrome 120');
  const read = rs.spyOn(fs, 'readFileSync');
  expect(loadConfig({ config })).toEqual(['chrome 120']);
  expect(loadConfig({ config: path.relative(process.cwd(), config) })).toEqual([
    'chrome 120',
  ]);
  expect(read).toHaveBeenCalledTimes(1);
});

test('reuses parent configuration for sibling directories', () => {
  expect(loadConfig({ path: path.join(root, 'a') })).toEqual(['chrome 120']);
  const read = rs.spyOn(fs, 'readFileSync');
  expect(loadConfig({ path: path.join(root, 'b') })).toEqual(['chrome 120']);
  expect(read).not.toHaveBeenCalled();
});

test('caches missing configurations', () => {
  fs.writeFileSync(path.join(root, 'package.json'), '{}');
  expect(loadConfig({ path: root })).toBeUndefined();
  const read = rs.spyOn(fs, 'readFileSync');
  expect(loadConfig({ path: root })).toBeUndefined();
  expect(read).not.toHaveBeenCalled();
});
