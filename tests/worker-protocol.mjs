import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../deployment/worker.js';

test('HTTP apex redirects to HTTPS without losing encoded path or query data', async () => {
  const response = await worker.fetch(new Request('http://v-15.org/guides/rigging/boom-vang-upgrade/?source=club&next=%2Fguides%2F'));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://v-15.org/guides/rigging/boom-vang-upgrade/?source=club&next=%2Fguides%2F');
});
