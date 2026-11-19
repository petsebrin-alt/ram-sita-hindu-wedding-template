# Ram & Sita — Divine Royal Hindu Wedding Invitation

A single-page, scroll-animated wedding invitation website themed on the Ramayana. It uses Jaipur royal architecture, antique gold and ivory, royal maroon, temple terracotta and lotus pink.

**Wedding date:** Saturday, 27 March 2027 · **Venue:** Rambagh Palace, Jaipur, Rajasthan

## Run it locally

Open a terminal in this folder and run:

```bash
python3 -m http.server 5501
```

Then open <http://127.0.0.1:5501>. A local server is needed because some browsers block assets when `index.html` is opened directly from disk.

To publish it, upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages or your own server).

## The 14 sections

| # | Section | What happens on scroll |
|---|---------|------------------------|
| 00 | **Opening** (`#intro`) | Sita's hand reaches down to a lotus bud held in Ram's palm; at her touch it blossoms with a golden glow and petals, the view drifts into the lotus and a burst of sunlight opens onto the Ram Mandir. A Skip button jumps straight in. |
| 01 | **Welcome** (`#welcome`) | Every stage fills the screen edge to edge (wide photos on laptops, upright photos on phones). The night-time Ram Mandir appears with the names "Ram & Sita" in a starry sky. As you scroll, the temple lights come on and you move forward into the lotus pond. Real lotus buds rise from the water and open into full blooms. Then the realistic 3D Ram & Sita rise into place in front of the temple, holding their varmalas, the Ram Mandir still in full view behind them. Four brass vilakku light up at their feet, and the date ribbon unfurls. |
| 02 | **The Invitation** (`#invitation`) | "Welcome, dear friends & family" with Bhagavad Gita 6.30. On a soft pink, gently moving light background, a rani-pink gatefold with the gold chakra and seal swings open. Shri Hanuman rises onto the top of the ivory card to bless it; the card has lotus-embroidered corners and short lines: Ram (son of Dasharatha & Kausalya), Sita (daughter of Janaka & Sunaina), the date and venue. |
| 03 | **Vadhu & Vara** (`#couple`) | Bride and groom portraits in gold jharokha frames with their parents' names. Between them a gold line writes a heart, two green leaves unfurl and a lotus blossoms at the end of the stem. |
| 04 | **Save the Date** (`#save-the-date`) | On a crimson background with falling marigold petals, Shri Ram's golden bow draws back. The arrow flies (tap the bow, or it releases by itself), breaks a golden seal with a cracker "pop" and a burst of marigolds, and the date appears in a gold ring between two rising gold poles flying Shri Ram Mandir saffron flags. Includes an Add to calendar button (.ics). |
| 05 | **Countdown** (`#countdown`) | "The Royal Timepiece": the gold lotus chakra as a clock dial (days in the centre, hours, minutes and seconds around it, a ticking gold hand), with countdown tiles below. |
| 06 | **Ram Bhakt Hanuman** (`#hanuman`) | Hanuman kneels in prayer; a glow builds at his heart, which opens to show Ram & Sita. Verse from the Hanuman Chalisa. |
| 07 | **Our Story** (`#story`) | A gold thread draws down the page. Four round badges, embroidered lotus on the front, turn over one by one to show the couple’s photos, each with one short line: Pushpa Vatika, Shiva Dhanush, Swayamvar, Saptapadi. Tap a badge to turn it again. |
| 08 | **Our Families** (`#families`) | One big gold medallion per family with both parents together. As you scroll, a single gold line with a glowing tip draws each arched frame (up, over the arch, down and along the bottom), then the card fills in and five lotuses bloom on the bottom line. |
| 09 | **Wedding Events** (`#events`) | "Through the Palace Doors": one palace window per celebration. The doors open on a picture of the event, a details card pops up with a glowing Get directions button (Google Maps), then the doors close and the next window rises into place. |
| 10 | **Wishing Wall** (`#wishes`) | Guests write a blessing, and it floats onto the wall with a petal burst. |
| 11 | **RSVP** (`#rsvp`) | A maroon envelope opens to a simple card: "Dear (your name)", a short quote and the invitation from Sita & Ram, with one Accept the invitation button. On accepting, the card turns to show Ram & Sita with a thank-you and a shower of petals, and a Replay button to see it again. No sound plays here. |
| 12 | **Venue & Travel** (`#venue`) | Shri Ram Mandir in a gold arch, Rambagh Palace with Get directions and Open in Maps, then three cards: By Road & Bus, By Train & Air, Where to Stay. |
| 13 | **Contact** (`#contact`) | Family contacts with call, WhatsApp and email buttons. |
| 14 | **Thank You** (`#thank-you`) | Pink and gold fireworks over the temple, with a verse from Tulsidas. |

## Customising

| What | Where |
|------|-------|
| Names, verses, story, event times, venues, family names | `index.html` (each section is clearly commented) |
| Countdown target, calendar entry, RSVP WhatsApp number, seed wishes | `CONFIG` at the top of `js/main.js` |
| Colours and fonts | CSS variables at the top of `css/style.css` |
| Phone numbers / email | `#contact` in `index.html` (the current ones are **placeholders**) |

**Placeholders to replace before sharing:** `+91 98765 4321x`, `hospitality@ramwedssita.example` and `CONFIG.rsvpWhatsApp`.

### Wishes and RSVPs are stored in the guest's browser

