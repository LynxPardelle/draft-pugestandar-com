import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const units=new Map(read('tools/data/pe-catalog-v0.2.0.json').units.map(u=>[u.id,u]));
const expected={pe_length:[3,10],pe_mass:[36,5],pe_time:[3,5],pe_length_aux:[9,20],pe_breath:[3,1],pe_life:[378691200,1],pe_area:[9,100],pe_volume:[27,1000],pe_speed:[1,2],pe_acceleration:[5,6],pe_frequency:[5,3],pe_force:[6,1],pe_energy:[9,5],pe_power:[3,1],pe_pressure:[200,3],pe_density:[800,3]};
for(const [id,[n,d]] of Object.entries(expected)){
  const u=units.get(id);assert.ok(u,id);
  assert.equal(BigInt(u.scaleToSI.numerator)*BigInt(d),BigInt(n)*BigInt(u.scaleToSI.denominator),id);
}
assert.equal(expected.pe_life[0],12*365.25*24*60*60);
const defs=read('default/components.json').components;
const ids=new Set(defs.map(c=>c.id));assert.equal(ids.size,defs.length,'Duplicate component IDs');
for(const c of defs)for(const child of c.config.components??[])assert.ok(ids.has(child),`${c.id}: missing ${child}`);
for(const id of read('default/page-config.json').rootIds)assert.ok(ids.has(id));
assert.equal(defs.filter(c=>c.type==='interaction-scope').length,15);
const site=read('site-config.json');assert.ok(site.routes.some(r=>r.path==='/'&&r.pageId==='default'));assert.equal(site.runtime.analytics.enabled,false);
assert.equal(read('draft-repo.config.json').branches.main.deploys,false);
assert.equal(read('default/page-config.json').seo.robots,'noindex,nofollow');
for(const asset of Object.values(read('tools/data/public-assets.json')))assert.ok(asset.startsWith('https://assets.zoolandingpage.com.mx/pugestandar.com/shared/images/'));
const json=JSON.stringify(defs);assert.ok(!/drive\.google\.com|docs\.google\.com|localhost|127\.0\.0\.1/.test(json));
console.log(`Verified 16 source PE factors, Julian-year convention, ${defs.length} component identities/references, test-only configuration and public asset scope.`);
