# Pug Estándar

A Spanish educational calculator for the Pug Estándar v0.2.0 unit convention. This native Zoolandingpage draft targets `pugestandar.com` in the shared **test environment only**.

[Original test draft](https://test.zoolandingpage.com.mx/?draftDomain=pugestandar.com) · [Infographic test draft](https://test.zoolandingpage.com.mx/infografico?draftDomain=pugestandar.com)

## Experience

Both variants convert 13 quantities using the same catalog of 16 PE units: three base, three auxiliary and ten derived units. The quantities are length, mass, time, area, volume, speed, acceleration, frequency, force, energy, power, pressure and mass density. PE_TEMP is a separate reference temperature, not a multiplicative unit.

- `/` is the original ivory/cobalt calculator, with two generated pug images, an educational unit table, worked examples, expandable questions and a temperature comparison.
- `/infografico` is an illustrated variant with three additional generated PNGs, eight educational SVGs, a prefix guide and its own calculator. It supports micro, mili, base (no prefix), kilo, mega and giga PE units, with automatic or manual destination selection.
- Both offer compatible source/destination units, inverse conversion, example reset, clear and a selectable result for manual copying. Calculations happen in the browser without a conversion service or stored conversion history.

Prefixes multiply the complete PE unit. For example, `k(PE_L²)` means `1000 × PE_L²`, not `(kPE_L)²`; the same convention applies to volume.

## Authoring and validation

The source specification and examples were supplied in the project's Google Drive folder. Private source files and investigation notes are excluded from this repository. The reviewed public unit subset is in [tools/data/pe-catalog-v0.2.0.json](tools/data/pe-catalog-v0.2.0.json).

```sh
node tools/build-draft.mjs
node tools/build-infographic.mjs
node tools/check-draft.mjs
node tools/check-infographic.mjs
```

For a full regeneration, keep this order: `build-draft.mjs` writes the original payloads and site configuration, then `build-infographic.mjs` writes the infographic payloads and adds `/infografico` to the site's routes. For infographic-only changes, run only `build-infographic.mjs`; it preserves the original page files.

The builders emit native Zoolandingpage JSON using the committed catalog, [original public assets](tools/data/public-assets.json), [original educational content](tools/educational-content.mjs), [infographic public assets](tools/data/infographic-assets.json) and [infographic calculator module](tools/infographic-calculator.mjs). They require no private metadata or external request. The browser uses the existing native runtime; authoring modules/data stay under `tools/` and are excluded from deployment.

`check-draft.mjs` verifies the original source factors and payload references. `check-infographic.mjs` checks the emitted calculator module, including all 13 quantities, automatic prefix boundaries, source factors, SI limits and inverse conversions. Rendered changes also require desktop and mobile browser QA.

## Numerical behavior

Enter numbers with a decimal point. Both variants use JavaScript numeric arithmetic and display approximate results; exact catalog factors do not make the computed result an arbitrary-precision rational value. Interchanging units uses the unrounded numerical result, not the displayed rounded text. Copying uses the browser's selection and Copy command.

The original view rounds to eight decimal places where useful and accepts zero or an absolute quantity from `1e-100` through `1e9` in SI. The infographic view rounds to six decimal places where useful, uses scientific notation for extremes and accepts zero or an absolute quantity from `1e-100` through `1e15` in SI. Its module validates the limits against the selected source unit, so changing units preserves the same SI range. Quantities that disallow negative values remain nonnegative. Very small values retain native numeric notation to avoid displaying a nonzero value as zero.

The native number control parses input before validation. The prototype does not preserve arbitrary input-token precision or detect lexical underflow beyond the browser's numeric range.

## Routes and delivery

The default route remains `/` (`pageId: default`). The second route is `/infografico` (`pageId: infografico`) in the same site and repository. Both test pages are marked `noindex,nofollow` and use the shared testing host shown above.

Work on `dev`; publish to test through a protected `dev -> test` PR. Production is disabled in [draft-repo.config.json](draft-repo.config.json). No production alias or custom test subdomain is configured.

- Contributor entrypoint: [AGENTS.md](AGENTS.md)
- Site configuration: [site-config.json](site-config.json)
- Original page: [configuration](default/page-config.json) and [generated components](default/components.json)
- Infographic page: [configuration](infografico/page-config.json) and [generated components](infografico/components.json)
- Release workflow: [.github/workflows/deploy-test.yml](.github/workflows/deploy-test.yml)
- Shared workflow guidance: [Zoolandingpage documentation](https://github.com/LynxPardelle/zoolandingpage/blob/main/docs/README.md)
