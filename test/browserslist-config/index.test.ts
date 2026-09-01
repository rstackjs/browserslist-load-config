import { expect, test } from 'rstack/test';
import { findConfig, loadConfig } from '../../dist';

test('load browserslist from .browserslistrc', () => {
  expect(loadConfig({ path: __dirname })).toEqual([
    'iOS >= 9',
    'Android >= 4.4',
    'last 2 versions',
    '> 0.2%',
    'not dead',
  ]);

  expect(findConfig(__dirname)).toEqual({
    defaults: [
      'iOS >= 9',
      'Android >= 4.4',
      'last 2 versions',
      '> 0.2%',
      'not dead',
    ],
  });
});
