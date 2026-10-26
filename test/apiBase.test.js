import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApiBase } from '../src/apiBase.js';

test('normalizes a Vercel hostname by adding https and /api', () => {
  assert.equal(normalizeApiBase('backend.example.vercel.app'), 'https://backend.example.vercel.app/api');
});
test('preserves an explicit API URL', () => {
  assert.equal(normalizeApiBase('https://backend.example.vercel.app/api/'), 'https://backend.example.vercel.app/api');
});
test('uses local API when no frontend environment value exists', () => {
  assert.equal(normalizeApiBase(''), 'http://localhost:4000/api');
});
