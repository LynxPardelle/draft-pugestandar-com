import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { educationalContent } from './educational-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const domain = 'pugestandar.com';
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'tools/data/pe-catalog-v0.2.0.json'), 'utf8'));
const byId = new Map(catalog.units.map(u => [u.id, u]));
const assets = JSON.parse(fs.readFileSync(path.join(root, 'tools/data/public-assets.json'), 'utf8'));
const { hero, companion } = assets;
const c = [];
const add = (id,type,config,extra={}) => { c.push({id,type,config,...extra}); return id; };
const text = (id,content,styles={},tag='p',extra={}) => add(id,'text',{tag,text:content,styles:{margin:'0',fontWeight:'400',...styles}},extra);
const box = (id,children,styles={},extra={},tag='div') => add(id,'container',{tag,components:children,styles,...extra});
const link = (id,label,href,styles={}) => add(id,'link',{href,text:label,styles:{color:'inherit',textDecoration:'none',fontWeight:'650',...styles}});
const button = (id,label,instructions,secondary=false,extra={}) => add(id,'button',{type:'button',label,classes:'ank-peButton',styles:{background:secondary?'transparent':'#1749c7',color:secondary?'#1749c7':'#fff',border:secondary?'1px solid #c5cde4':'1px solid #1749c7',borderRadius:'10px',padding:'12px 18px',minHeight:'46px',fontWeight:'650'},...extra},{eventInstructions:instructions});
const F = fieldId => ({source:'field',fieldId});
const L = value => ({source:'literal',value});
const op = (name,value) => ({op:name,value:typeof value==='string'?F(value):L(value)});
const gcd = (a,b) => b ? gcd(b,a%b) : a;
const lcm = (a,b) => a/gcd(a,b)*b;
// Keep natural numeric notation outside the range where eight-place rounding is useful.
const formatted = (dest='text',si=false) => `set:config.raw,scope,computed.${si?'siRaw':'result'};set:config.rounded,scope,computed.${si?'siRounded':'resultRounded'};set:config.${dest},when,"all:scopeGte,computed.${si?'siAbs':'resultAbs'},0.00000001;all:scopeLte,computed.${si?'siAbs':'resultAbs'},10000000",eval:config.rounded,eval:config.raw`;
const display = s => s.replaceAll('^2','²').replaceAll('^3','³').replace('a_J','año (365.25 días)');
export const groups = [
  ['length','Longitud','pe_length',['mm','cm','m','km','pe_length','pe_length_aux'],1.8,'m','Tu mundo, medido de patitas a cabeza.'],
  ['mass','Masa','pe_mass',['g','kg','tonne','pe_mass'],90,'kg','La unidad no cambia aunque aparezcan las croquetas.'],
  ['time','Tiempo','pe_time',['s','minute','hour','day','julian_year','pe_time','pe_breath','pe_life'],1,'minute','El snack sigue sin aparecer.'],
  ['area','Área','pe_area',['cm2','m2','ha','pe_area'],20,'m2','Superficie; no es el número de perros que caben.'],
  ['volume','Volumen','pe_volume',['ml','liter','m3','pe_volume'],10,'liter','Un PE cúbico son 27 litros. El pug se queda fuera de la caja.'],
  ['speed','Velocidad','pe_speed',['m_s','km_h','pe_speed'],18,'km_h','Una escala de velocidad; ningún pug tiene que correr.'],
  ['acceleration','Aceleración','pe_acceleration',['m_s2','pe_acceleration'],1,'m_s2','Longitud dividida entre tiempo al cuadrado.'],
  ['frequency','Frecuencia','pe_frequency',['Hz','kHz','pe_frequency'],1,'Hz','Frecuencia genérica. No mezcla latidos y respiraciones.'],
  ['force','Fuerza','pe_force',['N','kN','pe_force'],6,'N','1 PE_F = 6 N. La masa de 7.2 kg es otra magnitud.'],
  ['energy','Energía','pe_energy',['J','kJ','Wh','kWh','pe_energy'],1,'kWh','También las pequeñas patas entienden de energía.'],
  ['power','Potencia','pe_power',['W','kW','pe_power'],60,'W','Energía por unidad de tiempo.'],
  ['pressure','Presión','pe_pressure',['Pa','kPa','bar','pe_pressure'],100,'Pa','Compara presiones del mismo tipo y con la misma referencia.'],
  ['mass_density','Densidad','pe_density',['kg_m3','g_cm3','pe_density'],1,'g_cm3','Masa entre volumen. No es la densidad de un perro.'],
];
const bodyStyles = {fontFamily:'Arial, Helvetica, sans-serif',background:'#f5f1e8',color:'#20241f',lineHeight:'1.5',minHeight:'100vh',overflowX:'clip'};
const wrap = {maxWidth:'1160px',margin:'0 auto',padding:'0 clamp(18px,4vw,40px)',boxSizing:'border-box'};
const small = {fontSize:'12px',letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:'700'};
const fld = {classes:'ank-display-block ank-width-100per ank-fontFamily-Arial',labelClasses:'ank-display-block ank-fontFamily-Arial ank-fontSize-13px ank-fontWeight-700 ank-marginBottom-8px',helperTextClasses:'ank-display-block ank-fontFamily-Arial ank-fontSize-12px ank-color-HASH62685f ank-marginTop-8px',errorClasses:'ank-color-HASHa52121 ank-fontFamily-Arial ank-fontSize-13px ank-display-block ank-marginTop-8px',fieldClasses:'ank-width-100per ank-boxSizing-borderMINbox',inputClasses:'ank-peField'};
const dropdown = { ...fld,controlType:'select',dropdownTriggerClasses:'ank-display-flex ank-alignItems-center ank-justifyContent-spaceMINbetween ank-gap-12px ank-width-100per',dropdownIndicatorText:'⌄',dropdownConfig:{renderMode:'overlay',overlayMatchWidth:'origin',buttonClasses:'ank-peField ank-cursor-pointer',menuContainerClasses:'ank-peMenu',menuListClasses:'ank-listStyle-none ank-padding-0 ank-margin-0',itemLinkClasses:'ank-peOption',selectedItemClasses:'ank-bg-HASHe9eefc',disabledItemClasses:'ank-opacity-50per'}};

