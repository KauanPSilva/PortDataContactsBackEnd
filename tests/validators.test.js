const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
    isValidName,
    isValidId,
    isValidPhone
} = require('../src/utils/validators');

test('accepts names with at least two valid words', () => {
    assert.equal(isValidName('João Pedro'), true);
    assert.equal(isValidName('Maria Clara Silva'), true);
    assert.equal(isValidName('Ana Maria'), true);
});

test('rejects names with fewer than two words', () => {
    assert.equal(isValidName('João'), false);
    assert.equal(isValidName(''), false);
});

test('rejects names containing words with fewer than three letters', () => {
    assert.equal(isValidName('Ana Li'), false);
    assert.equal(isValidName('João da Silva'), false);
});

test('rejects names containing numbers or symbols', () => {
    assert.equal(isValidName('João Pedro123'), false);
    assert.equal(isValidName('Ana Maria!'), false);
});

test('accepts positive integer IDs', () => {
    assert.equal(isValidId('1'), true);
    assert.equal(isValidId('123'), true);
});

test('rejects invalid IDs', () => {
    assert.equal(isValidId('0'), false);
    assert.equal(isValidId('-1'), false);
    assert.equal(isValidId('abc'), false);
    assert.equal(isValidId('1.5'), false);
});

test('accepts non-empty phone numbers', () => {
    assert.equal(isValidPhone('21999999999'), true);
    assert.equal(isValidPhone('(21) 99999-9999'), true);
});

test('rejects invalid phone values', () => {
    assert.equal(isValidPhone(''), false);
    assert.equal(isValidPhone('   '), false);
    assert.equal(isValidPhone(null), false);
    assert.equal(isValidPhone(123456789), false);
});