import path from 'node:path';
import { expect, test } from 'rstack/test';
import { findConfig, loadConfig } from '../../dist';

test('load browserslist from package.json with env: test', () => {
  expect(loadConfig({ path: __dirname, env: 'test' })).toEqual([
    'last 2 versions',
    'not ie <= 11',
    'not ie_mob <= 11',
  ]);
});

test('load browserslist from package.json with env: production', () => {
  expect(loadConfig({ path: __dirname, env: 'production' })).toEqual([
    'Chrome >= 50',
  ]);
});

test.each(['defaults', 'development'])('normalizes %s queries', (env) => {
  const expected = ['chrome >= 80', 'firefox >= 80'];
  expect(findConfig(__dirname)?.[env]).toEqual(expected);
  expect(loadConfig({ path: __dirname, env })).toEqual(expected);
  expect(
    loadConfig({ config: path.join(__dirname, 'package.json'), env }),
  ).toEqual(expected);
});
