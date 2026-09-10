import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Original vector artwork. All scenes share one drawn character, without fonts,
// external references, embedded bitmaps, animation, or browser scripting.
export const illustrationPalette = Object.freeze({
  ink: '#163b55', sand: '#efd0a4', ears: '#5a4034', cream: '#fff1d5',
  pink: '#efa3ad', blue: '#bfe3ee', mint: '#cce6d7', lavender: '#dcd3ef',
  yellow: '#f8dfa0', paper: '#fffdf6',
});
const c = illustrationPalette;
const sparkle = (x, y, size = 7, fill = c.yellow) =>
  `<path d="M${x} ${y-size}Q${x+1} ${y-1} ${x+size} ${y}Q${x+1} ${y+1} ${x} ${y+size}Q${x-1} ${y+1} ${x-size} ${y}Q${x-1} ${y-1} ${x} ${y-size}Z" fill="${fill}"/>`;

function pug({ x = 25, y = 25, scale = 0.94, tilt = 0, point = false } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${scale}) rotate(${tilt} 60 140)" stroke-width="${3/scale}">
    <!-- The little corkscrew tail sits behind the lab coat. -->
    <path d="M25 128C7 128-6 114 0 103C6 92 24 96 23 108C23 120 7 120 8 109C9 104 14 103 17 107" fill="none" stroke-width="${8/scale}"/>
    <path d="M25 128C7 128-6 114 0 103C6 92 24 96 23 108C23 120 7 120 8 109C9 104 14 103 17 107" fill="none" stroke="${c.sand}" stroke-width="${3/scale}"/>
    <path d="M32 88C19 101 22 133 29 143Q58 154 91 142C101 117 97 96 84 88Z" fill="${c.sand}"/>
    <path d="M35 95Q61 110 85 95L94 140Q80 148 63 145L59 118L55 145Q35 148 24 139Z" fill="${c.paper}"/>
    <path d="M38 94L50 109L58 100M82 94L70 109L62 100M60 109V133" fill="none"/>
    <path d="M76 119H88V130Q82 134 76 130Z" fill="${c.blue}"/>
    <path d="M81 117V111M85 117V112" fill="none" stroke-width="2"/>
    <path d="M27 130C15 131 16 146 29 147H44C51 146 50 134 41 132Z" fill="${c.sand}"/>
    <path d="M74 132C64 135 68 147 77 147H94C107 146 107 132 94 130Z" fill="${c.sand}"/>
    <path d="M29 141V146M36 141V146M83 141V146M90 141V146" fill="none" stroke-width="2"/>
    ${point
      ? `<path d="M89 108Q110 110 114 93C116 84 128 89 124 99Q115 127 94 122" fill="${c.sand}"/><path d="M89 107L99 110L96 123L89 123Z" fill="${c.paper}"/>`
      : `<path d="M86 105Q107 111 103 125Q97 134 87 121" fill="${c.sand}"/><path d="M86 103L95 107L88 119L80 113Z" fill="${c.paper}"/>`}
    <path d="M30 104Q12 112 19 125Q25 135 35 120" fill="${c.sand}"/>
    <path d="M31 103L22 108L30 119L38 112Z" fill="${c.paper}"/>
    <!-- Low, broad fawn skull; folded black ears and a short dark pug muzzle. -->
    <path d="M27 38Q38 29 50 32Q60 29 67 32Q82 29 97 38Q108 49 112 70L115 86C117 103 94 109 63 108C32 110 8 103 10 86L15 66Q18 48 27 38Z" fill="${c.sand}"/>
    <path d="M33 36Q21 29 9 38Q-2 43 3 55L13 71Q17 78 23 66L39 40Z" fill="#35373c"/>
    <path d="M91 35Q103 29 115 39Q128 45 121 59L112 72Q107 79 101 65L85 40Z" fill="#35373c"/>
    <path d="M22 38Q14 41 12 49M103 38Q111 42 114 50" fill="none" stroke="#64605a" stroke-width="2.5"/>
    <path d="M42 44Q49 40 56 44M68 43Q76 40 83 45M38 51Q48 46 58 51M66 51Q76 46 86 52" fill="none" stroke="#a58055" stroke-width="2"/>
    <path d="M23 64C25 48 45 48 51 63C57 76 48 84 35 82C24 81 20 74 23 64Z" fill="#43474b" stroke-width="2"/>
    <path d="M74 63C80 47 100 50 102 66C106 78 98 84 87 83C74 83 68 76 74 63Z" fill="#43474b" stroke-width="2"/>
    <ellipse cx="36" cy="67" rx="10" ry="11" fill="#142b37" stroke="none"/>
    <ellipse cx="88" cy="67" rx="10" ry="11" fill="#142b37" stroke="none"/>
    <circle cx="32" cy="63" r="3.8" fill="white" stroke="none"/>
    <circle cx="84" cy="63" r="3.8" fill="white" stroke="none"/>
    <circle cx="39" cy="73" r="1.9" fill="white" stroke="none"/>
    <circle cx="91" cy="73" r="1.9" fill="white" stroke="none"/>
    <ellipse cx="25" cy="87" rx="7.5" ry="4.5" fill="${c.pink}" stroke="none" opacity="0.85"/>
    <ellipse cx="101" cy="87" rx="7.5" ry="4.5" fill="${c.pink}" stroke="none" opacity="0.85"/>
    <path d="M45 80C49 70 74 70 81 81L92 95C99 109 77 108 63 108C45 109 26 105 34 94Z" fill="#43474b"/>
    <path d="M47 83Q43 88 39 94M77 83Q82 88 85 95" fill="none" stroke="#5b5b56" stroke-width="2"/>
    <path d="M53 79Q63 73 74 79Q73 88 63 89Q53 86 53 79Z" fill="${c.ink}" stroke-width="2"/>
    <ellipse cx="61" cy="79" rx="3" ry="1.5" fill="#65717a" stroke="none"/>
    <path d="M63 87V92M63 92Q54 100 47 91M63 92Q72 100 79 91" fill="none" stroke-width="2.5"/>
    <path d="M48 93L52 95L51 98Z" fill="${c.paper}" stroke="none"/>
    <path d="M59 98Q64 95 70 98L70 105Q69 112 64 112Q58 111 57 105V99Z" fill="${c.pink}" stroke-width="2"/>
    <path d="M64 99V105" fill="none" stroke-width="1.5"/>
    <path d="M29 54L35 52M89 52L96 55" fill="none" stroke-width="2.5"/>
  </g>`;
}

function wrap(name, title, description, background, art) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="200" viewBox="0 0 260 200" role="img" aria-labelledby="pe-${name}-title" aria-describedby="pe-${name}-desc">
  <title id="pe-${name}-title">${title}</title>
  <desc id="pe-${name}-desc">${description}</desc>
  <g stroke="${c.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 121C15 82 37 38 84 31C108 4 159 18 182 42C224 36 247 72 230 115C245 152 220 179 178 177C142 194 112 176 88 183C46 189 18 163 30 121Z" fill="${background}" stroke="none"/>
    <ellipse cx="130" cy="180" rx="99" ry="8" fill="${c.ink}" opacity="0.08" stroke="none"/>
    ${art}
  </g>
</svg>
`;
}

