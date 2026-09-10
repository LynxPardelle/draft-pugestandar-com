# Pug Estándar

A Spanish educational calculator for the Pug Estándar v0.2.0 unit convention. This native Zoolandingpage draft targets `pugestandar.com` in the shared **test environment only**.

[Open the test draft](https://test.zoolandingpage.com.mx/?draftDomain=pugestandar.com)

## Experience

- Live conversion across 13 quantities and 16 PE units: three base, three auxiliary and ten derived units.
- Compatible source/destination selectors, inverse conversion, reset, clear, worked examples and a selectable result for manual copying.
- Exact rational conversion factors explained alongside numerical results. PE_TEMP is a separate reference-temperature comparison.
- Responsive ivory/cobalt layout, two original generated pug images, accessible forms, educational unit table and expandable questions.
- Calculations happen in the browser. The calculator does not send entered quantities to a conversion service or retain a conversion history.

## Authoring and validation

The source specification and examples were supplied in the project's Google Drive folder. Private source files and investigation notes are excluded from this repository. The reviewed public unit subset is in [tools/data/pe-catalog-v0.2.0.json](tools/data/pe-catalog-v0.2.0.json).

```sh
node tools/build-draft.mjs
node tools/check-draft.mjs
```

The builder writes the native JSON files. It uses only the committed catalog, [public asset URLs](tools/data/public-assets.json) and [educational content](tools/educational-content.mjs); it needs no private metadata, external request or browser script. Authoring assets/data remain under `tools/` so the deployment packer excludes them.

The runtime uses JavaScript numeric arithmetic. It rounds the displayed decimal to eight places where useful and preserves natural numeric/scientific notation for small or large values. The explanatory factor is an exact reduced fraction; the numerical result is approximate and is not an arbitrary-precision rational value. Inverting uses the unrounded numerical result. Copying uses the browser's selection and Copy command.

## Routes and delivery

The only page is `/`, with calculator, system, unit table, examples, questions, sources and temperature sections. The test page is marked `noindex,nofollow`.

Work on `dev`; publish to test through a protected `dev -> test` PR. Production is disabled in [draft-repo.config.json](draft-repo.config.json). No production alias or custom test subdomain is configured.

- Contributor entrypoint: [AGENTS.md](AGENTS.md)
- Site configuration: [site-config.json](site-config.json)
- Page configuration: [default/page-config.json](default/page-config.json)
- Generated components: [default/components.json](default/components.json)
- Release workflow: [.github/workflows/deploy-test.yml](.github/workflows/deploy-test.yml)
- Shared workflow guidance: [Zoolandingpage documentation](https://github.com/LynxPardelle/zoolandingpage/blob/main/docs/README.md)
