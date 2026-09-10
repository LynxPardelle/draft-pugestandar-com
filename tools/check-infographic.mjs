import assert from 'node:assert/strict';
import fs from 'node:fs';
import { infographicCalculator } from './infographic-calculator.mjs';

// Verify the emitted native configuration, not a separate calculator implementation.
const assets = Object.fromEntries(['length', 'mass', 'time', 'area', 'volume', 'speed', 'energy', 'temperature'].map(key => [key, `/assets/${key}.svg`]));
const { components, rootId, combos } = infographicCalculator({ assets });
const catalog = JSON.parse(fs.readFileSync(new URL('./data/pe-catalog-v0.2.0.json', import.meta.url), 'utf8'));
const map = new Map(components.map(component => [component.id, component]));
assert.equal(map.size, components.length, 'Component IDs must be unique');
assert.ok(components.every(component => component.id.startsWith('iiCalc')));
assert.ok(Object.keys(combos).every(key => key.startsWith('ii')));
const scopes = components.filter(component => component.type === 'interaction-scope' && component.config.computations);
assert.equal(scopes.length, 13);
assert.equal(components.filter(component => component.type === 'interaction-scope').length, 14);
assert.equal(components.filter(component => component.type === 'media').length, 13, 'Every magnitude has an illustration, including fallbacks');
assert.ok(!map.has('iiCalcHeading') && !map.has('iiCalcIntro'), 'The page owns the calculator heading');

const compute = (scope, values) => Object.fromEntries(scope.computations.map(definition => [definition.resultId,
  definition.steps.reduce((current, operation) => {
    const value = operation.value?.source === 'field' ? Number(values[operation.value.fieldId]) : operation.value?.value;
    switch (operation.op) {
      case 'multiply': return current * value;
      case 'divide': assert.notEqual(value, 0, 'No computation divides by zero'); return current / value;
      case 'abs': return Math.abs(current);
      case 'round': return Math.round(current * 10 ** operation.precision) / 10 ** operation.precision;
      default: throw new Error(`Unexpected operation: ${operation.op}`);
    }
  }, Number(values[definition.initial.fieldId])),
]));

// The existing condition orchestrator evaluates all/any/not from left to right.
const matches = (source, snapshot) => {
  let result;
  for (const instruction of source.split(';')) {
    const [mode, expression] = instruction.split(':');
    const [operator, path, raw] = expression.split(',');
    const value = path.split('.').reduce((current, key) => current[key], snapshot);
    const expected = raw === 'true' ? true : Number(raw);
    const resolve = {
      scopeEq: () => value === expected, scopeGt: () => value > expected,
      scopeGte: () => value >= expected, scopeLt: () => value < expected,
      scopeLte: () => value <= expected,
    }[operator];
    assert.ok(resolve, `Known condition: ${operator}`);
    const yes = resolve();
    result = mode === 'all' ? (result ?? true) && yes : mode === 'any' ? (result ?? false) || yes : (result ?? true) && !yes;
  }
  return result ?? true;
};
const close = (actual, expected, message = '') => assert.ok(
  Math.abs(actual - expected) <= Math.max(1e-110, Math.abs(expected) * 1e-12),
  `${message}: ${actual} != ${expected}`,
);
const autoChoice = (p, values, computed) => {
  const visible = components.filter(component => component.id.startsWith(`${p}AutoResult`) && matches(component.condition, { values, computed, meta: { valid: true } }));
  assert.equal(visible.length, 1, `${p} must have exactly one automatic result`);
  return Number(visible[0].id.match(/(\d+)$/)[1]);
};

