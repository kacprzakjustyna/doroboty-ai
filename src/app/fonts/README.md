# Runtime typography

The application loads **Space Grotesk** 400/500/700 and **IBM Plex Mono** 400/500 from the WOFF2
files in this directory, declared in [../fonts.css](../fonts.css) and resolved by Vite. Space
Grotesk carries headings, body and controls; IBM Plex Mono carries every data role — labels,
prices, units, dates, locations, counters, score and status.

Each family ships two subsets per weight, `latin` and `latin-ext`, with the matching
`unicode-range`, so Polish diacritics come from the extended file and no remote font request is
made at runtime. Both families are SIL OFL; the licenses sit beside the files as
`LICENSE-space-grotesk.txt` and `LICENSE-ibm-plex-mono.txt`. The files were taken from the
`@fontsource/space-grotesk` and `@fontsource/ibm-plex-mono` 5.3.0 packages, copied in rather than
added as runtime dependencies.

Geist Serif is no longer loaded: it belonged to the Poster People direction, which
[docs/design-system/DOROBOTY.md](../../../docs/design-system/DOROBOTY.md) replaced. The font file
itself stays in the immutable kit.

## Retained historical assets

# Timeless Sans Variable

`timeless-sans-variable.woff2` is the free Timeless Sans variable font served by the official
[Timeless Type](https://timeless.co/type) website. The vendor describes the Timeless family as
free for personal and commercial use.

The previous runtime used the Grotesk cut with `STYL` and `ital` pinned to `0`. These are existing implementation assets, not the target for new headings. Follow the accepted [design-system integration guide](../../../docs/design-system/README.md), which supplies local Geist Serif Regular and its license.

## Web-optimized Grotesk

`timeless-grotesk-web-variable.woff2` is generated from the original asset by
pinning `STYL=0` and `ital=0`, matching the existing global theme settings. It keeps
all 417 mapped Unicode characters, glyph coverage and the weight axis (300–800),
while discarding unused stylistic/italic interpolation. The original is retained.

Generate with FontTools `varLib.instancer` using those axis values and WOFF2 output;
preserve timestamps for repeatability. FontTools is asset tooling, not a runtime dependency.
These retained Timeless assets are no longer loaded by the application.