The site has no backend. The wishing wall and RSVP card save to that guest's own `localStorage`, so other guests can't see them, and you won't either. The RSVP's **Send RSVP to the family** button opens WhatsApp with a pre-filled message to `CONFIG.rsvpWhatsApp`, so you do receive every response. For a shared wishing wall, connect the form to a service such as Google Sheets, Formspree or Firebase.

## Asset library (`assets/`)

Each decorative object is its own file, so you can reuse, edit or swap it independently. Vector assets are **SVG**. Every SVG also has a **transparent PNG + WebP** render (2000 px on the longest side; 1024 px for icons, petals, flames and corners).

```
assets/
├── hero/       couple-ram-sita-3d-cutout (.png/.webp, transparent; the couple standing in the hero)
│               couple-ram-3d-cutout · couple-sita-3d-cutout (.png/.webp, separate transparent layers)
│               hero-ram-sita-3d.webp/.jpg (your original 3D picture, background included)
│               portrait-ram-3d.webp · portrait-sita-3d.webp (crops used in Vadhu & Vara)
│               hero-temple-river-sunset.webp · hero-temple-river-night.webp (graded night version)
│               hero-temple-lotus-pond.webp
│               hero-temple-river-sunset-wide · hero-temple-river-night-wide · hero-temple-lotus-pond-wide (.webp, 16:9)
│                 wide versions for laptops and landscape screens: the temple is untouched, and the photo is
│                 continued outward from its own sky, river banks, garden and water, so it fills the screen edge to edge
│               couple-ram-sita.svg, couple-ram.svg, couple-sita.svg (illustrated version, kept as a spare; not used on the site)
├── temple/     temple-door-photo-left-leaf / right-leaf (.png/.webp, split from your door photo)
│               temple-doors-photo-closed.webp · temple-doors-closed.svg · temple-doors-open.svg
│               temple-arch.svg · mandap-pillar.svg · mandap-canopy.svg · kalash.svg
├── cards/      card-ivory-royal.svg
├── frames/     frame-invitation-gold.svg · portrait-frame-jharokha.svg · portrait-frame-oval.svg · portrait-frame-round.svg
├── flowers/    lotus-photo-bloom-01 · lotus-photo-bud (.png/.webp, real lotus cut-outs used on the site)
│               lotus-pond-photo-vignette.webp (your lotus photo, soft transparent edge)
│               lotus-bloom-01/02 · lotus-half-open · lotus-bud · lotus-leaf · petal-pink-01…05 (vector)
│               garland-marigold · garland-jasmine · toran-marigold
├── diya/       diya-brass-photo-01 · diya-brass-photo-02 (.png/.webp, real brass vilakku with flame, used on the site)
│               diya-brass-01 · diya-brass-02 · diya-clay · flame-01 · flame-02 · flame-glow (vector)
├── events/     icon-engagement · icon-haldi · icon-mehendi · icon-sangeet · icon-wedding · icon-reception
├── ornaments/  corner-gold-top-left/top-right/bottom-left/bottom-right · temple-bell · rangoli-mandala
│               chakra-lotus-mandala-maroon.webp (your original) · chakra-lotus-mandala-gold(.png/.webp/-2000.png, transparent)
│               hanuman-ram-bhakt (.png/.webp, your Hanuman picture, transparent) · heart-ram-sita-3d.webp (shown in his heart)
│               hanuman-blessing (.png/.webp, blessing Hanuman on top of the invitation card) · corner-lotus-embroidery.svg (card corners)
│               corner-gold-lotus-frame.svg (gold corner of the invitation and Vadhu & Vara) · lotus-bead-embroidery (.png/.webp, bead-work lotus in that corner)
│               lotus-zari-drawing.json (lotus drawing, stitched in gold and filled pink as it scrolls into view in Vadhu & Vara and Our Story)
│               temple-flag-saffron (.png/.webp, Ram Mandir flag from your photo, on the Save the Date poles)
├── intro/      scene-portrait · scene-wide (.webp, the opening background) · layer-sita · layer-sita-end · layer-ram · layer-blossom · layer-feather (.webp, the moving pieces) · hands-lotus-bud · hands-lotus-bloom (your two source pictures)
├── story/      lotus-embroidery (.png/.webp, badge front) · story-couple-train · story-couple-promise · story-couple-temple · story-couple-sunset (.webp, badge backs)
└── effects/    sparkle-gold · particles-gold · light-rays · firework-gold · firework-pink
```

The hero's blooming lotuses are real photo cut-outs. Each one rises as `lotus-photo-bud` and opens into `lotus-photo-bloom-01` as you scroll (see `initHero()` in `js/main.js`). To use a different couple, replace `assets/hero/couple-ram-sita-3d-cutout.webp` with any transparent PNG/WebP of the couple. Its on-screen size is set by `.hero__couple` in `css/style.css`: `height: min(50vh, 540px)` on desktop and `46vh` on phones. Update `aspect-ratio` there if your image has a different shape.

Open `asset-library.html` to browse every asset on one page.

## Credits & libraries

- [GSAP 3.12.5 + ScrollTrigger](https://gsap.com) for scroll animation, and [Lenis 1.1.13](https://lenis.darkroom.engineering) for smooth scrolling. Both load from a CDN. Without them the site still shows a complete, static invitation.
- Google Fonts: Cinzel Decorative, Cinzel, Cormorant Garamond, Pinyon Script, Tiro Devanagari Sanskrit.
- The temple, door and mandala photographs are the images you supplied. Every other illustration was drawn for this project as hand-coded SVG.
- The site respects `prefers-reduced-motion`: pinning, scrubbing, petals and fireworks switch off for guests who ask their device for less motion.
