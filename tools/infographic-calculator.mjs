import fs from 'node:fs';

// Authoring-only module. All browser behavior uses the existing native draft runtime.
const catalog = JSON.parse(fs.readFileSync(new URL('./data/pe-catalog-v0.2.0.json', import.meta.url), 'utf8'));
const byId = new Map(catalog.units.map(unit => [unit.id, unit]));
const prefixes = [
  { id: 'micro', symbol: 'μ', name: 'micro', factor: 1e-6 },
  { id: 'milli', symbol: 'm', name: 'mili', factor: 1e-3 },
  { id: 'base', symbol: '', name: 'sin prefijo', factor: 1 },
  { id: 'kilo', symbol: 'k', name: 'kilo', factor: 1e3 },
  { id: 'mega', symbol: 'M', name: 'mega', factor: 1e6 },
  { id: 'giga', symbol: 'G', name: 'giga', factor: 1e9 },
];
const groups = [
  ['length', 'Longitud', 'pe_length', ['mm', 'cm', 'm', 'km'], ['pe_length_aux'], 1.8, 'm', 'El pug no crece. Cambia la escala.'],
  ['mass', 'Masa', 'pe_mass', ['g', 'kg', 'tonne'], [], 90, 'kg', 'La masa sigue ahí. Las croquetas también.'],
  ['time', 'Tiempo', 'pe_time', ['ms', 's', 'minute', 'hour', 'day', 'julian_year'], ['pe_breath', 'pe_life'], 1, 'minute', 'Ahora la espera del snack tiene otra unidad.'],
  ['area', 'Área', 'pe_area', ['cm2', 'm2', 'ha'], [], 20, 'm2', 'Una superficie de referencia. No una guardería de pugs.'],
  ['volume', 'Volumen', 'pe_volume', ['ml', 'liter', 'm3'], [], 10, 'liter', 'El cubo tiene 27 litros. El pug se queda fuera.'],
  ['speed', 'Velocidad', 'pe_speed', ['m_s', 'km_h'], [], 18, 'km_h', 'No hace falta poner a correr al modelo.'],
  ['acceleration', 'Aceleración', 'pe_acceleration', ['m_s2'], [], 1, 'm_s2', 'De la siesta al snack: aquí solo hacemos matemáticas.'],
  ['frequency', 'Frecuencia', 'pe_frequency', ['Hz', 'kHz'], [], 1000, 'Hz', 'Ciclos genéricos. No mezclamos latidos y respiraciones.'],
  ['force', 'Fuerza', 'pe_force', ['N', 'kN'], [], 6, 'N', 'Masa y fuerza van por separado. El pug lo aprueba.'],
  ['energy', 'Energía', 'pe_energy', ['J', 'kJ', 'Wh', 'kWh'], [], 1, 'kWh', 'Un kilowatt-hora cabe en dos megapugs de energía.'],
  ['power', 'Potencia', 'pe_power', ['W', 'kW'], [], 60, 'W', 'Energía por tiempo. Siestas por segundo no aplica.'],
  ['pressure', 'Presión', 'pe_pressure', ['Pa', 'kPa', 'bar'], [], 100, 'Pa', 'Misma referencia de presión; distinto número.'],
  ['mass_density', 'Densidad', 'pe_density', ['kg_m3', 'g_cm3'], [], 1, 'g_cm3', 'Masa entre volumen. Nunca densidad de perro.'],
];
const field = fieldId => ({ source: 'field', fieldId });
const literal = value => ({ source: 'literal', value });
const step = (op, value) => ({ op, value: typeof value === 'string' ? field(value) : literal(value) });
const symbol = value => value.replaceAll('^2', '²').replaceAll('^3', '³').replace('a_J', 'año (365.25 días)');
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;
const AUTO = -1;
// Promote just before six-decimal rounding would display 1000 in the lower prefix.
const promotion = factor => factor * (1 - 5e-10);