link('peSkip','Saltar a la calculadora','#calculadora',{display:'block',padding:'6px 20px',fontSize:'12px',background:'#e9eefc',color:'#1749c7',textAlign:'center'});
box('peBrand',[text('peMark','PE',{background:'#1749c7',color:'white',borderRadius:'50%',width:'40px',height:'40px',display:'grid',placeItems:'center',fontWeight:'800',fontSize:'15px'}),text('peBrandName','Pug Estándar',{fontSize:'18px',fontWeight:'800',letterSpacing:'-0.04em'})],{display:'flex',gap:'10px',alignItems:'center'});
box('peNav',[link('peNavCalc','Calculadora','#calculadora'),link('peNavSystem','El sistema','#sistema'),link('peNavUnits','Unidades','#unidades')],{display:'flex',flexWrap:'wrap',gap:'clamp(14px,3vw,28px)',fontSize:'13px'}, {ariaLabel:'Principal'},'nav');
box('peHeader',['peBrand','peNav'],{...wrap,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',paddingTop:'22px',paddingBottom:'22px'}, {},'header');
text('peHeroKicker','UN SISTEMA DE MEDIDAS. MUCHAS ARRUGAS.',{...small,color:'#1749c7',marginBottom:'20px'});
text('peHeroTitle','Pug\nEstándar.',{fontSize:'clamp(56px,7.5vw,94px)',lineHeight:'0.94',fontWeight:'800',letterSpacing:'-0.065em',whiteSpace:'pre-line'},'h1');
text('peHeroSub','Mide el mundo en otras patas.',{fontSize:'clamp(20px,2.4vw,28px)',fontWeight:'600',letterSpacing:'-0.035em',marginTop:'22px'});
text('peHeroDescription','Convierte medidas cotidianas a PE. Las escalas son fijas; el pug puede seguir durmiendo.',{fontSize:'16px',maxWidth:'370px',color:'#62685f',marginTop:'12px'});
button('peHeroCta','Vamos a convertir  ↗','navigationToSection:calculadora');
box('peHeroActions',['peHeroCta',text('peHeroVersion','PE v0.2.0 · Vista de test',{fontSize:'11px',color:'#62685f'})],{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'18px',marginTop:'25px'});
box('peHeroCopy',['peHeroKicker','peHeroTitle','peHeroSub','peHeroDescription','peHeroActions'],{paddingTop:'24px',paddingBottom:'35px',position:'relative',zIndex:'1'});
add('peHeroPhoto','media',{tag:'image',src:hero,alt:'Un pug curioso junto a una cinta métrica azul.',width:1536,height:1024,loading:'eager',fetchPriority:'high',styles:{width:'100%',height:'100%',maxHeight:'430px',objectFit:'cover',objectPosition:'right center',mixBlendMode:'multiply',borderRadius:'24px'}});
box('peHero',['peHeroCopy','peHeroPhoto'],{...wrap,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,330px),1fr))',alignItems:'center',gap:'12px',paddingBottom:'35px'}, {},'section');

const scopeIds=[];
for(const [kind,label,peId,unitIds,example,exampleUnit,joke] of groups){
  const p=`pe_${kind}`;
  const us=unitIds.map(id=>{const u=byId.get(id);if(!u)throw new Error(`Missing ${id}`);return u});
  const common=us.reduce((a,u)=>lcm(a,BigInt(u.scaleToSI.denominator)),1n);
  const scaled = new Map(us.map(u=>[u.id,Number(BigInt(u.scaleToSI.numerator)*common/BigInt(u.scaleToSI.denominator))]));
  if([...scaled.values()].some(x=>!Number.isSafeInteger(x)||x<=0))throw new Error('Unsafe unit scale');
  const amount=`${p}Quantity`, from=`${p}From`, to=`${p}To`;
  const negative=['length','speed','acceleration','force','energy','power'].includes(kind);
  const numberRule={type:'pattern',value:'^[+-]?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)(?:[eE][+-]?(?:[0-9]{1,2}|1[0-9]{2}|200))?$',message:'Usa un número con punto decimal, por ejemplo 1.80. Sin comas; el exponente debe estar entre −200 y 200.'};
  const requiredRule={type:'required',message:'Escribe una cantidad o prueba el ejemplo.'};
  const amountConfig={...fld,fieldId:amount,controlType:'number',step:0.00000001,label:'Cantidad',value:example,placeholder:'Escribe una cantidad',helperText:'Usa punto decimal, sin separadores de miles.'};
  const validationInstructions=[];
  for(const [index,u] of us.entries()){
    const maximum=1e9*Number(common)/scaled.get(u.id);
    amountConfig[`rules_${u.id}`]=[requiredRule,numberRule,{type:'min',value:negative?-maximum:0,message:negative?`El límite inferior es −1e9 ${display(u.siUnit)} equivalentes.`:'Esta magnitud requiere un valor de cero o mayor.'},{type:'max',value:maximum,message:`El límite es 1e9 ${display(u.siUnit)} equivalentes. Cambiar la unidad conserva ese límite.`},{type:'maxLength',value:32,message:'Usa hasta 32 caracteres.'}];
    validationInstructions.push(`set:config.validation${index},when,"all:scopeEq,values.${from},${scaled.get(u.id)}",eval:config.rules_${u.id},eval:config.${index?`validation${index-1}`:`rules_${exampleUnit}`}`);
  }
  amountConfig.rules_tooSmall=[requiredRule,numberRule,{type:'pattern',value:'(?!)',message:`El valor es demasiado pequeño para esta vista: usa cero o al menos 1e-100 ${display(us[0].siUnit)} de magnitud absoluta.`}];
  validationInstructions.push(`set:config.validationMagnitude,when,"all:scopeGt,computed.siAbs,0;all:scopeLt,computed.siAbs,1e-100",eval:config.rules_tooSmall,eval:config.validation${us.length-1}`);
  validationInstructions.push('set:config.validation,literal,eval:config.validationMagnitude');
  add(`${p}Amount`,'input',amountConfig,{valueInstructions:validationInstructions.join(';')});
  const options=us.map(u=>({value:scaled.get(u.id),label:display(u.symbol)}));
  add(`${p}FromControl`,'input',{...dropdown,fieldId:from,label:'Desde',value:scaled.get(exampleUnit),options});
  add(`${p}ToControl`,'input',{...dropdown,fieldId:to,label:'Hasta',value:scaled.get(peId),options});
  box(`${p}UnitRow`,[`${p}FromControl`,`${p}ToControl`],{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'14px',marginTop:'20px'});
  button(`${p}Swap`,'⇄  Intercambiar','submitScope',true,{disabledWhenInvalidScope:true,disabledClasses:'ank-opacity-40per'});
  button(`${p}Clear`,'Limpiar',`setScopeValue:${amount},;setScopeValue:${p}Copy,false`,true);
  button(`${p}Example`,'↗  Probar ejemplo',`resetScope`,true);
  box(`${p}Actions`,[`${p}Swap`,`${p}Clear`,`${p}Example`],{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'22px'});
  const presetIds=[];
  if(kind==='time'){
    presetIds.push(button(`${p}LifeExample`,'24 años → PE_VI',`setScopeValue:${amount},24;setScopeValue:${from},${scaled.get('julian_year')};setScopeValue:${to},${scaled.get('pe_life')}`,true));
    presetIds.push(button(`${p}BreathExample`,'1 minuto → PE_R',`setScopeValue:${amount},1;setScopeValue:${from},${scaled.get('minute')};setScopeValue:${to},${scaled.get('pe_breath')}`,true));
  }
  if(kind==='length')presetIds.push(button(`${p}AuxExample`,'1.80 m → PE_LA',`setScopeValue:${amount},1.8;setScopeValue:${from},${scaled.get('m')};setScopeValue:${to},${scaled.get('pe_length_aux')}`,true));
  box(`${p}Presets`,presetIds,{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'14px'});
  box(`${p}Fields`,[`${p}Amount`,`${p}UnitRow`,`${p}Actions`,`${p}Presets`],{minWidth:'0',padding:'clamp(18px,3vw,30px)'});
  const targetOutputs=us.map(u=>text(`${p}Symbol_${u.id}`,display(u.symbol),{fontSize:'22px',color:'#c4d4ff',fontWeight:'600'},'span',{condition:`all:scopeEq,values.${to},${scaled.get(u.id)}`}));
  text(`${p}ResultLabel`,'TU MEDIDA EN OTRA ESCALA',{...small,color:'#ced9f8'});
  text(`${p}ResultValue`,'',{fontSize:'clamp(42px,5.6vw,70px)',fontWeight:'750',lineHeight:'1.1',letterSpacing:'-0.05em',overflowWrap:'anywhere',marginTop:'15px'},'p',{valueInstructions:formatted()});
  box(`${p}SymbolRow`,targetOutputs,{display:'flex',marginTop:'3px'});
  text(`${p}Approx`,'≈ Vista numérica · hasta 8 decimales o notación científica',{fontSize:'11px',color:'#dce5ff',marginTop:'16px'});
  text(`${p}Joke`,joke,{fontSize:'13px',color:'#dce5ff',marginTop:'14px'});
  text(`${p}Si`,'',{fontSize:'13px',marginTop:'18px'},'p',{valueInstructions:`${formatted('si',true)};set:config.text,concat,"Equivalencia SI: ≈ ",eval:config.si," ${display(us[0].siUnit)}"`});
  button(`${p}CopyButton`,'Ver texto para copiar',`setScopeValue:${p}Copy,true;focusElementById:${p}CopyText`,true,{styles:{border:'1px solid #b3c4ec',background:'transparent',color:'#fff',padding:'10px 14px',borderRadius:'10px',marginTop:'18px',minHeight:'44px'}});
  const copyOutputs=us.map(u=>text(`${p}Copy_${u.id}`,'',{fontSize:'15px',fontFamily:'monospace',overflowWrap:'anywhere'},'p',{condition:`all:scopeEq,values.${to},${scaled.get(u.id)}`,valueInstructions:`${formatted('num')};set:config.text,concat,"≈ ",eval:config.num," ${display(u.symbol)} · Pug Estándar v0.2.0"`}));
  text(`${p}CopyHint`,'Selecciona el texto y usa Copiar, o Ctrl/Cmd + C. En móvil, mantén pulsado el resultado.',{fontSize:'12px',color:'#dce5ff',marginBottom:'8px'});
  box(`${p}CopyText`,[`${p}CopyHint`,...copyOutputs],{marginTop:'16px',userSelect:'text'},{id:`${p}CopyText`,tabindex:-1});
  c.find(x=>x.id===`${p}CopyText`).condition=`all:scopeEq,values.${p}Copy,true`;
  box(`${p}Success`,[`${p}ResultLabel`,`${p}ResultValue`,`${p}SymbolRow`,`${p}Approx`,`${p}Joke`,`${p}Si`,`${p}CopyButton`,`${p}CopyText`],{}, {role:'status',ariaLive:'polite',ariaLabel:'Resultado de la conversión'});
  c.find(x=>x.id===`${p}Success`).condition='all:scopeEq,meta.valid,true';
  text(`${p}EmptyTitle`,'Ponle número\na la curiosidad.',{fontSize:'32px',fontWeight:'700',lineHeight:'1.2',whiteSpace:'pre-line'});
  text(`${p}EmptyBody`,'Escribe una cantidad válida o prueba el ejemplo. El pug pone la cara; tú pones el número.',{fontSize:'14px',color:'#dce5ff',marginTop:'16px'});
  box(`${p}Empty`,[`${p}EmptyTitle`,`${p}EmptyBody`],{}, {role:'status',ariaLive:'polite'});
  c.find(x=>x.id===`${p}Empty`).condition='not:scopeEq,meta.valid,true';
  box(`${p}Result`,[`${p}Success`,`${p}Empty`],{background:'#1749c7',color:'#fff',borderRadius:'18px',padding:'clamp(24px,3vw,32px)',minWidth:'0'});
  box(`${p}Grid`,[`${p}Fields`,`${p}Result`],{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,310px),1fr))',gap:'12px',alignItems:'stretch'});
  text(`${p}HowTitle`,'Así sale la cuenta',{fontSize:'16px',fontWeight:'750',marginBottom:'10px'},'h3');
  const howIds=[];
  for(const u of us)for(const v of us){
    const n=BigInt(u.scaleToSI.numerator)*BigInt(v.scaleToSI.denominator),d=BigInt(u.scaleToSI.denominator)*BigInt(v.scaleToSI.numerator),g=gcd(n,d);
    howIds.push(text(`${p}Formula_${u.id}_${v.id}`,'',{fontSize:'14px',fontFamily:'monospace',overflowWrap:'anywhere'},'p',{condition:`all:scopeEq,values.${from},${scaled.get(u.id)};all:scopeEq,values.${to},${scaled.get(v.id)}`,valueInstructions:`set:config.num,scope,values.${amount};set:config.text,concat,eval:config.num," ${display(u.symbol)} × (${n/g}/${d/g}) = resultado en ${display(v.symbol)}"`}));
  }
  text(`${p}Precision`,'La fracción muestra el factor exacto. El resultado usa aritmética numérica; intercambiar conserva el valor anterior al redondeo de pantalla. Rango de esta vista: cero o magnitud absoluta entre 1e-100 y 1e9 en la unidad SI.',{fontSize:'12px',color:'#62685f',marginTop:'8px'});
  box(`${p}How`,[`${p}HowTitle`,...howIds,`${p}Precision`],{padding:'22px 30px',borderTop:'1px solid #e8e5dc',marginTop:'14px'});
  c.find(x=>x.id===`${p}How`).condition='all:scopeEq,meta.valid,true';
  const steps=[op('multiply',from),op('divide',to)];
  const siSteps=[op('multiply',from),op('divide',Number(common))];
  const computations=[{resultId:'result',initial:F(amount),steps},{resultId:'resultAbs',initial:F(amount),steps:[...steps,{op:'abs'}]},{resultId:'resultRounded',initial:F(amount),steps:[...steps,{op:'round',precision:8}]},{resultId:'siRaw',initial:F(amount),steps:siSteps},{resultId:'siAbs',initial:F(amount),steps:[...siSteps,{op:'abs'}]},{resultId:'siRounded',initial:F(amount),steps:[...siSteps,{op:'round',precision:8}]}];
  scopeIds.push(add(`${p}Scope`,'interaction-scope',{scopeId:p,tag:'div',initialValues:{[amount]:example,[from]:scaled.get(exampleUnit),[to]:scaled.get(peId),[`${p}Copy`]:false},computations,components:[`${p}Grid`,`${p}How`],submitEventInstructions:`setScopeValue:${amount},event.eventData.computed.result;setScopeValue:${from},event.eventData.values.${to};setScopeValue:${to},event.eventData.values.${from};setScopeValue:${p}Copy,false`},{condition:`all:scopeEq,values.magnitude,${kind}`}));
}
text('peCalcKicker','01 / JUEGA CON LA ESCALA',{...small,color:'#1749c7'});
text('peCalcHeading','Tu calculadora PE.',{fontSize:'clamp(28px,4vw,42px)',fontWeight:'750',letterSpacing:'-0.045em',marginTop:'7px'},'h2');
text('peCalcHint','Elige una magnitud. Cambia un número. Mira el mundo de otra forma.',{fontSize:'15px',color:'#62685f',marginTop:'10px'});
box('peCalcIntro',['peCalcKicker','peCalcHeading','peCalcHint'],{marginBottom:'24px'});
add('peMagnitude','input',{...dropdown,fieldId:'magnitude',label:'Magnitud',value:'length',options:groups.map(([id,label])=>({value:id,label}))});
box('peMagnitudeWrap',['peMagnitude',text('peLive','●  Resultado al instante',{fontSize:'12px',color:'#48684a',whiteSpace:'nowrap'})],{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px',padding:'18px clamp(18px,3vw,30px)',borderBottom:'1px solid #e8e5dc',marginBottom:'4px'});
add('peCalculatorScope','interaction-scope',{scopeId:'peCalculator',tag:'div',initialValues:{magnitude:'length'},components:['peMagnitudeWrap',...scopeIds]});
box('peCalculatorPanel',['peCalculatorScope'],{background:'#fffdf8',border:'1px solid #deded5',borderRadius:'24px',padding:'8px',boxShadow:'0 14px 55px #252c1610'});
text('peCalculatorNote','Convenciones para aprender y comparar. No describen a un perro individual ni sustituyen consejo veterinario.',{fontSize:'12px',color:'#62685f',marginTop:'16px'});
box('peCalculator',['peCalcIntro','peCalculatorPanel','peCalculatorNote'],{...wrap,paddingTop:'26px',paddingBottom:'38px',scrollMarginTop:'20px'}, {id:'calculadora'},'section');

text('peTempTitle','La temperatura va por otro camino.',{fontSize:'27px',fontWeight:'750',letterSpacing:'-0.035em'},'h2');
text('peTempText','PE_TEMP es el punto de referencia 38.5 °C, no una unidad para dividir temperaturas. Compara la diferencia con ese punto.',{fontSize:'14px',color:'#62685f',marginTop:'12px'});
add('peTempInput','input',{...fld,fieldId:'peCelsius',controlType:'text',value:40,label:'Temperatura en °C',helperText:'Desde −273.15 °C. Usa punto decimal.',validation:[{type:'required',message:'Escribe una temperatura.'},{type:'pattern',value:'^[+-]?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)$',message:'Usa un número con punto decimal.'},{type:'min',value:-273.15,message:'La temperatura no puede ser menor al cero absoluto (−273.15 °C).'},{type:'max',value:1000000,message:'Máximo 1 000 000 °C en esta vista.'},{type:'maxLength',value:24,message:'Usa hasta 24 caracteres.'}]});
text('peTempDifference','',{fontSize:'22px',fontWeight:'700',color:'#1749c7',marginTop:'14px'},'p',{valueInstructions:'set:config.n,scope,computed.delta;set:config.text,concat,"Diferencia: ",eval:config.n," °C respecto a PE_TEMP"',condition:'all:scopeEq,meta.valid,true'});
text('peTempKelvin','',{fontSize:'14px',color:'#62685f',marginTop:'8px'},'p',{valueInstructions:'set:config.n,scope,computed.kelvin;set:config.text,concat,eval:config.n," K · la referencia es 311.65 K"',condition:'all:scopeEq,meta.valid,true'});
add('peTempScope','interaction-scope',{scopeId:'peTemperature',tag:'div',initialValues:{peCelsius:40},computations:[{resultId:'delta',initial:F('peCelsius'),steps:[op('subtract',38.5),{op:'round',precision:8}]},{resultId:'kelvin',initial:F('peCelsius'),steps:[op('add',273.15),{op:'round',precision:8}]}],components:['peTempInput','peTempDifference','peTempKelvin']});
box('peTempCopy',['peTempTitle','peTempText'],{maxWidth:'460px'});
box('peTemperature',['peTempCopy','peTempScope'],{...wrap,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,290px),1fr))',gap:'30px',paddingTop:'40px',paddingBottom:'48px',borderBottom:'1px solid #dadbd2'}, {id:'temperatura'},'section');

const edu=educationalContent(); c.push(...edu.components);
add('peCompanion','media',{tag:'image',src:companion,alt:'Un pug descansa junto a un bloque azul y una cinta métrica.',loading:'lazy',width:1536,height:1024,styles:{width:'100%',height:'290px',objectFit:'cover',objectPosition:'center 65%',borderRadius:'18px'}});
text('peOutroTitle','Una última conversión\nantes de la siesta.',{fontSize:'clamp(28px,4vw,44px)',fontWeight:'750',lineHeight:'1.05',letterSpacing:'-0.045em',whiteSpace:'pre-line'},'h2');
button('peAgain','Volver a jugar  ↑','navigationToSection:calculadora');
box('peOutroCopy',['peOutroTitle','peAgain'],{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'25px',justifyContent:'center'});
box('peOutro',['peCompanion','peOutroCopy'],{...wrap,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,310px),1fr))',gap:'30px',paddingTop:'20px',paddingBottom:'60px'}, {},'section');
text('peFooterName','Pug Estándar · PE v0.2.0',{fontWeight:'750',fontSize:'15px'});
text('peFooterNote','El pug aporta las arrugas. Las matemáticas hacen el resto.',{fontSize:'12px',color:'#62685f',marginTop:'5px'});
text('pePrivacy','Cálculos en tu dispositivo · Sin cuenta · Sin historial de conversiones',{fontSize:'11px',color:'#62685f'});
box('peFooter',['peFooterName','peFooterNote','pePrivacy'],{...wrap,borderTop:'1px solid #d9ddd2',paddingTop:'25px',paddingBottom:'30px'}, {},'footer');
box('peMain',['peHero','peCalculator',...edu.rootIds,'peTemperature','peOutro'],{}, {id:'contenido'},'main');
box('pePage',['peSkip','peHeader','peMain','peFooter'],bodyStyles);