let numericalAndSwapChecks = 0;
for (const { config: scope } of scopes) {
  const p = scope.scopeId;
  const options = map.get(`${p}FromControl`).config.options;
  const amount = `${p}Quantity`, from = `${p}From`, to = `${p}To`;
  for (const option of options) {
    for (const value of [0, 1, 123.456, 1e-90]) {
      const values = { ...scope.initialValues, [amount]: value, [from]: option.value, [to]: -1 };
      const computed = compute(scope, values);
      const index = autoChoice(p, values, computed);
      const swapButton = map.get(`${p}SwapAuto${index}`);
      const effective = Number(swapButton.eventInstructions.split(';')[0].split(',')[1]);
      values[`${p}EffectiveTo`] = effective;
      const swapped = compute(scope, values).swapResult;
      close(swapped * effective, value * option.value, `${p} selected prefix preserves quantity`);
      const inverse = { ...values, [amount]: swapped, [from]: effective, [to]: option.value };
      close(compute(scope, inverse).manual, value, `${p} inverse`);
      numericalAndSwapChecks++;
    }
  }
}
const example = (p, value, fromLabel, expectedPrefix, expected) => {
  const scope = map.get(`${p}Scope`).config;
  const option = map.get(`${p}FromControl`).config.options.find(item => item.label === fromLabel);
  assert.ok(option, `${p} has ${fromLabel}`);
  const values = { ...scope.initialValues, [`${p}Quantity`]: value, [`${p}From`]: option.value };
  const computed = compute(scope, values);
  const index = autoChoice(p, values, computed);
  assert.equal(index, expectedPrefix, `${p} prefix for ${value} ${fromLabel}`);
  close(computed[`auto${index}`], expected, `${p} reference example`);
  numericalAndSwapChecks++;
};
example('iiCalclength', 1.8, 'm', 2, 6);
example('iiCalctime', 1, 'min', 2, 100);
example('iiCalcenergy', 1, 'kWh', 4, 2);
example('iiCalctime', 600000, 's', 4, 1);
example('iiCalctime', 600000000, 's', 5, 1);
example('iiCalclength', 0.0000003, 'm', 0, 1);
example('iiCalclength', 0.0003, 'm', 1, 1);
example('iiCalclength', 0.3, 'm', 2, 1);
example('iiCalclength', 300, 'm', 3, 1);
example('iiCalclength', 300000, 'm', 4, 1);
example('iiCalclength', 300000000, 'm', 5, 1);
for (const [quantity, prefix] of [[299.99999984, 2], [299.99999985, 3], [300, 3]]) {
  example('iiCalclength', quantity, 'm', prefix, quantity / (prefix === 2 ? 0.3 : 300));
}
assert.equal(numericalAndSwapChecks, 486);

let sourceAndBoundsChecks = 0;
const display = value => value.replaceAll('^2', '²').replaceAll('^3', '³').replace('a_J', 'año (365.25 días)');
const prefixScales = { 'μ': 1e-6, m: 1e-3, k: 1e3, M: 1e6, G: 1e9 };
for (const { config: scope } of scopes) {
  const p = scope.scopeId;
  const options = map.get(`${p}FromControl`).config.options;
  const input = map.get(`${p}Amount`).config;
  const common = scope.computations.find(item => item.resultId === 'siRaw').steps[1].value.value;
  assert.equal(input.controlType, 'number', 'Value binding must use the native number control');
  assert.ok(input.labelTextConfig.styles.fontFamily.includes('Trebuchet'));
  for (const [index, option] of options.entries()) {
    let unit = catalog.units.find(item => display(item.symbol) === option.label);
    let multiplier = 1;
    if (!unit) {
      multiplier = prefixScales[option.label[0]];
      const base = option.label.slice(1).replace(/^\(/, '').replace(/\)$/, '');
      unit = catalog.units.find(item => display(item.symbol) === base);
    }
    assert.ok(unit && multiplier, `Catalog unit exists for ${option.label}`);
    close(option.value / common, Number(unit.scaleToSI.numerator) / Number(unit.scaleToSI.denominator) * multiplier, `Catalog factor ${option.label}`);
    const rules = input[`rules${index}`];
    const maximum = rules.find(rule => rule.type === 'max').value;
    close(maximum * option.value / common, 1e15, `SI bound ${option.label}`);
    assert.ok(new RegExp(rules.find(rule => rule.type === 'pattern').value).test('1e-119'));
    assert.ok(!new RegExp(rules.find(rule => rule.type === 'pattern').value).test('1e-201'));
    sourceAndBoundsChecks++;
  }
  const zero = { ...scope.initialValues, [`${p}Quantity`]: 0 };
  assert.equal(compute(scope, zero).siAbs, 0);
  const tiny = { ...scope.initialValues, [`${p}Quantity`]: 1e-120 };
  const tinySI = compute(scope, tiny).siAbs;
  assert.ok(tinySI > 0 && tinySI < 1e-100, `${p} tiny input triggers the native lower-bound condition`);
}
assert.ok(map.get('iiCalcareaFromControl').config.options.some(option => option.label === 'k(PE_L²)'));
assert.ok(map.get('iiCalcvolumeFromControl').config.options.some(option => option.label === 'm(PE_L³)'));

const queue = [rootId], reachable = new Set();
while (queue.length) {
  const id = queue.pop();
  assert.ok(map.has(id), `Referenced component exists: ${id}`);
  if (reachable.has(id)) continue;
  reachable.add(id);
  queue.push(...(map.get(id).config.components ?? []));
}
assert.equal(reachable.size, components.length, 'Every emitted component is reachable');
console.log(JSON.stringify({ passed: true, numericalAndSwapChecks, sourceAndBoundsChecks, nativeScopes: 14, uniqueIds: map.size, reachableComponents: reachable.size }));
