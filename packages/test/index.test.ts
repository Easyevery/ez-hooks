import { test, assert } from 'vitest';
import add from '../src';

test('simple', () => {
  assert.equal(add(1, 2), 3);
});
