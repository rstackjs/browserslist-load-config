import { expect, test } from 'rstack/test';
import { loadConfig } from '../../dist';

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
