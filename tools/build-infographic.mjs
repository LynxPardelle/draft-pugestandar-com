import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {infographicCalculator} from './infographic-calculator.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const domain='pugestandar.com',pageId='infografico';
const manifest=JSON.parse(fs.readFileSync(path.join(root,'tools/data/infographic-assets.json'),'utf8'));
const assets=Object.fromEntries(manifest.assets.map(a=>[a.key,a.publicUrl]));
const C=[],ink='#163b55',paper='#fffdf5',blue='#d8ebfc',green='#dcefdc',purple='#eee1fa',peach='#ffe8c2';
const font='Trebuchet MS, Arial, sans-serif';
const add=(id,type,config,extra={})=>{C.push({id,type,config,...extra});return id};
const txt=(id,text,styles={},tag='p')=>add(id,'text',{tag,text,styles:{margin:'0',fontFamily:font,fontWeight:'400',color:ink,lineHeight:'1.5',...styles}});
const box=(id,components,styles={},extra={})=>add(id,'container',{tag:'div',components,styles:{minWidth:'0',...styles},...extra});
const pic=(id,key,alt,styles={},eager=false)=>add(id,'media',{tag:'image',src:assets[key],alt,width:key==='hero'||key==='nap'||key==='explorer'?1536:260,height:key==='hero'||key==='nap'||key==='explorer'?1024:200,loading:eager?'eager':'lazy',...(eager?{fetchPriority:'high'}:{}),styles:{display:'block',width:'100%',height:'auto',objectFit:'contain',...styles}});
const link=(id,text,href,styles={})=>add(id,'link',{href,text,styles:{fontFamily:font,fontWeight:'700',fontSize:'14px',color:ink,textDecoration:'none',minHeight:'44px',display:'inline-flex',alignItems:'center',...styles}},href.startsWith('#')?{eventInstructions:`navigationToSection:${href.slice(1)}`} : {});
const btn=(id,label,instructions,color=green)=>add(id,'button',{label,type:'button',classes:'iiBounce',styles:{fontFamily:font,fontSize:'16px',fontWeight:'800',color:ink,background:color,border:`2px solid ${ink}`,borderRadius:'12px',padding:'13px 22px',minHeight:'48px',boxShadow:`3px 4px 0 ${ink}`,cursor:'pointer'}},{eventInstructions:instructions});
const wrap={maxWidth:'1120px',margin:'0 auto',padding:'0 clamp(16px,3vw,32px)',boxSizing:'border-box'};
const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'22px'};
const panel={border:`2px solid ${ink}`,borderRadius:'20px',padding:'clamp(18px,3vw,30px)',boxShadow:`4px 5px 0 ${ink}18`};
const badge=(id,n,color)=>txt(id,n,{width:'40px',height:'40px',borderRadius:'50%',background:color,border:`2px solid ${ink}`,display:'grid',placeItems:'center',fontWeight:'900',fontSize:'22px',flexShrink:'0'});
const title=(id,n,text,color)=>box(`${id}Row`,[badge(`${id}Number`,n,color),txt(id,text,{fontSize:'clamp(24px,3vw,34px)',fontWeight:'900',lineHeight:'1.12',letterSpacing:'-0.04em'},'h2')],{display:'flex',alignItems:'center',gap:'13px',marginBottom:'18px'});

