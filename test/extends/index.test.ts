import { expect, test } from 'rstack/test';
import { loadConfig } from '../../dist';

test('load browserslist with extends', () => {
  expect(loadConfig({ path: __dirname })).toEqual([
    'extends browserslist-config-test',
  ]);
});