export function infographicSvgAssets() {
  const rulerMarks = Array.from({ length: 11 }, (_, i) =>
    `<path d="M185 ${48+i*11}H${i%2 === 0 ? 201 : 195}" fill="none" stroke-width="2"/>`).join('');
  const clockMarks = Array.from({ length: 12 }, (_, i) =>
    `<path d="M187 65V${i%3 === 0 ? 72 : 69}" transform="rotate(${i*30} 187 103)" fill="none" stroke-width="2"/>`).join('');
  const gridLines = Array.from({ length: 3 }, (_, i) =>
    `<path d="M${155+(i+1)*20} 74V154M155 ${74+(i+1)*20}H235" fill="none" stroke-width="1.5"/>`).join('');
  const bulbRays = [[188,23,188,13],[159,32,153,24],[148,59,138,57],[221,33,229,25],[229,61,241,58],[216,91,226,98]].map(([x1,y1,x2,y2])=>
    `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none"/>`).join('');
  return {
    length: wrap('length', 'Pug científico con una regla', 'Un pug con bata, lengua afuera y cola en rizo compara su altura con una regla amarilla.', c.blue,
      `<g transform="rotate(3 200 108)"><rect x="183" y="33" width="32" height="143" rx="5" fill="${c.yellow}"/>${rulerMarks}<circle cx="200" cy="42" r="2" fill="${c.ink}" stroke="none"/></g>
      <path d="M159 44V164M154 50L159 44L164 50M154 158L159 164L164 158" fill="none" stroke-width="2"/>
      <path d="M103 44H151M129 164H151" fill="none" stroke-dasharray="3 6" stroke-width="2"/>
      ${pug({x:25,y:25,point:true})}${sparkle(230,75,6)}${sparkle(41,24,5,c.paper)}`),
    mass: wrap('mass', 'Pug científico en una báscula', 'Un pug con bata se sienta sobre la plataforma de una báscula mecánica con esfera y aguja.', c.lavender,
      `<path d="M148 177H196V109" fill="none" stroke-width="7"/>
      <circle cx="196" cy="75" r="34" fill="${c.mint}"/>
      <circle cx="196" cy="75" r="25" fill="${c.paper}" stroke-width="2"/>
      <path d="M178 67L181 70M183 57L186 62M196 53V59M209 58L206 63M216 69L211 71" fill="none" stroke-width="2"/>
      <path d="M196 75L207 61" fill="none"/><circle cx="196" cy="75" r="4" fill="${c.pink}"/>
      <rect x="44" y="164" width="113" height="19" rx="7" fill="${c.pink}"/>
      <path d="M58 173H143" fill="none" stroke-width="2"/>
      ${pug({x:42,y:21,scale:0.97})}${sparkle(225,130,7,c.yellow)}`),
    time: wrap('time', 'Pug científico junto a un reloj', 'Un pug con bata señala un gran despertador de color menta con dos campanas y manecillas.', c.yellow,
      `<path d="M162 140L155 157M211 140L218 157" fill="none" stroke-width="6"/>
      <path d="M156 58Q144 43 159 38Q174 32 177 50M197 49Q205 31 219 40Q230 46 218 59" fill="${c.pink}"/>
      <path d="M182 52V43H193V52" fill="${c.blue}"/>
      <circle cx="187" cy="103" r="44" fill="${c.mint}"/>
      <circle cx="187" cy="103" r="36" fill="${c.paper}" stroke-width="2"/>
      ${clockMarks}<path d="M187 80V103L205 112" fill="none"/>
      <circle cx="187" cy="103" r="4" fill="${c.pink}"/>
      <path d="M229 44L235 39M231 53H240" fill="none" stroke-width="2"/>
      ${pug({x:20,y:33,scale:0.93,point:true})}${sparkle(53,22,6,c.paper)}`),
    area: wrap('area', 'Pug científico con una cuadrícula', 'Un pug con bata señala una cuadrícula de cuatro por cuatro, con algunos cuadrados resaltados en amarillo.', c.mint,
      `<rect x="151" y="70" width="88" height="88" rx="6" fill="${c.paper}"/>
      <path d="M155 74H215V114H155Z" fill="${c.yellow}" stroke="none"/>
      <path d="M155 114H175V134H155Z" fill="${c.yellow}" stroke="none"/>
      ${gridLines}<path d="M155 62H235M155 58V66M235 58V66M246 74V154M242 74H250M242 154H250" fill="none" stroke-width="2"/>
      <path d="M205 175L226 160L231 167L210 182L203 183Z" fill="${c.pink}"/>
      ${pug({x:21,y:28,scale:0.95,point:true})}${sparkle(202,37,7,c.lavender)}`),
    volume: wrap('volume', 'Pug científico con un cubo', 'Un pug con bata contempla un cubo de tres caras en azul, menta y lavanda.', c.lavender,
      `<path d="M151 104L190 80L229 103L190 127Z" fill="${c.mint}"/>
      <path d="M151 104L190 127V173L151 150Z" fill="${c.blue}"/>
      <path d="M190 127L229 103V149L190 173Z" fill="#c4b6df"/>
      <path d="M161 113L161 143L181 155M199 132L218 120" fill="none" stroke="${c.paper}" stroke-width="3"/>
      <path d="M190 90L207 100" fill="none" stroke="${c.paper}" stroke-width="3"/>
      ${pug({x:24,y:27,scale:0.95,point:true})}${sparkle(214,53,9,c.yellow)}${sparkle(156,56,5,c.paper)}`),
    speed: wrap('speed', 'Pug científico en patineta', 'Un pug con bata y una pequeña bufanda rosa viaja en una patineta; las líneas detrás sugieren movimiento.', c.blue,
      `<path d="M22 104H49M15 121H43M26 138H45" fill="none"/>
      <path d="M68 109Q43 102 30 111L37 117L29 124Q47 125 68 119Z" fill="${c.pink}"/>
      <path d="M56 164Q115 171 191 159L195 165Q174 183 79 181Q58 178 56 164Z" fill="${c.lavender}"/>
      <circle cx="83" cy="184" r="7" fill="${c.ears}"/><circle cx="173" cy="181" r="7" fill="${c.ears}"/>
      <circle cx="83" cy="184" r="2" fill="${c.paper}" stroke="none"/><circle cx="173" cy="181" r="2" fill="${c.paper}" stroke="none"/>
      ${pug({x:62,y:20,scale:0.99,tilt:-9})}
      <path d="M213 93L202 111L215 109L205 127" fill="${c.yellow}"/>
      ${sparkle(214,57,8,c.yellow)}${sparkle(46,54,5,c.paper)}`),
    energy: wrap('energy', 'Pug científico con una idea luminosa', 'Un pug con bata señala una bombilla amarilla encendida, rodeada de pequeños rayos.', c.mint,
      `<path d="M168 110C168 100 153 88 153 67C153 21 223 21 223 67C223 88 207 100 207 110Z" fill="${c.yellow}"/>
      <path d="M165 64Q164 44 183 42" fill="none" stroke="${c.paper}" stroke-width="5"/>
      <path d="M180 110V84L173 76L183 78L188 70L193 78L203 76L196 84V110" fill="none" stroke-width="2"/>
      <path d="M168 110H207V127Q188 143 168 127Z" fill="${c.lavender}"/>
      <path d="M173 117H202M175 124H200" fill="none" stroke-width="2"/>
      <path d="M181 136Q188 143 195 136" fill="none"/>
      ${bulbRays}${pug({x:21,y:32,scale:0.94,point:true})}${sparkle(230,155,6,c.paper)}`),
    temperature: wrap('temperature', 'Pug científico con un termómetro', 'Un pug con bata observa un termómetro rosa y azul; el dibujo acompaña una referencia de temperatura.', c.yellow,
      `<path d="M178 126V44C178 25 202 25 202 44V126C226 144 212 174 190 174C167 174 155 144 178 126Z" fill="${c.paper}"/>
      <path d="M184 132V70Q190 65 196 70V132C211 142 205 161 190 161C174 161 169 143 184 132Z" fill="${c.pink}" stroke="none"/>
      <path d="M190 70V145" fill="none" stroke="#d9778d" stroke-width="3"/>
      <path d="M178 49H186M178 66H184M178 83H186M178 100H184M178 117H186" fill="none" stroke-width="2"/>
      <path d="M219 48H229M219 65H224M219 82H229M219 99H224" fill="none" stroke-width="2"/>
      <path d="M179 144Q175 153 185 157" fill="none" stroke="${c.paper}" stroke-width="3"/>
      ${pug({x:22,y:29,scale:0.95,point:true})}${sparkle(228,133,7,c.blue)}${sparkle(142,32,5,c.lavender)}`),
  };
}

export async function generateInfographicSvgs(outputDirectory) {
  if (!outputDirectory) throw new Error('Provide the output directory explicitly.');
  const directory = resolve(outputDirectory);
  await mkdir(directory, { recursive: true });
  const assets = infographicSvgAssets();
  const paths = [];
  for (const [name, svg] of Object.entries(assets)) {
    const filePath = resolve(directory, `${name}.svg`);
    await writeFile(filePath, svg, 'utf8');
    paths.push(filePath);
  }
  return paths;
}

export async function main(args = process.argv.slice(2)) {
  if (args.length !== 1) throw new Error('Usage: node tools/infographic-svg.mjs <output-directory>');
  const paths = await generateInfographicSvgs(args[0]);
  process.stdout.write(`Generated ${paths.length} original SVG illustrations.\n`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
