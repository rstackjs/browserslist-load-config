import { expect, test } from 'rstack/test';
import { loadConfig } from '../../dist';

test('load browserslist from package.json', () => {
  expect(loadConfig({ path: __dirname })).toEqual([
    'last 2 versions',
    'not ie <= 11',
    'not ie_mob <= 11',
  ]);
});