for(const component of c){
  if(component.valueInstructions) component.valueInstructions=component.valueInstructions.replaceAll(',concat,',',joinText,');
  if(component.type==='text') component.config.styles={fontWeight:'400',...component.config.styles};
}
const write=(name,data)=>{
  if(name==='site-config.json'){
    const palette=data.site.theme.palettes.light;
    data.site.theme.palettes.dark={...palette};
    delete data.site.seo.robots;
  }
  const f=path.join(root,name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(data,null,2).replaceAll('ank-peField','peField').replaceAll('ank-peMenu','peMenu').replaceAll('ank-peOption','peOption').replaceAll('ank-peButton','peButton').replaceAll('ank-hover-transform','ank-transformHover').replaceAll('ank-hover-bg','ank-bgHover')+'\n');
};
write('site-config.json',{version:1,domain,aliases:[],defaultPageId:'default',routes:[{path:'/',pageId:'default',label:'Pug Estándar'}],site:{appIdentity:{identifier:'pugestandar',name:'Pug Estándar',version:'0.2.0',description:'Calculadora educativa de unidades Pug Estándar.'},theme:{defaultMode:'light',palettes:{light:{bgColor:'#f5f1e8',textColor:'#20241f',titleColor:'#20241f',linkColor:'#1749c7',accentColor:'#1749c7',secondaryBgColor:'#e9eefc',secondaryTextColor:'#62685f',secondaryTitleColor:'#20241f',secondaryLinkColor:'#1749c7',secondaryAccentColor:'#1749c7',successColor:'#35603b',onSuccessColor:'#ffffff',errorColor:'#a52121',onErrorColor:'#ffffff',warningColor:'#866419',onWarningColor:'#ffffff',infoColor:'#1749c7',onInfoColor:'#ffffff'}}},seo:{siteName:'Pug Estándar',title:'Pug Estándar | Calculadora de unidades PE',description:'Convierte medidas a Pug Estándar: longitud, masa, tiempo y diez magnitudes derivadas. Ejemplos y explicación de cada cálculo.',canonicalOrigin:'https://pugestandar.com',robots:'noindex,nofollow',defaultImage:hero,openGraph:{type:'website',site_name:'Pug Estándar'},twitter:{card:'summary_large_image'}},i18n:{defaultLanguage:'es',supportedLanguages:[{code:'es',label:'ES'}]}},runtime:{analytics:{enabled:false,consentUI:'none',track:[]},features:{debugMode:false}},environments:{test:{aliases:[]}}});
write('default/page-config.json',{version:1,pageId:'default',domain,rootIds:['pePage'],modalRootIds:[],seo:{title:{es:'Pug Estándar | Calculadora de unidades PE'},description:{es:'Mide el mundo en otras patas. Calculadora PE con ejemplos y resultados explicados.'},canonical:'https://pugestandar.com/',robots:'noindex,nofollow'},metadata:{status:'test-draft',systemVersion:'0.2.0'}});
write('default/components.json',{version:1,pageId:'default',domain,components:c});
write('components.json',{version:1,pageId:'allPages',domain,components:[]});
write('variables.json',{version:1,pageId:'allPages',domain,variables:{}});
write('default/variables.json',{version:1,pageId:'default',domain,variables:{systemVersion:'0.2.0'}});
write('angora-combos.json',{version:1,pageId:'allPages',domain,combos:{peField:['ank-width-100per','ank-boxSizing-borderMINbox','ank-minHeight-48px','ank-padding-12px','ank-border-1px__solid__HASHcdd2c9','ank-borderRadius-10px','ank-bg-HASHfffdf8','ank-color-HASH20241f','ank-fontSize-16px','ank-textAlign-left'],peButton:['ank-cursor-pointer','ank-fontFamily-Arial','ank-transition-transform__180ms__ease','ank-hover-transform-translateYSDMIN2pxED'],peMenu:['ank-bg-HASHfffdf8','ank-color-HASH20241f','ank-border-1px__solid__HASHcdd2c9','ank-borderRadius-10px','ank-padding-6px','ank-maxHeight-300px','ank-overflowY-auto','ank-minWidth-180px'],peOption:['ank-display-block','ank-padding-12px','ank-color-HASH20241f','ank-fontSize-15px','ank-textDecoration-none','ank-borderRadius-6px','ank-cursor-pointer','ank-hover-bg-HASHe9eefc']}});
write('default/i18n/es.json',{version:1,pageId:'default',domain,lang:'es',dictionary:{}});
write('i18n/es.json',{version:1,pageId:'allPages',domain,lang:'es',dictionary:{}});
write('default/angora-combos.json',{version:1,pageId:'default',domain,combos:{}});
console.log(`Built ${c.length} native components, ${groups.length} magnitudes, 16 PE units; ${hero.startsWith('https:')?'CDN':'local'} imagery.`);
