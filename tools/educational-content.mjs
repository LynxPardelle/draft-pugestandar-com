// Authoring-time content only. The returned definitions use native draft components.
export function educationalContent() {
  const components = [];
  const palette = { ink: '#20241f', blue: '#1749c7', muted: '#575c54', rule: '#d9d7cc' };
  const add = (id, type, config) => {
    const componentId = `peEdu${id}`;
    components.push({ id: componentId, type, config });
    return componentId;
  };
  const text = (id, value, tag = 'p', styles = {}, extra = {}) => add(id, 'text', {
    tag, text: value,
    styles: { margin: '0', color: palette.ink, 'line-height': '1.65', ...styles },
    ...extra,
  });
  const container = (id, children, styles = {}, extra = {}) => add(id, 'container', {
    tag: 'div', components: children,
    styles: { 'min-width': '0', ...styles }, ...extra,
  });
  const grid = (id, children) => container(id, children, {
    display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: '2rem', 'margin-top': '2.5rem',
  });
  const eyebrow = (id, label) => text(id, label, 'p', {
    color: palette.blue, 'font-size': '0.75rem', 'font-weight': '700',
    'letter-spacing': '0.13em', 'text-transform': 'uppercase',
  });
  const heading = (id, label) => text(id, label, 'h2', {
    'font-family': 'Georgia, serif', 'font-size': 'clamp(2rem, 4.2vw, 3.25rem)',
    'font-weight': '400', 'line-height': '1.1', 'letter-spacing': '-0.035em',
    'max-width': '24ch', 'margin-top': '0.75rem', 'margin-bottom': '1.25rem',
  }, { id: `peEdu${id}` });
  const section = (id, anchor, children) => container(id, children, {
    'box-sizing': 'border-box', width: '100%', 'max-width': '1160px', margin: '0 auto',
    padding: 'clamp(3rem, 7vw, 6rem) clamp(1.25rem, 4vw, 2.5rem)',
    'border-top': `1px solid ${palette.rule}`, 'scroll-margin-top': '6rem',
  }, {
    tag: 'section', id: anchor,
    ariaLabelledby: components.find(component => children.includes(component.id) && component.config.tag === 'h2')?.config.id,
  });

  const bases = [
    ['Length', '01 / LONGITUD', '30 cm', '1 PE_L = 0.30 m',
      'La altura de referencia que inicia el sistema. Es una convención fija; no representa el largo total de un perro.'],
    ['Mass', '02 / MASA', '7.2 kg', '1 PE_M = 7.2 kg',
      'El proyecto elige el punto medio convencional entre 6.3 y 8.1 kg: (6.3 + 8.1) ÷ 2 = 7.2 kg. Así define una masa de referencia, no el peso ideal de cada pug.'],
    ['Time', '03 / TIEMPO', '0.6 s', '1 PE_T = 0.6 s',
      'El proyecto toma una cadencia convencional de 100 latidos por minuto: 60 s ÷ 100 = 0.6 s por latido-pug. Es un intervalo elegido, no un latido medido ni una frecuencia objetivo.'],
  ].map(([id, label, value, equality, description]) => container(`Base${id}`, [
    eyebrow(`Base${id}Label`, label),
    text(`Base${id}Value`, value, 'h3', {
      'font-family': 'Georgia, serif', 'font-size': 'clamp(2.75rem, 5vw, 4rem)',
      'font-weight': '400', 'line-height': '1.1', 'letter-spacing': '-0.045em', margin: '1rem 0',
    }, { ariaLabel: `${label.split(' / ')[1].toLowerCase()}: ${value}` }),
    text(`Base${id}Equality`, equality, 'p', {
      color: palette.blue, 'font-family': 'monospace', 'font-size': '0.95rem', 'margin-bottom': '0.8rem',
    }),
    text(`Base${id}Description`, description, 'p', { color: palette.muted, 'font-size': '0.95rem' }),
  ]));

  const system = section('System', 'sistema', [
    eyebrow('SystemLabel', 'EL SISTEMA / PUG ESTÁNDAR'),
    heading('SystemHeading', 'Tres referencias. Muchas formas de medir.'),
    text('SystemIntro', 'Pug Estándar convierte una idea juguetona en un sistema de unidades: elegimos tres referencias fijas y construimos las demás con multiplicaciones, divisiones y potencias.', 'p', { 'max-width': '66ch', 'font-size': '1.125rem' }),
    grid('Bases', bases),
    text('SystemConvention', 'Los valores pertenecen a la convención del proyecto v0.2.0. No describen al pug promedio ni son objetivos de salud.', 'p', {
      'max-width': '72ch', color: palette.muted, 'font-size': '0.9rem', 'margin-top': '2rem',
    }),
  ]);

  const derivedRows = [
    { id: 'pe_area', name: 'Superficie · PE_L²', factor: '9/100 m² = 0.09 m²' },
    { id: 'pe_volume', name: 'Volumen · PE_L³', factor: '27/1000 m³ = 27 L' },
    { id: 'pe_speed', name: 'Velocidad · PE_V', factor: '1/2 m/s = 0.5 m/s' },
    { id: 'pe_acceleration', name: 'Aceleración · PE_A', factor: '5/6 m/s² ≈ 0.833333 m/s²' },
    { id: 'pe_frequency', name: 'Frecuencia · PE_FQ', factor: '5/3 Hz ≈ 1.66667 Hz' },
    { id: 'pe_force', name: 'Fuerza · PE_F', factor: '6 N' },
    { id: 'pe_energy', name: 'Energía · PE_E', factor: '9/5 J = 1.8 J' },
    { id: 'pe_power', name: 'Potencia · PE_POT', factor: '3 W' },
    { id: 'pe_pressure', name: 'Presión · PE_PR', factor: '200/3 Pa ≈ 66.6667 Pa' },
    { id: 'pe_density', name: 'Densidad · PE_D', factor: '800/3 kg/m³ ≈ 266.667 kg/m³' },
  ];
  const derivedTable = add('DerivedTable', 'generic-table', {
    id: 'peEduDerivedTable', rows: derivedRows, rowIdPath: 'id', sortable: false,
    pagination: { enabled: false }, selection: { enabled: false }, emitOnRowClick: false,
    columns: [
      { id: 'name', header: 'Unidad derivada', valuePath: 'name', format: 'text',
        cellClasses: 'ank-p-12px', valueClasses: 'ank-fontSize-14px ank-lineHeight-1_5' },
      { id: 'factor', header: '1 unidad equivale a', valuePath: 'factor', format: 'text',
        cellClasses: 'ank-p-12px', valueClasses: 'ank-fontSize-14px ank-lineHeight-1_5' },
    ],
    tableWrapperClasses: 'ank-overflowX-auto',
    tableClasses: 'ank-w-100per ank-bg-transparent',
    headerCellClasses: 'ank-p-12px ank-fontSize-12px ank-fontWeight-bold',
  });
  const auxiliaries = [
    ['Length', 'Largo auxiliar', 'PE_LA', '45 cm = 1.5 PE_L', 'Otra referencia de longitud, distinta de la altura base de 30 cm.'],
    ['Breath', 'Respiración auxiliar', 'PE_R', '3 s = 5 PE_T', 'Una duración convencional; el nombre no supone medir una respiración real.'],
    ['Life', 'Vida auxiliar', 'PE_VI', '12 años convencionales', 'Cada año tiene 365.25 días. Así, 1 PE_VI = 4383 días = 378691200 s. No predice una vida biológica.'],
  ].map(([id, label, symbol, equality, description]) => container(`Aux${id}`, [
    text(`Aux${id}Symbol`, symbol, 'p', { color: palette.blue, 'font-family': 'monospace', 'font-size': '0.85rem' }),
    text(`Aux${id}Heading`, label, 'h3', { 'font-size': '1.125rem', 'font-weight': '600', 'margin-top': '0.5rem' }),
    text(`Aux${id}Equality`, equality, 'p', { 'font-size': '1rem', 'margin-top': '0.75rem' }),
    text(`Aux${id}Description`, description, 'p', { 'font-size': '0.9rem', color: palette.muted, 'margin-top': '0.5rem' }),
  ], { 'border-top': `1px solid ${palette.rule}`, 'padding-top': '1.25rem' }));

  const units = section('Units', 'unidades', [
    eyebrow('UnitsLabel', 'LAS UNIDADES / DE LO SIMPLE A LO COMPUESTO'),
    heading('UnitsHeading', 'El mismo mundo, en otra escala.'),
    text('UnitsIntro', 'Una superficie es PE_L × PE_L; una velocidad es PE_L ÷ PE_T. Las diez unidades de esta tabla se obtienen de las tres bases, sin redondear sus factores.', 'p', { 'max-width': '67ch' }),
    container('DerivedTableWrap', [derivedTable], { 'margin-top': '2rem', 'min-width': '0', overflow: 'auto' }),
    text('ApproximationNote', '“=” indica una equivalencia exacta. “≈” indica un decimal redondeado a seis cifras significativas.', 'p', { color: palette.muted, 'font-size': '0.85rem', 'margin-top': '0.8rem' }),
    text('AuxiliaryHeading', 'Tres referencias auxiliares', 'h3', { 'font-size': '1.4rem', 'font-weight': '500', 'margin-top': '3rem' }),
    grid('Auxiliaries', auxiliaries),
    container('Temperature', [
      eyebrow('TemperatureLabel', 'TEMPERATURA / UN PUNTO DE REFERENCIA'),
      text('TemperatureHeading', 'PE_TEMP = 38.5 °C', 'h3', {
        'font-family': 'Georgia, serif', 'font-size': 'clamp(1.75rem, 3vw, 2.5rem)',
        'font-weight': '400', 'line-height': '1.2', 'margin-top': '0.8rem',
      }),
      text('TemperatureEquality', '38.5 °C = 311.65 K = 101.3 °F', 'p', { color: palette.blue, 'font-family': 'monospace', 'margin-top': '0.9rem' }),
      text('TemperatureExplanation', 'PE_TEMP es un punto de referencia, no una unidad que se multiplica. Para comparar temperaturas, usamos una diferencia en grados o una razón de temperaturas absolutas en kelvin.', 'p', { 'max-width': '70ch', 'margin-top': '1rem' }),
      text('TemperatureExample', 'Por ejemplo, 40 °C está 1.5 °C por encima de la referencia. Su razón absoluta es 6263/6233 ≈ 1.00481. Esa razón no describe cuánto calor se siente ni un riesgo clínico.', 'p', { 'max-width': '70ch', color: palette.muted, 'font-size': '0.95rem', 'margin-top': '0.75rem' }),
    ], { 'border-left': `3px solid ${palette.blue}`, 'padding-left': 'clamp(1rem, 3vw, 2rem)', 'margin-top': '3rem' }),
  ]);

  const examples = [
    ['Height', 'UNA ALTURA DE EJEMPLO', '1.80 m = 6 PE_L', 'Divide 1.80 entre 0.30. Seis alturas de referencia suman exactamente esa longitud.'],
    ['Minute', 'UN MINUTO DE TU DÍA', '1 min = 100 PE_T', 'Un minuto tiene 60 segundos: 60 ÷ 0.6 = 100 latidos-pug convencionales.'],
    ['Speed', 'UN CAMBIO DE ESCALA', '18 km/h = 10 PE_V', '18 km/h son 5 m/s. Cada PE_V equivale a 0.5 m/s, así que el resultado es 10.'],
    ['Volume', 'UN VOLUMEN POR IMAGINAR', '10 L = 10/27 PE_L³', 'Eso es ≈ 0.370370 PE_L³. Un cubo de 30 cm por lado contiene 27 L; no representa el volumen de un perro.'],
  ].map(([id, label, result, explanation]) => container(`Example${id}`, [
    eyebrow(`Example${id}Label`, label),
    text(`Example${id}Result`, result, 'h3', {
      'font-family': 'Georgia, serif', 'font-size': '1.7rem', 'font-weight': '400',
      'line-height': '1.25', margin: '0.85rem 0',
    }),
    text(`Example${id}Explanation`, explanation, 'p', { color: palette.muted, 'font-size': '0.95rem' }),
  ], { 'padding-top': '1.25rem', 'border-top': `1px solid ${palette.rule}` }));
  const examplesSection = section('Examples', 'ejemplos', [
    eyebrow('ExamplesLabel', 'EJEMPLOS / PARA EMPEZAR A JUGAR'),
    heading('ExamplesHeading', 'Tu siguiente cálculo empieza aquí.'),
    text('ExamplesIntro', 'Prueba estas cantidades y luego cambia el número. La magnitud sigue siendo la misma; cambia la unidad con la que la cuentas.', 'p', { 'max-width': '65ch' }),
    grid('ExamplesGrid', examples),
    text('SpaceWink', 'Bitácora del pug espacial: antes de despegar, convertir la distancia. Después, buscar una siesta.', 'p', {
      color: palette.muted, 'font-family': 'Georgia, serif', 'font-style': 'italic',
      'font-size': '1.1rem', 'margin-top': '2.5rem', 'max-width': '56ch',
    }),
  ]);

  const faqItems = [
    ['What', '¿Qué es un Pug Estándar?', 'Es un sistema educativo de unidades con tres referencias base fijas: 0.30 m, 7.2 kg y 0.6 s. Su símbolo es PE. El nombre aporta la inspiración; las reglas permiten hacer conversiones consistentes.'],
    ['Real', '¿Tengo que medir a mi pug?', 'No. Los valores ya están definidos como convenciones del proyecto. No dependen de un perro en particular, ni deben interpretarse como promedios biológicos o metas de salud.'],
    ['Aux', '¿PE_L y PE_LA son lo mismo?', 'Son dos unidades de longitud diferentes. PE_L equivale a 30 cm y PE_LA a 45 cm. Por eso, 1 PE_LA = 1.5 PE_L. Especificar el símbolo evita confundir altura base y largo auxiliar.'],
    ['Rounding', '¿Por qué aparece el símbolo ≈?', 'Algunas conversiones producen decimales que no terminan. Por ejemplo, 1 PE_A = 5/6 m/s² ≈ 0.833333 m/s². La fracción expresa el factor exacto; el decimal facilita la lectura. Un factor exacto no vuelve exacta una medición de entrada.'],
    ['Temperature', '¿Por qué no divido los grados Celsius entre 38.5?', 'Celsius tiene un origen desplazado respecto al cero absoluto. PE_TEMP es una referencia de 38.5 °C: puedes restarla para obtener una diferencia. Para una razón absoluta, primero conviertes ambas temperaturas a kelvin.'],
    ['Compatibility', '¿Se puede convertir cualquier unidad en cualquier otra?', 'Solo entre unidades de la misma magnitud. Longitud y masa son distintas; energía y momento de fuerza también se distinguen aunque compartan dimensiones. En frecuencia se conserva el tipo de evento: latidos, respiraciones o vueltas.'],
  ].map(([id, title, content]) => ({ id: `peEduFaq${id}`, title, content }));
  const faq = add('FaqAccordion', 'accordion', {
    mode: 'multiple', allowToggle: true, renderMode: 'default', scrollBehavior: 'none',
    items: faqItems,
    containerClasses: 'ank-display-flex ank-flexDirection-column ank-gap-12px',
    defaultItemContainerClasses: 'ank-pb-12px',
    defaultItemButtonConfig: {
      classes: 'ank-w-100per ank-bg-transparent ank-color-inherit ank-border-0 ank-p-12px ank-textAlign-left ank-fontSize-18px ank-fontWeight-600 ank-lineHeight-1_4 ank-cursor-pointer',
      icon: 'add', iconPosition: 'after', iconClasses: 'ank-ml-12px',
    },
    defaultItemPanelClasses: 'ank-p-12px ank-fontSize-16px ank-lineHeight-1_7',
  });
  const faqSection = section('Questions', 'preguntas', [
    eyebrow('QuestionsLabel', 'PREGUNTAS FRECUENTES'),
    heading('QuestionsHeading', 'Curiosidad, con las unidades claras.'),
    text('QuestionsIntro', 'Abre una pregunta para explorar las reglas del sistema.', 'p', { color: palette.muted, 'margin-bottom': '1.5rem' }),
    faq,
  ]);
  const publicReferences = [
    ['NistUnits', 'NIST · Unidades base y derivadas', 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes'],
    ['NistQuantities', 'NIST · Masa, peso e intervalos de temperatura', 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-8'],
    ['JulianYear', 'JPL · Día y año juliano', 'https://ssd.jpl.nasa.gov/astro_par.html'],
  ].map(([id, label, href]) => add(`Source${id}`, 'link', {
    href, text: `${label} ↗`, target: '_blank', rel: 'noopener noreferrer',
    ariaLabel: `${label} (en inglés; abre otra pestaña)`,
    styles: {
      display: 'inline-block', color: palette.blue, 'line-height': '1.6',
      'font-size': '0.95rem', 'text-underline-offset': '0.2em',
      padding: '0.5rem 0', 'overflow-wrap': 'anywhere',
    },
  }));
  const sources = section('Sources', 'fuentes', [
    eyebrow('SourcesLabel', 'FUENTES Y CONVENCIONES'),
    heading('SourcesHeading', 'Una idea lúdica. Reglas explícitas.'),
    text('SourcesProject', 'Las definiciones, factores y ejemplos de esta página siguen la especificación del proyecto Pug Estándar v0.2.0. Las equivalencias se expresan respecto al Sistema Internacional de Unidades (SI).', 'p', { 'max-width': '72ch' }),
    text('SourcesOrigins', 'En esa especificación, la masa base se fija en el punto medio de 6.3 y 8.1 kg; el tiempo base se obtiene del intervalo de una cadencia elegida de 100 latidos por minuto. Son las decisiones que originan 7.2 kg y 0.6 s, no reglas médicas para un animal.', 'p', { 'max-width': '72ch', 'margin-top': '1rem', color: palette.muted }),
    text('SourcesVersion', 'Esta primera colección reúne tres unidades base, tres auxiliares y diez derivadas. PE_TEMP se presenta aparte como referencia de temperatura. Los años auxiliares son convencionales, de 365.25 días.', 'p', { 'max-width': '72ch', 'margin-top': '1rem', color: palette.muted }),
    text('SourcesReferencesIntro', 'Para explorar las unidades SI y el año juliano, estas referencias públicas ofrecen el contexto metrológico. Las definiciones PE pertenecen al proyecto; no fueron emitidas por NIST ni JPL.', 'p', { 'max-width': '72ch', 'margin-top': '1rem', color: palette.muted }),
    container('PublicReferences', publicReferences, { display: 'flex', 'flex-direction': 'column', 'align-items': 'flex-start', 'margin-top': '0.75rem' }),
    text('SourcesScope', 'Pug Estándar es una convención educativa del proyecto. No es un estándar oficial del SI ni una herramienta de evaluación veterinaria.', 'p', { 'max-width': '72ch', 'margin-top': '1rem', color: palette.muted, 'font-size': '0.9rem' }),
  ]);

  return { components, rootIds: [system, units, examplesSection, faqSection, sources] };
}