link('iiSkip','Saltar a la calculadora','#calculadora-infografica',{background:blue,justifyContent:'center',display:'flex',fontSize:'12px',minHeight:'30px'});
box('iiBrand',[txt('iiPaw','PE',{background:ink,color:paper,borderRadius:'45% 55% 45% 55%',padding:'8px 11px',fontWeight:'900'}),txt('iiBrandText','Pug Estándar',{fontWeight:'900',fontSize:'20px',letterSpacing:'-0.04em'})],{display:'flex',alignItems:'center',gap:'10px'});
box('iiNav',[link('iiNavCalc','Calculadora','#calculadora-infografica'),link('iiNavPrefixes','Prefijos','#prefijos'),link('iiNavClassic','Ver versión clásica ↗','/')],{display:'flex',gap:'20px',flexWrap:'wrap'},{tag:'nav',ariaLabel:'Navegación principal'});
box('iiHeader',['iiBrand','iiNav'],{...wrap,display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',flexWrap:'wrap',paddingTop:'14px',paddingBottom:'14px'},{tag:'header'});
txt('iiEdition','EDICIÓN INFOGRÁFICA · LABORATORIO DE PATITAS',{fontSize:'11px',fontWeight:'800',letterSpacing:'0.13em',marginBottom:'9px'});
txt('iiHeroTitle','Pequeñas patas.\nGrandes medidas.',{fontSize:'clamp(40px,5.4vw,67px)',lineHeight:'1.01',letterSpacing:'-0.065em',fontWeight:'900',whiteSpace:'pre-line'},'h1');
txt('iiHeroSub','La ciencia también puede\necharse una siesta.',{fontSize:'clamp(18px,2.4vw,24px)',fontWeight:'700',lineHeight:'1.25',marginTop:'17px',whiteSpace:'pre-line'});
txt('iiHeroIntro','Convierte tu mundo a Pug Estándar. Usa mili, kilo o mega y deja que los ceros se tomen un descanso.',{fontSize:'15px',maxWidth:'360px',marginTop:'15px'});
box('iiHeroCtas',[btn('iiStart','¡A medir se ha dicho!','navigationToSection:calculadora-infografica',peach),txt('iiTestStamp','Solo test · PE v0.2.0',{fontSize:'11px'})],{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'17px',marginTop:'23px'});
box('iiHeroCopy',['iiEdition','iiHeroTitle','iiHeroSub','iiHeroIntro','iiHeroCtas'],{paddingTop:'12px',paddingBottom:'18px'});
pic('iiHeroPug','hero','Pug científico ilustrado, con lentes, regla y cronómetro.',{maxHeight:'395px',mixBlendMode:'multiply',borderRadius:'24px',border:`2px solid ${ink}`,boxSizing:'border-box'},true);
txt('iiHeroBubble','«Yo pongo las arrugas.\nTú pon el número.»',{fontSize:'16px',fontWeight:'800',textAlign:'center',whiteSpace:'pre-line',padding:'11px 18px',background:paper,border:`2px solid ${ink}`,borderRadius:'24px 24px 5px 24px',transform:'rotate(2deg)',maxWidth:'255px',margin:'-7px auto 4px'});
box('iiHeroDrawing',['iiHeroPug','iiHeroBubble'],{minWidth:'0'});
box('iiHeroInner',['iiHeroCopy','iiHeroDrawing'],{...wrap,...grid,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,350px),1fr))',alignItems:'center',gap:'18px',paddingTop:'14px',paddingBottom:'32px'});
box('iiHero',['iiHeroInner'],{background:'#edf5fb',borderTop:`2px solid ${ink}`,borderBottom:`2px solid ${ink}`},{tag:'section',ariaLabel:'Pug Estándar Infográfico'});

const calc=infographicCalculator({assets});C.push(...calc.components);
box('iiCalculator',[title('iiCalculatorTitle','1','La calculadora con más arrugas',purple),txt('iiCalculatorIntro','Elige qué vas a medir. El pug se encarga de cambiar la escala.',{fontSize:'15px',marginBottom:'19px'}),calc.rootId],{...wrap,paddingTop:'40px',paddingBottom:'42px',scrollMarginTop:'20px'},{tag:'section',id:'calculadora-infografica'});

const bases=[['length','Longitud','0.30 m','1 PE_L','Una altura de referencia. No hace falta perseguir al pug con una regla.',blue],['mass','Masa','7.2 kg','1 PE_M','Una masa fija. Aunque él insista en que solo pesa lo que pesa su ternura.',green],['time','Tiempo','0.60 s','1 PE_T','Un latido-pug convencional. La siesta se mide con mucha paciencia.',peach]].map(([key,name,value,unit,joke,color])=>box(`iiBase_${key}`,[pic(`iiBasePic_${key}`,key,`Pug ilustrado: ${name.toLowerCase()}.`,{width:'150px',height:'115px',margin:'0 auto'}),txt(`iiBaseName_${key}`,name,{fontSize:'18px',fontWeight:'800'},'h3'),txt(`iiBaseValue_${key}`,value,{fontSize:'38px',fontWeight:'900',letterSpacing:'-0.05em',margin:'3px 0'}),txt(`iiBaseUnit_${key}`,`= ${unit}`,{fontSize:'14px',fontWeight:'700'}),txt(`iiBaseJoke_${key}`,joke,{fontSize:'13px',marginTop:'12px'})],{...panel,background:color}));
box('iiBases',[title('iiBasesTitle','2','Tres referencias. Cero persecuciones.',green),box('iiBaseGrid',bases,{...grid,gap:'18px'}),txt('iiConvention','Son valores fijos del proyecto, no medidas de un perro individual. La unidad permanece; las ganas de dormir varían.',{fontSize:'12px',marginTop:'18px'})],{...wrap,paddingTop:'18px',paddingBottom:'40px'},{tag:'section',id:'las-bases'});

const pref=[['μ','micro','0.000001','Un millonésimo',blue],['m','mili','0.001','Un milésimo',purple],['—','sin prefijo','1','El pug de siempre',paper],['k','kilo','1000','Mil unidades',green],['M','mega','1000000','Un millón',peach],['G','giga','1000000000','Mil millones',blue]];
const prefCards=pref.map(([s,n,f,desc,color],i)=>box(`iiPrefix${i}`,[txt(`iiPrefixSymbol${i}`,s,{fontSize:'32px',fontWeight:'900',lineHeight:'1'}),txt(`iiPrefixName${i}`,n,{fontSize:'14px',fontWeight:'800',marginTop:'8px'}),txt(`iiPrefixFactor${i}`,`× ${f}`,{fontSize:'12px',marginTop:'6px',overflowWrap:'anywhere'}),txt(`iiPrefixDesc${i}`,desc,{fontSize:'11px',marginTop:'4px'})],{background:color,border:`1.5px solid ${ink}`,borderRadius:'12px',padding:'15px 12px',textAlign:'center'}));
txt('iiPrefixWhy','El mismo tamaño, menos ceros.',{fontSize:'24px',fontWeight:'900',letterSpacing:'-0.035em'},'h3');
txt('iiPrefixExplain','1 kPE_L son 1000 PE_L. 1 mPE_M es 0.001 PE_M. La M mayúscula significa mega; la m minúscula significa mili.',{fontSize:'14px',marginTop:'11px'});
txt('iiPrefixExamples','300 m = 1 kPE_L\n0.0072 kg = 1 mPE_M\n600000 s = 1 MPE_T',{fontSize:'18px',fontWeight:'800',whiteSpace:'pre-line',lineHeight:'1.8',marginTop:'18px'});
txt('iiPrefixWhole','En área y volumen, el prefijo multiplica la unidad completa: 1 k(PE_L²) = 1000 PE_L². No significa elevar el prefijo al cuadrado.',{fontSize:'12px',marginTop:'15px'});
box('iiPrefixText',['iiPrefixWhy','iiPrefixExplain','iiPrefixExamples','iiPrefixWhole'],{padding:'6px'});
pic('iiExplorer','explorer','Pug astronauta con una cinta métrica sobre un planeta pequeño.',{maxHeight:'340px',mixBlendMode:'multiply'});
box('iiPrefixIllustrated',['iiPrefixText','iiExplorer'],{...grid,alignItems:'center',marginTop:'25px'});
box('iiPrefixesInner',[title('iiPrefixesTitle','3','Mucho pug. Pocos dígitos.',peach),box('iiPrefixGrid',prefCards,{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,130px),1fr))',gap:'10px'}),'iiPrefixIllustrated'],{...panel,background:'#fff4df'});
box('iiPrefixes',['iiPrefixesInner'],{...wrap,paddingTop:'16px',paddingBottom:'40px',scrollMarginTop:'20px'},{tag:'section',id:'prefijos'});

const derived=[['area','Área','1 PE_L² = 0.09 m²','Un cuadrado de 30 cm por lado.'],['volume','Volumen','1 PE_L³ = 27 L','Un cubo de 30 cm por lado. Pug no incluido.'],['speed','Velocidad','1 PE_V = 0.5 m/s','La prisa por la croqueta, con unidades.'],['energy','Energía','1 PE_E = 1.8 J','Cada sistema necesita un poco de chispa.']].map(([key,name,equivalent,joke],i)=>box(`iiDerived${i}`,[pic(`iiDerivedPug${i}`,key,`Pug de ${name.toLowerCase()}.`,{width:'150px',height:'115px'}),box(`iiDerivedCopy${i}`,[txt(`iiDerivedName${i}`,name,{fontSize:'18px',fontWeight:'900'},'h3'),txt(`iiDerivedEq${i}`,equivalent,{fontSize:'16px',fontWeight:'700',marginTop:'8px'}),txt(`iiDerivedJoke${i}`,joke,{fontSize:'13px',marginTop:'6px'})])],{...panel,background:i%2?green:blue,display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}));
box('iiDerivedSection',[title('iiDerivedTitle','4','Ahora sí: ciencia con patas.',blue),box('iiDerivedGrid',derived,{...grid,gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,430px),1fr))'}),txt('iiMoreMagnitudes','También puedes convertir aceleración, frecuencia, fuerza, potencia, presión y densidad en la calculadora.',{fontSize:'13px',marginTop:'18px'})],{...wrap,paddingTop:'12px',paddingBottom:'40px'},{tag:'section'});

const faqs=[
 ['iiFaqExact','¿Los resultados son exactos?','Las referencias PE son convenciones fijas. La calculadora usa aritmética numérica y muestra una aproximación con hasta 6 decimales. Los prefijos cambian la escala, no la magnitud.'],
 ['iiFaqAutomatic','¿Qué hace “prefijo automático”?','Escoge micro, mili, sin prefijo, kilo, mega o giga para acortar el resultado en PE. También puedes elegir la unidad y el prefijo tú mismo. Los extremos pueden necesitar notación científica.'],
 ['iiFaqTemperature','¿Y la temperatura del pug?','PE_TEMP es un punto de referencia de 38.5 °C, equivalente a 311.65 K. No es una unidad que se multiplica con kilo o mili; se compara mediante diferencias de temperatura.'],
 ['iiFaqReal','¿Necesito un pug de verdad?','No. Las escalas ya están definidas. Tu pug puede supervisar desde el sofá.'],
 ['iiFaqAux','¿Qué pasa con las referencias auxiliares?','PE_LA = 0.45 m, PE_R = 3 s y PE_VI = 12 años convencionales de 365.25 días. Se encuentran con las unidades de longitud y tiempo.'],
];
add('iiFaq','accordion',{mode:'multiple',allowToggle:true,renderMode:'default',scrollBehavior:'none',items:faqs.map(([id,title,content])=>({id,title,content})),containerClasses:'ank-display-flex ank-flexDirection-column ank-gap-12px',defaultItemButtonConfig:{classes:'iiFaqButton',styles:{fontFamily:font,fontWeight:'700'}},defaultItemPanelClasses:'iiFaqContent',titleClasses:'ank-fontSize-16px'});
box('iiFaqText',[title('iiFaqTitle','5','Dudas antes de la siesta',purple),'iiFaq'],{minWidth:'0'});
pic('iiNap','nap','Pug dormido abrazando un reloj sobre una almohada lavanda.',{mixBlendMode:'multiply'});
txt('iiNapCaption','«Despiértenme en 3 kPE_T.\nO mejor no.»',{fontSize:'18px',fontWeight:'800',textAlign:'center',whiteSpace:'pre-line',transform:'rotate(-2deg)',marginTop:'7px'});
box('iiNapPanel',['iiNap','iiNapCaption'],{background:purple,borderRadius:'25px',border:`2px solid ${ink}`,padding:'12px'});
box('iiFaqSection',['iiFaqText','iiNapPanel'],{...wrap,...grid,alignItems:'center',paddingTop:'10px',paddingBottom:'44px'},{tag:'section',id:'preguntas-infograficas'});

box('iiLastAction',[txt('iiClosing','Medir también es jugar con las ideas.',{fontSize:'clamp(23px,3.5vw,36px)',fontWeight:'900',lineHeight:'1.2'}),btn('iiAgain','Una conversión más →','navigationToSection:calculadora-infografica',peach)],{...panel,background:green,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'20px'});
box('iiCloseWrap',['iiLastAction'],{...wrap,paddingBottom:'35px'});
txt('iiSource','Pug Estándar v0.2.0 · Convención educativa del proyecto. No es una unidad oficial del SI ni una evaluación de salud.',{fontSize:'12px'});
box('iiFooterLinks',[link('iiClassicFooter','Versión clásica','/'),link('iiNist','Referencias SI ↗','https://www.nist.gov/pml/special-publication-811')],{display:'flex',gap:'22px',flexWrap:'wrap'});
txt('iiFooterPrivacy','Cálculos en tu navegador · Sin historial de conversiones · Ambiente de test',{fontSize:'11px'});
box('iiFooter',['iiSource','iiFooterLinks','iiFooterPrivacy'],{...wrap,borderTop:`2px solid ${ink}`,paddingTop:'20px',paddingBottom:'25px'},{tag:'footer'});
box('iiMain',['iiHero','iiCalculator','iiBases','iiPrefixes','iiDerivedSection','iiFaqSection','iiCloseWrap'],{},{tag:'main'});
box('iiPage',['iiSkip','iiHeader','iiMain','iiFooter'],{fontFamily:font,background:paper,color:ink,minHeight:'100vh',overflowX:'clip'});

const combos={...calc.combos,iiBounce:['ank-cursor-pointer','ank-transition-transform__150ms__ease','ank-transformHover-translateYSDMIN2pxED'],iiFaqButton:['ank-width-100per','ank-padding-16px','ank-bg-HASHfffdf5','ank-color-HASH163b55','ank-border-2px__solid__HASH163b55','ank-borderRadius-12px','ank-textAlign-left','ank-minHeight-48px','ank-cursor-pointer'],iiFaqContent:['ank-padding-16px','ank-fontSize-14px','ank-lineHeight-1_6','ank-color-HASH163b55']};
const write=(file,data)=>{const f=path.join(root,file);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(data,null,2)+'\n')};
write(`${pageId}/components.json`,{version:1,pageId,domain,components:C});
write(`${pageId}/page-config.json`,{version:1,pageId,domain,rootIds:['iiPage'],modalRootIds:[],seo:{title:{es:'Pug Estándar Infográfico | Calculadora de mili, kilo y mega PE'},description:{es:'Pequeñas patas, grandes medidas. Convierte a micro, mili, kilo, mega y giga pugs estándar con una calculadora ilustrada.'},canonical:'https://pugestandar.com/infografico',robots:'noindex,nofollow'},metadata:{status:'test-draft',variant:'infographic',systemVersion:'0.2.0'}});
write(`${pageId}/variables.json`,{version:1,pageId,domain,variables:{systemVersion:'0.2.0'}});
write(`${pageId}/angora-combos.json`,{version:1,pageId,domain,combos});
write(`${pageId}/i18n/es.json`,{version:1,pageId,domain,lang:'es',dictionary:{}});
const site=JSON.parse(fs.readFileSync(path.join(root,'site-config.json'),'utf8'));
site.routes=[...site.routes.filter(r=>r.pageId!==pageId),{path:'/infografico',pageId,label:'Pug Estándar Infográfico'}];
write('site-config.json',site);
console.log(`Built ${C.length} infographic components and route /infografico; original page preserved.`);