export function infographicCalculator({ assets = {} } = {}) {
  const components = [];
  const ink = '#163b55';
  const add = (id, type, config, extra = {}) => {
    components.push({ id, type, config, ...extra });
    return id;
  };
  const text = (id, content, styles = {}, extra = {}, tag = 'p') => add(id, 'text', {
    tag, text: content, styles: { margin: '0', fontFamily: 'Arial, sans-serif', color: ink, lineHeight: '1.45', ...styles },
  }, extra);
  const box = (id, children, styles = {}, extra = {}) => add(id, 'container', {
    tag: 'div', components: children, styles: { minWidth: '0', ...styles }, ...extra,
  });
  const button = (id, label, eventInstructions, extra = {}) => add(id, 'button', {
    type: 'button', label, classes: 'iiCalcButton', disabledClasses: 'ank-opacity-40per',
    styles: { minHeight: '42px', padding: '10px 12px', border: `2px solid ${ink}`, borderRadius: '10px', background: '#fffdf5', color: ink, fontSize: '13px', fontWeight: '700', fontFamily: 'Arial, sans-serif' },
    ...extra,
  }, { eventInstructions });
  const inputStyle = {
    labelTextConfig: { styles: { fontFamily: 'Trebuchet MS, Arial, sans-serif', fontWeight: '700', fontSize: '13px' } },
    helperTextConfig: { styles: { fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '12px' } },
    errorTextConfig: { styles: { fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '12px', color: '#992c2c' } },
    dropdownTriggerTextConfig: { styles: { fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '15px', fontWeight: '600' } },
    classes: 'ank-display-block ank-width-100per ank-fontFamily-Arial',
    labelClasses: 'ank-display-block ank-fontFamily-Arial ank-fontSize-13px ank-fontWeight-700 ank-marginBottom-6px',
    helperTextClasses: 'ank-display-block ank-fontFamily-Arial ank-fontSize-12px ank-marginTop-6px',
    errorClasses: 'ank-display-block ank-fontFamily-Arial ank-fontSize-12px ank-color-HASH992c2c ank-marginTop-6px',
    fieldClasses: 'ank-width-100per ank-boxSizing-borderMINbox', inputClasses: 'iiCalcInput',
  };
  const dropdown = {
    ...inputStyle, controlType: 'select', dropdownIndicatorText: '⌄',
    dropdownTriggerClasses: 'ank-display-flex ank-alignItems-center ank-justifyContent-spaceMINbetween ank-gap-8px ank-width-100per',
    dropdownConfig: {
      renderMode: 'overlay', overlayMatchWidth: 'origin', buttonClasses: 'iiCalcInput ank-cursor-pointer',
      menuContainerClasses: 'iiCalcMenu', menuListClasses: 'ank-listStyle-none ank-padding-0 ank-margin-0',
      itemLinkClasses: 'iiCalcOption', selectedItemClasses: 'ank-bg-HASHdcefdc',
    },
  };
  const scopedIds = [];

  for (const [kind, label, peId, conventionalIds, auxiliaryIds, example, exampleUnit, joke] of groups) {
    const p = `iiCalc${kind}`;
    const amount = `${p}Quantity`, from = `${p}From`, to = `${p}To`, effectiveTo = `${p}EffectiveTo`;
    const pe = byId.get(peId);
    if (!pe) throw new Error(`Missing PE definition: ${peId}`);
    // Common integer weights retain the exact catalog ratios through the native Number pipeline.
    const conventional = conventionalIds.map(id => byId.get(id));
    const auxiliaries = auxiliaryIds.map(id => byId.get(id));
    const common = Number([...conventional, ...auxiliaries].reduce((value, unit) => lcm(value, BigInt(unit.scaleToSI.denominator)), BigInt(pe.scaleToSI.denominator) * 1000000n));
    const weighted = unit => Number(BigInt(unit.scaleToSI.numerator) * BigInt(common) / BigInt(unit.scaleToSI.denominator));
    const peScale = weighted(pe);
    const peSymbol = symbol(pe.symbol);
    const prefixedSymbol = prefix => prefix.symbol && ['area', 'volume'].includes(kind) ? `${prefix.symbol}(${peSymbol})` : `${prefix.symbol}${peSymbol}`;
    const units = [
      ...conventional.map(unit => ({ ...unit, factor: weighted(unit), display: symbol(unit.symbol) })),
      ...prefixes.map(prefix => ({ id: `${peId}_${prefix.id}`, factor: peScale * prefix.factor, display: prefixedSymbol(prefix), prefix })),
      ...auxiliaries.map(unit => ({ ...unit, factor: weighted(unit), display: symbol(unit.symbol) })),
    ];
    if (new Set(units.map(unit => unit.factor)).size !== units.length) throw new Error(`Duplicate scale in ${kind}`);
    const fromDefault = units.find(unit => unit.id === exampleUnit).factor;
    const options = units.map(unit => ({ value: unit.factor, label: unit.display }));
    const signed = ['length', 'speed', 'acceleration', 'force', 'energy', 'power'].includes(kind);
    const amountConfig = { ...inputStyle, fieldId: amount, controlType: 'number', step: 1e-8, label: 'Cantidad', value: example, placeholder: 'Ponle un número' };
    const commonRules = [{ type: 'required', message: 'Escribe una cantidad. Cero también cuenta.' }, { type: 'pattern', value: '^[+-]?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)(?:[eE][+-]?(?:[0-9]{1,2}|1[0-9]{2}|200))?$', message: 'Usa un número con punto decimal y exponente entre −200 y 200.' }];
    const rules = [];
    for (const [index, unit] of units.entries()) {
      const maximum = 1e15 * common / unit.factor;
      amountConfig[`rules${index}`] = [...commonRules,
        { type: 'min', value: signed ? -maximum : 0, message: signed ? 'Superas el límite inferior de esta vista.' : 'Esta magnitud admite cero o cantidades positivas.' },
        { type: 'max', value: maximum, message: `Máximo equivalente: 1e15 ${symbol(pe.siUnit)}.` },
        { type: 'maxLength', value: 32, message: 'Usa hasta 32 caracteres.' },
      ];
      rules.push(`set:config.validation${index},when,"all:scopeEq,values.${from},${unit.factor}",eval:config.rules${index},eval:config.${index ? `validation${index - 1}` : 'rules0'}`);
    }
    amountConfig.tooSmall = [...commonRules, { type: 'pattern', value: '(?!)', message: `Usa cero o al menos 1e-100 ${symbol(pe.siUnit)} de magnitud absoluta.` }];
    rules.push(`set:config.finalRules,when,"all:scopeGt,computed.siAbs,0;all:scopeLt,computed.siAbs,1e-100",eval:config.tooSmall,eval:config.validation${units.length - 1}`);
    rules.push('set:config.validation,literal,eval:config.finalRules');
    add(`${p}Amount`, 'input', amountConfig, { valueInstructions: rules.join(';') });
    add(`${p}FromControl`, 'input', { ...dropdown, fieldId: from, label: 'Desde', value: fromDefault, options });
    add(`${p}ToControl`, 'input', { ...dropdown, fieldId: to, label: 'Hasta', value: AUTO, options: [{ value: AUTO, label: 'PE · automático' }, ...options] });
    box(`${p}Units`, [`${p}FromControl`, `${p}ToControl`], { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px' });
    text(`${p}InputHint`, 'Punto decimal. “Automático” elige el prefijo; también puedes escogerlo en Hasta.', { fontSize: '12px' });

    const computations = [
      { resultId: 'siRaw', initial: field(amount), steps: [step('multiply', from), step('divide', common)] },
      { resultId: 'siAbs', initial: field(amount), steps: [step('multiply', from), step('divide', common), { op: 'abs' }] },
      { resultId: 'baseAbs', initial: field(amount), steps: [step('multiply', from), step('divide', peScale), { op: 'abs' }] },
      { resultId: 'swapResult', initial: field(amount), steps: [step('multiply', from), step('divide', effectiveTo)] },
    ];
    const numericalText = (id, resultId, divisor) => {
      const steps = [step('multiply', from), step('divide', divisor)];
      computations.push({ resultId, initial: field(amount), steps },
        { resultId: `${resultId}Abs`, initial: field(amount), steps: [...steps, { op: 'abs' }] },
        { resultId: `${resultId}Rounded`, initial: field(amount), steps: [...steps, { op: 'round', precision: 6 }] });
      for (const exponent of [6, 12, 18]) computations.push({ resultId: `${resultId}E${exponent}`, initial: field(amount), steps: [...steps, step('divide', 10 ** exponent), { op: 'round', precision: 6 }] });
      const instructions = [`set:config.raw,scope,computed.${resultId}`, `set:config.rounded,scope,computed.${resultId}Rounded`, `set:config.display0,when,"all:scopeGte,computed.${resultId}Abs,0.000001",eval:config.rounded,eval:config.raw`];
      for (const [index, exponent] of [6, 12, 18].entries()) {
        instructions.push(`set:config.coefficient${index},scope,computed.${resultId}E${exponent}`, `set:config.scientific${index},joinText,eval:config.coefficient${index}," × 10${exponent === 6 ? '⁶' : exponent === 12 ? '¹²' : '¹⁸'}"`, `set:config.display${index + 1},when,"all:scopeGte,computed.${resultId}Abs,${10 ** exponent}",eval:config.scientific${index},eval:config.display${index}`);
      }
      instructions.push('set:config.text,literal,eval:config.display3');
      return text(id, '', { fontSize: 'clamp(30px,5vw,48px)', fontWeight: '800', lineHeight: '1.08', letterSpacing: '-0.035em', overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }, { valueInstructions: instructions.join(';') });
    };
    const autoResults = [];
    const swapIds = [];
    const swap = (id, factor, condition) => {
      const swapId = button(id, '⇄ Intercambiar', `setScopeValue:${effectiveTo},${factor};submitScope`, { disabledWhenInvalidScope: true });
      components.find(component => component.id === swapId).condition = condition;
      swapIds.push(swapId);
    };
    for (const [index, prefix] of prefixes.entries()) {
      const rawId = `auto${index}`;
      const lower = index ? `all:scopeGte,computed.baseAbs,${promotion(prefix.factor)}` : 'all:scopeGt,computed.baseAbs,0';
      const upper = index < prefixes.length - 1 ? `;all:scopeLt,computed.baseAbs,${promotion(prefixes[index + 1].factor)}` : '';
      const zero = prefix.id === 'base' ? ';any:scopeEq,computed.baseAbs,0' : '';
      const condition = `${lower}${upper}${zero};all:scopeEq,values.${to},${AUTO}`;
      const numeric = numericalText(`${p}AutoNumber${index}`, rawId, peScale * prefix.factor);
      text(`${p}AutoUnit${index}`, prefixedSymbol(prefix), { fontSize: '21px', fontWeight: '700', marginTop: '4px', overflowWrap: 'anywhere' });
      text(`${p}AutoPrefix${index}`, `Prefijo automático · ${prefix.name}`, { fontSize: '12px', marginTop: '12px' });
      const result = box(`${p}AutoResult${index}`, [numeric, `${p}AutoUnit${index}`, `${p}AutoPrefix${index}`]);
      components.find(component => component.id === result).condition = condition;
      autoResults.push(result);
      swap(`${p}SwapAuto${index}`, peScale * prefix.factor, condition);
    }
    const manualNumber = numericalText(`${p}ManualNumber`, 'manual', to);
    const manualUnitInstructions = [];
    for (const [index, unit] of units.entries()) {
      manualUnitInstructions.push(`set:config.unit${index},when,"all:scopeEq,values.${to},${unit.factor}","${unit.display}",${index ? `eval:config.unit${index - 1}` : '""'}`);
      swap(`${p}SwapManual${index}`, unit.factor, `all:scopeEq,values.${to},${unit.factor}`);
    }
    manualUnitInstructions.push(`set:config.text,literal,eval:config.unit${units.length - 1}`);
    text(`${p}ManualUnit`, '', { fontSize: '21px', fontWeight: '700', marginTop: '4px' }, { valueInstructions: manualUnitInstructions.join(';') });
    const manualResult = box(`${p}ManualResult`, [manualNumber, `${p}ManualUnit`, text(`${p}ManualHint`, 'Unidad elegida por ti', { fontSize: '12px', marginTop: '12px' })]);
    components.find(component => component.id === manualResult).condition = `not:scopeEq,values.${to},${AUTO}`;
    button(`${p}Clear`, 'Limpiar', `setScopeValue:${amount},`);
    button(`${p}Example`, '↗ Ejemplo', 'resetScope');
    box(`${p}Actions`, [...swapIds, `${p}Clear`, `${p}Example`], { display: 'flex', flexWrap: 'wrap', gap: '8px' });
    box(`${p}Fields`, [`${p}Amount`, `${p}Units`, `${p}InputHint`, `${p}Actions`], { display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '0' });

    const illustrationFallback = { force: 'energy', power: 'energy', acceleration: 'speed', frequency: 'time', pressure: 'area', mass_density: 'volume' };
    const asset = assets[kind] ?? assets[illustrationFallback[kind]];
    const imageUrl = typeof asset === 'string' ? asset : asset?.publicUrl ?? asset?.src;
    const figure = imageUrl ? add(`${p}Icon`, 'media', { tag: 'image', src: imageUrl, alt: '', width: 80, height: 80, loading: 'lazy', styles: { width: '72px', height: '72px', objectFit: 'contain' } }) : text(`${p}Icon`, 'PE', { fontSize: '25px', fontWeight: '800', border: `2px solid ${ink}`, borderRadius: '50%', width: '58px', height: '58px', display: 'grid', placeItems: 'center' });
    box(`${p}ResultHeader`, [text(`${p}ResultLabel`, '≈ TU RESULTADO', { fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }), figure], { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' });
    const success = box(`${p}Success`, [`${p}ResultHeader`, ...autoResults, manualResult, text(`${p}Joke`, joke, { fontSize: '13px', marginTop: '16px' }), text(`${p}Copy`, 'Selecciona el resultado para copiarlo. Todo se calcula aquí.', { fontSize: '11px', marginTop: '10px' })], { userSelect: 'text' }, { role: 'status', ariaLive: 'polite', ariaLabel: `Resultado de ${label.toLowerCase()}` });
    components.find(component => component.id === success).condition = 'all:scopeEq,meta.valid,true';
    const empty = box(`${p}Empty`, [text(`${p}EmptyHeading`, 'El pug espera\ntu número.', { fontSize: '28px', fontWeight: '800', whiteSpace: 'pre-line' }), text(`${p}EmptyText`, 'Corrige la cantidad o toca Ejemplo para seguir jugando.', { fontSize: '13px', marginTop: '12px' })], {}, { role: 'status', ariaLive: 'polite' });
    components.find(component => component.id === empty).condition = 'not:scopeEq,meta.valid,true';
    box(`${p}Result`, [success, empty], { background: '#dcefdc', border: `2px solid ${ink}`, borderRadius: '15px', padding: '20px', minWidth: '0', minHeight: '200px', boxSizing: 'border-box' });
    box(`${p}Grid`, [`${p}Fields`, `${p}Result`], { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: '20px', alignItems: 'start' });
    const exact = pe.scaleToSI.denominator === '1' ? pe.scaleToSI.numerator : `${pe.scaleToSI.numerator}/${pe.scaleToSI.denominator}`;
    text(`${p}Definition`, `1 ${peSymbol} = ${exact} ${symbol(pe.siUnit)} · factor exacto del sistema PE.`, { fontSize: '12px', marginTop: '15px', fontWeight: '700' });
    const wholeUnit = kind === 'area' ? 'En área, m(PE_L²) = 0.001 × PE_L². Es mili del área completa; no (mPE_L)².' : kind === 'volume' ? 'En volumen, m(PE_L³) = 0.001 × PE_L³. Es mili del volumen completo; no (mPE_L)³.' : 'μ = micro · m = mili · k = kilo · M = mega · G = giga. El prefijo multiplica la unidad completa.';
    text(`${p}PrefixNote`, wholeUnit, { fontSize: '12px', marginTop: '6px' });
    scopedIds.push(add(`${p}Scope`, 'interaction-scope', {
      scopeId: p, tag: 'div', initialValues: { [amount]: example, [from]: fromDefault, [to]: AUTO, [effectiveTo]: peScale }, computations,
      components: [`${p}Grid`, `${p}Definition`, `${p}PrefixNote`],
      submitEventInstructions: `setScopeValue:${amount},event.eventData.computed.swapResult;setScopeValue:${from},event.eventData.values.${effectiveTo};setScopeValue:${to},event.eventData.values.${from}`,
    }, { condition: `all:scopeEq,values.iiCalcMagnitude,${kind}` }));
  }
  add('iiCalcMagnitudeControl', 'input', { ...dropdown, fieldId: 'iiCalcMagnitude', label: '¿Qué vas a medir?', value: 'length', options: groups.map(([value, label]) => ({ value, label })) });
  box('iiCalcMagnitudeRow', ['iiCalcMagnitudeControl'], { maxWidth: '350px', marginBottom: '18px' });
  add('iiCalcOuterScope', 'interaction-scope', { scopeId: 'iiCalcOuter', tag: 'div', initialValues: { iiCalcMagnitude: 'length' }, components: ['iiCalcMagnitudeRow', ...scopedIds] });
  text('iiCalcLimitNote', 'Vista aproximada: hasta 6 decimales; extremos en notación científica. Cero o magnitud absoluta de 1e-100 a 1e15 en SI. El valor completo se conserva al intercambiar.', { fontSize: '11px', marginTop: '18px', opacity: '0.85' });
  const rootId = box('iiCalcRoot', ['iiCalcOuterScope', 'iiCalcLimitNote'], { background: '#fffdf5', border: `2px solid ${ink}`, borderRadius: '20px', boxShadow: `5px 5px 0 ${ink}20`, padding: 'clamp(16px,3vw,28px)', boxSizing: 'border-box', width: '100%', fontFamily: 'Arial, sans-serif', color: ink });
  const combos = {
    iiCalcInput: ['ank-width-100per', 'ank-boxSizing-borderMINbox', 'ank-minHeight-46px', 'ank-padding-11px', 'ank-border-2px__solid__HASH163b55', 'ank-borderRadius-10px', 'ank-bg-HASHfffdf5', 'ank-color-HASH163b55', 'ank-fontFamily-Arial', 'ank-fontSize-16px', 'ank-textAlign-left', 'ank-whiteSpace-normal'],
    iiCalcButton: ['ank-cursor-pointer', 'ank-fontFamily-Arial'],
    iiCalcMenu: ['ank-bg-HASHfffdf5', 'ank-color-HASH163b55', 'ank-border-2px__solid__HASH163b55', 'ank-borderRadius-10px', 'ank-padding-5px', 'ank-maxHeight-280px', 'ank-overflowY-auto', 'ank-minWidth-160px'],
    iiCalcOption: ['ank-display-block', 'ank-padding-10px', 'ank-color-HASH163b55', 'ank-fontFamily-Arial', 'ank-fontSize-14px', 'ank-textDecoration-none', 'ank-borderRadius-6px', 'ank-cursor-pointer', 'ank-bgHover-HASHd8ebfc'],
  };
  return { components, rootId, combos };
}
