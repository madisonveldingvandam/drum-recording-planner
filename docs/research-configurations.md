# Drum Mic Research Configurations

Research library for album drum microphone planning. This file is intentionally broader than the app template data: it preserves sources, uncertainty, rationale, and practical session notes.

## Pinkerton-Informed Raw Live-Band Rock Drums

Configuration ID: `pinkerton-informed-sound-city-electric-lady-reconstruction`

Working name: Pinkerton-informed raw live-band rock drums: Sound City / Electric Lady reconstruction

Status: Cataloged research reference.

App data note: This entry catalogs source facts, unknowns, confidence labels, and practical setup variants. No `setup-templates.json` entry has been created in this cataloging pass.

### Accuracy Boundary

No reliable Pinkerton-specific drum mic sheet has been verified. The exact kick, snare, tom, overhead, and room microphones remain undocumented in the sources checked. The exact kit, snare, cymbals, heads, preamps, compression, tape speed, phase method, sample use, and song-by-song changes are also not verified.

Use this configuration as:

- A source-backed session context for Weezer's `Pinkerton`.
- A practical 1990s live-rock drum reconstruction.
- A Sound City-informed analogy where explicitly labeled.

Do not use it as:

- A historical claim that these were the exact Pinkerton drum mics.
- A proof that Pinkerton used the same drum setup as Nirvana's `Nevermind`.
- A finished app preset without choosing specific available mics and planner coordinates.

### Sources

- Weezer `Pinkerton` album information and liner-note-derived credits: https://en.wikipedia.org/wiki/Pinkerton_(album)
- Sound City Studios history and discography context: https://en.wikipedia.org/wiki/Sound_City_Studios
- Butch Vig / Nirvana Sound City drum setup discussion, useful as analogy only: https://www.musicradar.com/drums/dave-grohl-and-nirvana-drum-week

Source reliability note: the Pinkerton page supports the broad album, studio, production, and personnel context but should still be checked against a physical booklet or official deluxe-edition credits before being treated as session paperwork. The Sound City and Nevermind references support room/era context, not Pinkerton-specific mic documentation.

### Confirmed Context

- Artist: Weezer
- Album: `Pinkerton`
- Release date: September 24, 1996
- Recording window: August 22, 1995 to late July 1996
- Producer: Weezer
- Drummer: Patrick Wilson
- Mixing / engineering credit: Jack Joseph Puig
- Other credited engineers: Joe Barresi, Dave Fridmann, Adam Kasper, Clif Norrell, Rob Jacobs, Jim Rondinelli
- Credited second engineers: Billy Bowers, Greg Fidelman, Dan McLaughlin, Jim Champagne, David Dominguez
- Mastering: George Marino
- Known studios: Electric Lady Studios, Sound City Studios, Hollywood Sound, Fort Apache, Rumbo
- Confirmed Electric Lady songs: "Why Bother?", "Getchoo", "No Other One", "Tired of Sex"
- Confirmed Sound City-related songs/sessions: "El Scorcho", "Pink Triangle", "The Good Life", "Across the Sea", "Falling for You"
- Karl Koch identified Sound City as an important part of the sound.

### Sound Goal

Raw, live, aggressive, medium-room alternative-rock drums. The target is not a polished modern pop-punk or sample-replaced drum sound. The drums should feel like a band in a room, with strong close-mic attack, audible cymbal and room interaction, dense guitars around them, and some roughness left intact.

Practical target: punchy, somewhat dark, urgent, and not overly separated. Avoid slick sample-replacement aesthetics, hard quantization, overly bright cymbal sheen, extreme close-mic isolation, and hyper-clean gated toms.

### Room Notes

Use a medium-to-large live room with hard floor reflections, controlled but lively ambience, and enough space to place room mics 10 to 18 ft from the kit. Avoid a small dead booth unless there is another way to create depth, such as a hallway mic, chamber, or re-amped room.

Sound City variation: let the room mics matter more. The room identity is central to the practical translation.

Electric Lady variation: use the same close/overhead framework, but do not assume the Sound City room is the source of the sound unless stronger song-specific evidence appears.

Planner room approximations:

- Electric Lady minimum preset: 35 ft W x 38 ft L x 14 ft H. Footprint is from Electric Lady's published Studio A live-room size; height is an app approximation until verified.
- Sound City expanded preset: 38 ft W x 43 ft L x 20 ft H. Exact dimensions were not verified; this is an app approximation based on Sound City room context and the 15 to 18 ft room-mic distance in the comparison source.

### Kit Notes

Confirmed only: Patrick Wilson played drums on the album. Karl Koch is credited with percussion on "Butterfly".

Practical substitute:

- Classic 1990s rock kit.
- 22 inch kick as the safest starting point.
- 12 or 13 inch rack tom.
- 16 inch floor tom.
- Optional 18 inch floor tom.
- 24 inch kick only if the arrangement needs more weight and the drummer controls it well.

Snare approach:

- Primary: 14x6.5 metal snare, brass or steel, for crack and body.
- Alternate: 14x5.5 or 14x6.5 maple snare for a woodier center.
- Tune medium to medium-high with some ring intact.
- Use minimal damping only if ring masks the vocal or guitar arrangement.

Cymbal approach:

- Medium-thin, darker cymbals that do not dominate the overheads.
- 14 or 15 inch hats.
- 18, 19, or 20 inch crashes.
- 20 or 22 inch ride.
- Avoid overly brilliant modern crashes.

### Mic Plan

#### Kick Close

Mic options: AKG D12 / D112, EV RE20, Beyerdynamic M88, Sennheiser MD421, Shure Beta 52, or similar large dynamic.

Pattern: cardioid or hypercardioid depending on mic.

Placement: ported head: just inside or at the port, aimed between beater impact and shell center. Intact front head: 4 to 10 inches off the resonant head.

Height / angle: approximately beater height or slightly below center; 0 to 30 degrees off-axis to reduce click.

Phase: use kick close as the low-frequency anchor. Check polarity against overheads and room mics. Preserve some room delay unless the low end collapses.

Processing: moderate EQ. Look for weight around 60 to 80 Hz, reduce boxiness around 250 to 500 Hz if needed, add 3 to 5 kHz only if guitars bury the kick. Compress 2 to 5 dB with dbx 160 / 1176 / Distressor-style behavior. Avoid modern metal click.

Confidence: inferred for Pinkerton. AKG D12 is documented in the Nevermind Sound City analogy, not as a Pinkerton fact.

#### Kick Outside / Front Low Support

Mic options: FET 47, U47-style tube/FET mic, RE20, or large dynamic/condenser.

Pattern: cardioid, or omni in an excellent room.

Placement: 1 to 3 ft in front of resonant head, centered or slightly off-axis.

Height / angle: roughly kick-center height. Angle off-axis until low end is full without excessive beater slap.

Phase: check polarity against kick-in and overheads. Move the mic physically before using digital delay.

Processing: low-pass or darken if cymbal bleed is harsh. Blend under kick-in for body. Compress lightly or not at all.

Confidence: plausible practical addition, unconfirmed for Pinkerton.

#### Snare Top

Mic options: Shure SM57, Beyerdynamic M201, Sennheiser MD441, or equivalent mid-forward dynamic.

Pattern: cardioid or hypercardioid.

Placement: 1 to 2 inches above rim, 1 to 2 inches inside hoop, aimed toward center.

Height / angle: 30 to 45 degrees downward. Rotate to minimize hi-hat bleed.

Phase: check against overheads first, then kick. If snare bottom is used, start by polarity-inverting the bottom and choose by ear.

Processing: high-pass around 80 to 120 Hz. Add body around 180 to 250 Hz if thin; add crack around 5 to 8 kHz if needed. Use fast 1176-style compression only enough to stabilize the backbeat. Keep some ring.

Confidence: inferred for Pinkerton. SM57 snare is documented in the Nevermind Sound City analogy, not as Pinkerton documentation.

#### Snare Bottom

Mic options: AKG 451, KM84-style small condenser, SM57, or similar.

Pattern: cardioid.

Placement: 1 to 3 inches under the snare, aimed toward the wires but not directly at the loudest rattle point.

Phase: usually polarity-inverted relative to snare top, then verified in mono.

Processing: aggressive high-pass. Blend only enough for wire definition. Distortion or compression can work if blended low.

Confidence: guess / practical option. AKG 451 under-snare is only supported by the Nevermind analogy.

#### Rack Tom

Mic options: Sennheiser MD421, Beyerdynamic M201, Shure SM57, Audix D2/D4, or similar dynamic.

Pattern: cardioid.

Placement: 1 to 3 inches above head, near rim, aimed toward center.

Height / angle: 30 to 45 degrees down; angle null toward nearest crash.

Phase: check close tom mics against overheads. Avoid changes that thin the snare image.

Processing: minimal gating. Manual cleanup if needed. Add low-mid body, cut cardboard, compress only if fills disappear.

Confidence: inferred. MD421 toms are documented in the Nevermind Sound City analogy, not Pinkerton.

#### Floor Tom

Mic options: Sennheiser MD421, RE20, Beyerdynamic M88, FET condenser, or similar.

Pattern: cardioid.

Placement: 1 to 4 inches above head, aimed halfway between rim and center.

Height / angle: 30 to 45 degrees; avoid pointing directly at a cymbal edge.

Phase: check against overheads and rack toms. Floor tom polarity can alter the whole kit low-mid image.

Processing: keep weight but control boom. Gate only if sympathetic resonance creates arrangement problems.

Confidence: inferred.

#### Stereo Overheads

Mic options: AKG 414, Neumann U87, KM84-style condensers, or Coles/Royer ribbons for a darker cymbal picture.

Pattern: cardioid or wide cardioid. Omni only in a strong room.

Placement: spaced pair or wide quasi-ORTF above the kit. Exact Pinkerton overhead method is unknown.

Height: start 3 to 5 ft above cymbals, with both mics equidistant from the snare. Raise if cymbals are too aggressive; lower if drums lack immediacy.

Phase: measure to snare. Check mono before tracking. Adjust until the snare remains centered and full.

Processing: high-pass between 80 and 150 Hz depending on close-mic low end. Avoid excessive top-end boost. Prefer tape/console saturation over bright modern EQ if excitement is needed.

Confidence: inferred. AKG 414 overheads are documented in the Nevermind Sound City analogy, not Pinkerton.

#### Stereo Room Mics

Mic options: Neumann U87, AKG 414, FET 47, ribbon pair, or other full-range room-capable mics.

Pattern: cardioid, omni, or figure-8 depending on room.

Placement: start 10 to 18 ft in front of kit, facing the snare/kick center. Move until the room gives punch rather than wash.

Height: chest to head height first. Try knee height if the room sounds too bright.

Phase: check polarity against close-mic kit. Preserve natural delay for size. If the backbeat smears, move the mics before aligning them.

Processing: hard parallel compression using 1176 all-buttons, Distressor, SSL listen-mic style, dbx 160 pair, or equivalent. High-pass enough to keep kick close solid. Low-pass if cymbals become abrasive. Blend under close mics.

Confidence: strongly supported inference, not confirmed for Pinkerton. Sound City's drum-room reputation is documented, and the Nevermind Sound City analogy used U87 room mics roughly 15 to 18 ft back.

#### Mono Front-of-Kit / Crush

Mic options: SM57, EV 635A, RE20, Coles 4038, AKG 414, or any character mic.

Pattern: cardioid, omni, or figure-8.

Placement: 3 to 6 ft in front of kit, aimed at the kick/snare intersection.

Height: knee to waist height. Lower placement gives more kick/tom density; higher placement gives more snare/cymbal bite.

Phase: check against kick, snare, and overheads. Use polarity for punch, not brightness.

Processing: heavy compression and saturation. Blend as aggression, not fidelity. Mute or automate down if it clouds verses.

Confidence: plausible practical substitute for raw room energy, unconfirmed for Pinkerton.

#### Hi-Hat

Mic options: KM84, AKG 451, SM81, SM57, or omit.

Pattern: cardioid.

Placement: 4 to 8 inches above outer edge, aimed away from snare.

Angle: across the cymbal rather than straight down to reduce harsh air blasts.

Phase: check against overheads. Often leave muted unless articulation is needed.

Processing: high-pass aggressively. Use sparingly.

Confidence: guess / practical option. No Pinkerton hi-hat mic documentation found.

### Session Priorities

1. Choose a drummer who can deliver aggressive, consistent takes.
2. Choose a room with useful reflections.
3. Pick snare and cymbals that survive dense guitars.
4. Check phase coherence before EQ.
5. Use close mics for punch and room/crush mics for scale.
6. Favor natural performance feel over sample-replaced perfection.

### Engineering Checklist

- Measure overheads to the snare.
- Check polarity in mono.
- Move mics before using digital alignment.
- Let the drummer balance the kit physically.
- Control cymbals at the source.
- Commit to room tone if the room sounds good.
- Use room compression for aggression.
- Avoid default sample replacement.

### Studio Booking Questions

- Can the room support room mics 10 to 18 ft from the kit?
- What console and preamps are available?
- Can the engineer commit to phase checking before EQ?
- Are multiple snares available?
- Is tape or tape-style saturation available?
- Can the session prioritize drum tuning and room placement before close-mic tweaking?
- Can the studio provide a hallway, chamber, or alternate ambient space if the live room is too small?

### App Data Notes

Candidate setup labels from research notes:

- `pinkerton-informed-minimum-rock-room`: kick close, snare top, rack tom, floor tom, stereo overheads, mono front/crush.
- `pinkerton-informed-sound-city-expanded`: kick in, kick out, snare top, snare bottom, rack tom, floor tom, stereo overheads, stereo room, mono crush, optional hat.

Cataloging note: these are labels and channel groupings only. No planner coordinates or compact app template entries were created in this pass.

### Unresolved Questions

- Exact Pinkerton drum kit, snare, cymbals, and heads.
- Exact mic list and placement.
- Exact preamps, console channels, outboard, tape speed, tape formulation, and noise reduction.
- Song-specific drum setup changes.
- Whether samples or triggers were used.
- Exact room placement, gobos, baffles, risers, and room-mic balance.
- Whether a physical album booklet or official deluxe notes provide more precise session documentation.

## Interpol / Antics / Tarquin Room-Heavy Hybrid Drums

Configuration ID: `interpol-antics-tarquin-room-heavy-hybrid`

Working name: Interpol / Antics / Tarquin room-heavy hybrid drum configuration

Status: Cataloged research reference with direct Antics-specific source facts.

App data note: This entry catalogs source facts, unknowns, confidence labels, and practical setup variants. No `setup-templates.json` entry has been created in this cataloging pass.

### Accuracy Boundary

This configuration has direct Antics-era source support because the primary Tape Op source is an interview with Sam Fogarino and Daniel Kessler. It directly supports the room-heavy drum concept, Tarquin tracking context, click-track approach, tape/Pro Tools workflow, two snare options, Sound Replacer restraint, and the Altec 639 / Telefunken ELA M 251 extreme-room choices.

Do not treat the conventional kick, snare, tom, overhead, and spot-mic suggestions as confirmed Antics paperwork. Those are practical substitutes for an app/studio planning template.

### Sources

- Tape Op, Issue #43, "Interpol: Attic recording," September 2004: https://tapeop.com/interviews/43/interpol
- Tape Op, Issue #31, "Tarquin Studios: Making records in the attic," September 2002: https://tapeop.com/interviews/31/tarquin-studios/
- MusicRadar Peter Katis interview, last updated April 7, 2021: https://www.musicradar.com/news/i-use-amp-modellers-all-the-time-mostly-not-on-guitar-an-interview-with-the-national-interpol-producer-peter-katis
- Antics album-credit transcription: https://en.wikipedia.org/wiki/Antics_%28album%29

Source reliability note: the Tape Op Interpol interview is the highest-value source because it is album-current and includes direct Fogarino comments about the drum setup. The Tarquin Tape Op profile is strong for studio room/gear context but predates Antics. MusicRadar is useful later context for Tarquin as a residential studio. The Antics album page is useful for broad credits/date/studio context, but it is not a scanned primary booklet.

### Confirmed Context

- Artist: Interpol
- Album: `Antics`
- Year: 2004
- Recording window: March to May 2004
- Studio: Tarquin Studios, Bridgeport, Connecticut
- Drummer: Sam Fogarino
- Producer / recording / mixing: Peter Katis
- Assistant engineer: Greg Giorgio
- Mastering: Greg Calbi at Sterling Sound

### Sound Goal

Controlled, warm, direct post-punk/indie-rock drums with close-mic punch and a meaningful room component. The rooms should add breath and physical movement around the close kit, not arena-rock wash. The kit should support precise bass/guitar arrangements, stay slightly dark, and avoid a bright, sample-replaced modern rock finish.

Confirmed production direction: room mics were a major part of the drum tone, Sound Replacer was used only lightly, and click tracks were used selectively rather than as a rigid full-album grid.

### Room Notes

Confirmed Antics tracking context:

- Tarquin was Peter Katis's home-based Bridgeport studio.
- The band used a rehearsal-style setup so the drummer could see the other members.
- Guitar and bass amps were isolated away from the drums.
- Paul's guitar amp was in an iso booth.
- Daniel's guitar amp was in a reflective storage-room/closet area with hardwood floors.
- Carlos's bass amp was in a smaller closet.
- This left the main room open for drums.
- Fogarino described the drum room as medium-sized rather than gigantic.

Confirmed Tarquin room/build context:

- Tarquin was built into the top floor/attic of a large Victorian house.
- The live room had a wood floor.
- The studio context supports a residential, medium-room approach rather than a dead commercial booth.

Unknown:

- Exact drum-room dimensions.
- Ceiling height at the drum position.
- Exact wall and ceiling materials during Antics.
- Exact gobo placement.
- Exact drum position.
- Whether baffles, blankets, risers, or unusual drum-specific treatments were used.

Practical substitute: use a medium live room with reflective surfaces, wood floor if possible, enough ceiling height for the kit to breathe, and at least one far-room/hallway/stairwell/doorway position for a mono extreme-room mic. Avoid a totally dead booth unless another ambient space can be captured or re-amped.

Planner room approximation: 26 ft W x 30 ft L x 12 ft H for both Antics presets. This is approximate app geometry based on the Tarquin top-floor/residential live-room context, not a documented Tarquin room measurement.

### Kit Notes

Confirmed:

- Fogarino brought his own kit.
- He knew what heads he wanted.
- He used new heads except for the snare head, which was slightly broken in.
- He used a 6.5 inch brass snare and a 5 inch wood snare.

Unknown:

- Kit brand/model.
- Kick size and heads.
- Tom sizes and tuning.
- Cymbal makes/models.
- Stick model.
- Muffling.
- Song-by-song kit, tuning, or cymbal changes.

Practical substitute:

- Use the drummer's most familiar, best-sounding kit.
- Fresh kick and tom heads.
- Slightly broken-in snare head.
- Controlled, articulate toms.
- Focused kick without exaggerated modern click.
- Dark or controlled cymbals that do not dominate overheads and room mics.
- Prepare one deeper brass snare and one tighter wood snare before the session.

### Confirmed Mic And Workflow Facts

#### Room Mics

Fogarino confirms substantial room-mic use, says the room tracks were used heavily in the mix, and describes an extreme/furthest room mic that could be mono and heavily compressed.

Confirmed extreme-room options:

- Altec 639 birdcage ribbon mic.
- Telefunken ELA M 251 large-diaphragm condenser.

Confidence: confirmed model/role, unknown exact placement/pattern/processing per song.

Practical takeaway: design the session around a mono far-room/crush option. A dark ribbon, vintage dynamic, tube large-diaphragm condenser, or character mic can substitute when the exact Altec or Telefunken is unavailable.

#### Close Mics

Close mics are indirectly confirmed by Fogarino's contrast between room mics and the close drum sound, but exact close-mic models and placements are not publicly documented.

Confidence: confirmed close/room architecture; unknown specifics.

Practical takeaway: build a conventional close-mic foundation on kick, snare, toms, and possibly hi-hat, then use room mics as a major tonal component rather than an afterthought.

#### Tape / Pro Tools / Console

Confirmed:

- 24-track 2-inch 456 tape was used, then filled reels were bounced/transferred into Pro Tools.
- Mixing was from Pro Tools out to the Neotek console and back into Pro Tools as stems.
- Tarquin had a Neotek console and an old Studer 2-inch deck described as an A80 Mark II with a Mark III headstack.

Confidence: confirmed Antics workflow for tape/Pro Tools/Neotek; confirmed Tarquin gear context for Neotek/Studer.

Practical takeaway: a hybrid analog/digital workflow is appropriate. Tape is ideal but not mandatory if saturation, analog gain staging, and room compression are handled musically.

#### Compression / Outboard Context

Confirmed Tarquin context, not Antics-specific per channel:

- UREI 1176.
- LA4s.
- Tube-Tech CL1B.
- Neve 33609.
- Distressors.
- dbx 162.
- Katis said he used the dbx 162 almost exclusively for drums.

Confidence: confirmed studio inventory/context; medium for exact Antics drum-chain reconstruction.

Practical takeaway: have fast FET, dbx/VCA-style, and aggressive room-compression options available.

#### Sound Replacer And Click

Confirmed:

- Sound Replacer was used a little, but not to replace sounds they worked hard to capture.
- Click use varied. Some songs or sections used a click; some sections or tracks did not, to preserve human rushing/slowing.

Confidence: confirmed.

Practical takeaway: sample reinforcement is acceptable as subtle support only. Use click selectively instead of forcing every song into a rigid grid.

### Practical Reproduction Mic Plan

#### Kick In

Mic options: AKG D112, Shure Beta 52A, Audix D6, EV RE20, Beyerdynamic M88, or similar dynamic kick mic.

Pattern: cardioid or hypercardioid depending on mic.

Placement: inside the drum or just at the port, aimed toward the beater but not overly focused on click.

Phase: check polarity and timing against kick out, overheads, and room mics.

Processing: moderate EQ and compression. Avoid exaggerated modern metal click.

Confidence: inferred practical substitute.

#### Kick Out

Mic options: large dynamic, FET condenser, tube condenser, or subkick.

Pattern: cardioid, omni, or figure-8 depending on mic and room.

Placement: 6 to 24 inches outside resonant head.

Phase: check polarity against kick in; do not assume polarity flip is automatically correct.

Processing: blend for low-end weight and air.

Confidence: inferred practical substitute.

#### Snare Top

Mic options: Shure SM57, Beyerdynamic M201, Audix i5, Telefunken M80, Sennheiser MD441, or similar.

Pattern: cardioid or hypercardioid.

Placement: 1 to 3 inches above rim, angled across the head.

Phase: check against overheads and snare bottom.

Processing: medium compression only if needed. Preserve ghost notes and dynamics.

Confidence: inferred practical substitute.

#### Snare Bottom

Mic options: small dynamic or condenser.

Pattern: cardioid.

Placement: 1 to 3 inches below wires.

Phase: usually polarity-reversed against snare top, but confirm by ear.

Processing: blend lightly for wire detail.

Confidence: inferred practical substitute.

#### Toms

Mic options: Sennheiser MD421, Sennheiser e604/e904, Beyerdynamic M201, Josephson e22S, or equivalent dynamics/condensers.

Pattern: cardioid or hypercardioid.

Placement: close, above rim, angled toward strike zone.

Phase: check against overheads and room mics.

Processing: gate lightly only if the arrangement requires it. Keep toms connected to the room.

Confidence: inferred practical substitute.

#### Overheads

Mic options: smooth condensers, darker small-diaphragm condensers, ribbons, or mellow large-diaphragm condensers.

Pattern: cardioid, omni, or figure-8 depending on room.

Placement: spaced pair or ORTF as a starting point.

Phase: measure/check snare-centered arrival if using a spaced pair.

Processing: avoid over-brightening. Cymbals should sit inside the band rather than above it.

Confidence: unknown historical method / inferred practical substitute.

#### Near Room Pair

Mic options: ribbon pair, large-diaphragm condenser pair, or smooth omni pair.

Pattern: figure-8, omni, or cardioid.

Placement: 6 to 12 ft from kit.

Height: chest to head height.

Phase: check mono compatibility and relationship to close mics.

Processing: mild compression. Blend for width and size.

Confidence: inferred practical substitute.

#### Mono Extreme Room

Mic options: Altec 639, Telefunken ELA M 251, dark ribbon, tube LDC, old dynamic, or character condenser.

Pattern: session pattern unknown; choose figure-8, omni, or cardioid by room.

Placement: farthest useful room position, hallway, doorway, stairwell, or reflective adjoining space.

Height: try chest height, head height, and low placements; choose by groove and cymbal control.

Phase: do not automatically time-align. Preserve delay if it adds movement and size.

Processing: compress aggressively with 1176, Distressor, dbx 160/162-style compression, or equivalent. Blend under close mics.

Confidence: confirmed concept/model options / inferred placement.

#### Trash / Character Room

Mic options: cheap dynamic, harmonica mic, old ribbon, consumer mic, or condenser through distortion.

Pattern: any.

Placement: reflective corner, hallway, floor, stairwell, or behind a door.

Processing: crush, distort, filter, or gate.

Confidence: guess / optional creative adaptation.

### Variations

- Brass snare variation: 6.5 inch brass snare for bigger, heavier, more authoritative songs.
- Wood snare variation: 5 inch wood snare for tighter, drier, more contained songs.
- Altec-style extreme room: darker, characterful mono far room.
- ELA M 251-style extreme room: smoother, more hi-fi tube-condenser far room.
- Click variation: use click only where the arrangement needs precision; allow human tempo movement where it helps.
- Reinforcement variation: use Sound Replacer-style support sparingly and never as the main drum identity.

### Song-By-Song Inferences

Public sources do not document song-by-song drum mic choices, snare choices, room-mic choices, or mix settings. These notes are arrangement-based inference only.

- "Next Exit": controlled and spacious; keep room blend subtle and intimate.
- "Evil": tight kick/snare articulation; room adds motion without blurring groove.
- "Narc": dry, forward snare with controlled cymbals; room adds body, not explosion.
- "Take You on a Cruise": allow more atmosphere as sections expand.
- "Slow Hands": prioritize transient clarity and tight low end; tuck compressed room underneath.
- "Not Even Jail": deeper brass snare and more crushed mono room are practical.
- "Public Pervert": restrained room blend; avoid unnatural pumping.
- "C'mere": present, dry-enough snare that leaves room for vocal and guitars.
- "Length of Love": rhythmic clarity over huge ambience; filter/compress rooms to avoid clouding bass/guitar motion.
- "A Time to Be So Small": distant room character can help, but keep drum image understated.

### App Data Notes

Candidate setup labels from research notes:

- `antics-minimum-room-hybrid`: kick in, snare top, toms as needed, stereo overheads, mono extreme room.
- `antics-tarquin-expanded-room`: kick in/out, snare top/bottom, rack tom, floor tom, stereo overheads, near room pair, mono extreme room, optional trash mic.

Cataloging note: these are labels and channel groupings only. No planner coordinates or compact app template entries were created in this pass.

### Studio Booking Questions

- Do you have a medium live room with wood floor or lively surfaces?
- Can guitar and bass amps be isolated while the drummer remains visually connected to the band?
- Is there a hallway, stairwell, doorway, or distant room position for a mono far-room mic?
- Do you have ribbons or tube condensers suitable for room mics?
- Do you have compressors suitable for crushed room sounds, such as 1176, Distressor, dbx 160/162, or equivalents?
- Can we track to tape, or create a tape-like saturation stage during tracking or mix?
- Can the engineer print or monitor compressed room mics during tracking?
- Can we avoid over-editing and preserve human tempo movement where appropriate?
- Can we set up two snare options and switch by song?
- Can we audition room mics before committing to drum sounds?

### Unresolved Questions

- Exact kick mic or mics.
- Exact snare mic or mics.
- Exact overhead microphones and overhead technique.
- Exact tom microphones.
- Exact hi-hat or ride spot mics.
- Exact room mic distances and heights.
- Exact compressor used on the far-room mic.
- Exact preamps per microphone.
- Exact tracking EQ.
- Exact tape speed and noise-reduction details.
- Exact converter models.
- Exact mix plug-ins.
- Song-by-song snare choices.
- Song-by-song room-mic choices.
- Song-by-song sample reinforcement.
- Exact drum kit brand/model, kick size, tom sizes, cymbals, sticks, and muffling.

## Yeah Yeah Yeahs / Fever to Tell / Headgear Raw-Trio Drums

Configuration ID: `yeah-yeah-yeahs-fever-to-tell-headgear-raw-trio`

Working name: Yeah Yeah Yeahs - Fever to Tell / Headgear raw-trio drum configuration

Status: Cataloged research reference.

App data note: This entry catalogs source facts, unknowns, inferred/guess confidence labels, and practical setup variants. No `setup-templates.json` entry has been created in this cataloging pass.

### Accuracy Boundary

Main confirmed source facts come from album-credit-derived sources and studio-history sources. Fever to Tell was recorded at Headgear Studio in Williamsburg/Brooklyn, produced by David Andrew Sitek and Yeah Yeah Yeahs, engineered by Paul Mahajan, mixed mainly by Alan Moulder and Nick Zinner at Eden Studios, with some tracks mixed by David Andrew Sitek.

Exact drum microphones, kit, cymbals, mic placements, preamps, tape machine, drum processing, and room setup are not publicly documented in the reliable sources checked.

### Sources

- Fever to Tell album credits and personnel: https://en.wikipedia.org/wiki/Fever_to_Tell
- Headgear Studio background: https://en.wikipedia.org/wiki/Headgear_Studio
- Yeah Yeah Yeahs band history / trio context: https://en.wikipedia.org/wiki/Yeah_Yeah_Yeahs
- Pitchfork review describing guitar/drums rock presentation and forceful percussion: https://pitchfork.com/reviews/albums/8888-fever-to-tell
- Karen O New Yorker interview discussing the "Maps" demo origin: https://www.newyorker.com/culture/the-new-yorker-interview/karen-o-has-found-a-more-joyful-kind-of-wildness

### Confirmed Context

- Artist: Yeah Yeah Yeahs
- Album: `Fever to Tell`
- Year: 2003
- Drummer: Brian Chase
- Producer: David Andrew Sitek and Yeah Yeah Yeahs
- Recording engineer: Paul Mahajan
- Tracking studio: Headgear Studio, Williamsburg/Brooklyn, New York
- Mix studio: Eden Studios, London, for the Moulder/Zinner mixes
- Mixing: Alan Moulder and Nick Zinner on tracks 1-7, 9, and 10; David Andrew Sitek on tracks 8 and 11
- Mastering: Howie Weinberg at Masterdisk, New York
- Editing: Roger Lian is credited for track/digital editing; the exact nature of drum editing is not publicly documented.

### Sound Goal

Raw, fast, midrange-forward, physical drums that sound like a band playing in a room rather than a polished modern rock production. The target is urgent and compact, not glossy, wide, hi-fi, or sample-replaced.

Kick and snare carry the momentum because the arrangements are guitar/vocal/drum-focused. Overheads keep the kit connected. Room/crush mics add danger or explosion where the song needs it.

### Room Notes

Confirmed: Fever to Tell was recorded at Headgear Studio in Williamsburg/Brooklyn, New York.

Unknown:

- Exact live room or drum room.
- Room dimensions.
- Ceiling height.
- Floor and wall materials.
- Gobos, baffles, blankets, risers, hallway use, or chamber use.

Practical substitute from research notes: use a small-to-medium live room with attitude, fast reflections, and controlled decay. A wood, brick, plaster, or concrete room with movable absorption is a practical substitute. Avoid a huge polished rock room unless room mics can be kept tight and aggressive.

Planner room approximation: 24 ft W x 30 ft L x 12 ft H for both Fever to Tell presets. This is approximate app geometry based on Headgear studio context; exact Headgear live-room dimensions were not found.

### Kit Notes

Confirmed: Brian Chase played drums.

Unknown:

- Kit brand.
- Kick size.
- Snare model, size, and material.
- Tom sizes.
- Heads.
- Sticks.
- Muffling.
- Cymbals.
- Whether the kit changed between songs.

Practical substitute from research notes:

- Simple rock kit.
- 20 or 22 inch kick.
- One rack tom.
- One floor tom.
- Small cymbal setup.
- Two snares: one higher, cutting, and ringy enough for fast punk articulation; one drier and fatter for restrained songs such as "Maps".
- Controlled and musical cymbals rather than extremely bright or washy cymbals.

### Mic Plan

#### Kick Drum

Mic options: AKG D112, Shure Beta 52, EV RE20, Sennheiser MD421, Audio-Technica ATM25, or equivalent dynamic kick/large dynamic mic.

Pattern: cardioid.

Placement: inside the port if the resonant head is ported, or just outside the resonant head if unported. Aim off-center toward beater impact.

Height / distance / angle: around beater height; 2 to 8 inches from resonant head or just inside shell; angle slightly away from excessive click if the drummer plays hard.

Phase: check polarity against the mono overhead or main kit mic first, then against room mics. Kick should gain punch when combined, not lose low end.

Processing: avoid overly modern kick. Use modest low-end shaping around 60 to 80 Hz only if needed, remove sub-rumble, and add beater definition only enough for tempo clarity. Avoid sample replacement unless intentionally departing from the original approach.

Confidence: guess. No reliable public source found confirms original kick mic or placement.

#### Snare Top

Mic options: Shure SM57, Beyerdynamic M201, Audix i5, Sennheiser MD441, or equivalent dynamic.

Pattern: cardioid or hypercardioid.

Placement: above rim, pointed toward center, with null aimed toward hi-hat.

Height / distance / angle: 1 to 2 inches above head, 30 to 45 degrees downward.

Phase: align by ear with overhead or mono kit mic. If mono overhead is the main kit picture, tune snare polarity to that mic rather than only to close kick.

Processing: high-pass only as needed. Preserve midrange crack. Compression should be fast but not flattening; a few dB from an 1176-style or dbx-style compressor is enough if printing.

Confidence: guess. No reliable public source found confirms original snare mic or placement.

#### Snare Bottom, Optional

Mic options: SM57, small-diaphragm condenser, MD441, or equivalent.

Pattern: cardioid.

Placement: under snare, aimed at wires.

Height / distance / angle: 2 to 4 inches below bottom head, angled to reduce kick spill.

Phase: polarity usually inverted relative to snare top; verify by ear.

Processing: blend only for wire articulation. Do not make the snare too slick or modern.

Confidence: guess.

#### Rack Tom / Floor Tom

Mic options: Sennheiser MD421, e604/e904, Beyerdynamic M201, ATM25, or equivalent.

Pattern: cardioid.

Placement: close, above rim, angled toward center.

Height / distance / angle: 1 to 3 inches above head, 30 to 60 degrees downward.

Phase: check against overhead or mono kit mic. Toms should add body without hollowing out the kit image.

Processing: avoid aggressive gating while tracking. Use editing or automation later if necessary.

Confidence: guess. No reliable public source found confirms original tom mics, tom sizes, or whether close tom mics were used.

#### Mono Overhead / Central Kit Picture

Mic options: Coles 4038, Royer R-121/R-122, AEA R84/R92, RCA-style ribbon, Neumann U67/U87, AKG 414, Shure SM7B, EV RE20, or equivalent ribbon/dynamic/darker condenser.

Pattern: figure-8 for ribbons; cardioid for condensers/dynamics, depending on room.

Placement: above kit, centered around snare/kick relationship rather than cymbal glamour.

Height / distance / angle: 3 to 5 ft above snare, aimed between snare and kick, adjusted until kick and snare feel balanced.

Phase: make this the phase anchor. Add close mics around it. Check that kick and snare do not hollow out when close mics are introduced.

Processing: compress lightly to moderately if it creates forward motion. Roll off harsh top end if cymbals dominate.

Confidence: inferred. No source confirms this exact technique; research notes identify it as a practical way to recreate compact, urgent drum presentation.

#### Stereo Overheads, Optional

Mic options: small-diaphragm condensers, ribbons, or darker large-diaphragm condensers.

Pattern: cardioid, figure-8, or omni depending on room.

Placement: narrow spaced pair, ORTF, or low/wide pair kept controlled. Avoid exaggerated modern width.

Height / distance / angle: 3 to 5 ft above cymbals; start lower than hi-fi rock setup and adjust to reduce splash.

Phase: keep both overheads equidistant from snare if using spaced pair. Check mono compatibility.

Processing: high-pass enough to leave kick/snare close mics stable, but do not remove all body.

Confidence: guess. Original overhead method is not publicly documented.

#### Front-Of-Kit / Mono Room / Crush Mic

Mic options: EV RE20, Shure SM7B, Coles 4038, Royer R-121, AEA ribbon, Neumann FET 47, U87, AKG 414, or equivalent large dynamic/ribbon/condenser.

Pattern: cardioid, figure-8, or omni depending on room.

Placement: in front of kit, aimed between kick and snare.

Height / distance / angle: 3 to 8 ft in front of kit, 3 to 5 ft high. Start near drummer chest height facing kit.

Phase: check polarity and timing against kick, snare, and overhead. Use whichever polarity gives more low-mid punch. Delay-align only if it improves impact; natural lateness may help excitement.

Processing: use as a parallel aggression channel. Try 1176 all-buttons, Distressor, dbx 160, LA-3A, TG-style limiting, tape saturation, or console distortion. Blend under close mics.

Confidence: plausible but unconfirmed speculation. No source confirms a crush mic or room mic.

#### Far Room / Hallway, Optional

Mic options: omni condensers, ribbons, or mono dynamic.

Pattern: omni, figure-8, or cardioid.

Placement: far end of live room, hallway, stairwell, or reflective boundary if available.

Height / distance / angle: 10 to 25 ft from kit if room allows; lower placement for thump, higher placement for cymbal/air.

Phase: treat as an effect return. Do not force it to be phase-perfect if lateness creates size.

Processing: heavy compression, saturation, or gating can be used for choruses/noise sections. Mute or lower it for tight verses.

Confidence: guess. No reliable public source found documents far-room or hallway mics on the album.

#### Hi-Hat, Optional

Mic options: Neumann KM84/KM184, AKG 451, Shure SM81, Josephson-style small-diaphragm condenser, or equivalent.

Pattern: cardioid.

Placement: above outer edge of hats, aimed away from snare.

Height / distance / angle: 4 to 8 inches above hats, angled across rather than straight down.

Phase: check against snare top and overhead.

Processing: high-pass aggressively. Use only if arrangement needs extra hat articulation; otherwise leave muted.

Confidence: guess. No reliable public source found confirms a hi-hat mic.

### Variations

- Minimum viable setup: kick, snare top, mono overhead, mono front-of-kit/crush mic.
- Expanded setup: kick, snare top/bottom, rack tom, floor tom, mono overhead, narrow stereo overheads, front-of-kit crush mic, one room/hall mic, optional hi-hat.
- "Maps" variation: less crush, less room, softer cymbal balance, and a more emotionally restrained snare/kick image. Karen O described the song origin as a drum-machine/four-track demo; this is demo-process context, not proof of final album drum-machine replacement.
- "Y Control" variation: push room/crush compression harder. Pitchfork review language supports forceful percussion as a review description, not a session technique.
- Fast-song variation: "Date with the Night", "Rich", "Tick", "Black Tongue", and "Pin" prioritize transient urgency, controlled cymbal wash, and midrange snare/kick.
- "No No No" variation: automate room/crush mic upward during chaotic sections and keep close kit more controlled in tighter sections.

### App Data Notes

Candidate setup labels from research notes:

- `fever-to-tell-minimum-raw-trio`: kick, snare top, mono overhead, mono front/crush.
- `fever-to-tell-expanded-headgear`: kick, snare top/bottom, rack tom, floor tom, mono overhead, narrow stereo overheads, front/crush, far room/hall, optional hi-hat.

Cataloging note: these are labels and channel groupings only. No planner coordinates or compact app template entries were created in this pass.

### Unknown / Not Publicly Documented

- Exact drum kit.
- Kick size/model/head choice.
- Snare model, size, material, tuning, and dampening.
- Tom sizes and tuning.
- Cymbal models.
- Drumheads, sticks, tape, wallets, gels, blankets, rings, tea towels, or other muffling.
- Exact microphones.
- Exact mic placements.
- Overhead technique.
- Room mic technique.
- Console, preamps, compressors, EQ, tape machine, tape speed, tape formulation, converters.
- Samples, triggers, quantization, or drum replacement.
- Nature of credited track/digital editing.

### Final Practical Checklist

- Use a simple, well-tuned rock kit.
- Use a 20 or 22 inch kick.
- Use one rack tom and one floor tom unless the arrangement demands more.
- Bring two snares: one cutting/ringy and one drier/fatter.
- Use controlled cymbals, not overly bright or washy cymbals.
- Book a small-to-medium live room with fast reflections and character.
- Start with kick, snare top, mono overhead, and mono front-of-kit/crush mic.
- Add stereo overheads, tom mics, snare bottom, far room, and hi-hat only as needed.
- Make mono overhead or front-of-kit mic the emotional center of the drum sound.
- Check phase from the mono kit picture outward.
- Use compression for urgency, not polish.
- Good compression options: 1176-style, dbx-style, Distressor-style, LA-3A-style, TG-style, console/tape saturation.
- Avoid default sample replacement.
- Keep cymbals controlled in tracking.
- Automate or blend room/crush mics differently by song section.
- Ask studios about room decay, ribbons/dynamics, mono room/crush options, FET/dbx/Distressor-style compressors, console/preamp character, and comfort building from a mono kit image.

## Gang Of Four / Solid Gold / Dry-Close Dense Funk-Punk Drums

Configuration ID: `gang-of-four-solid-gold-dry-close-funk-punk`

Working name: Gang of Four / Solid Gold - dry-close, dense funk-punk drum configuration

Status: Cataloged research reference.

App data note: This entry catalogs source facts, unknowns, confidence labels, and practical setup variants. No `setup-templates.json` entry has been created in this cataloging pass.

### Accuracy Boundary

Confirmed source facts cover the album, recording date, Abbey Road studio credit, Jimmy Douglass engineering credit, band/producer credit, Hugo Burnham drum credit, and later analog-tape remaster context. Exact drum room, kit, microphones, mic placements, console path, preamps, EQ, compression, tape speed, tape formulation, and song-specific drum setup changes are not publicly documented in the reliable sources checked.

### Sources

- Solid Gold album/session overview: https://en.wikipedia.org/wiki/Solid_Gold_%28album%29
- Jimmy Douglass interview mentioning Gang of Four work: https://www.musicradar.com/artists/producers-engineers/there-was-a-back-door-to-the-studio-that-led-out-to-the-street-i-went-out-and-im-not-kidding-you-but-this-guy-pops-out-of-a-trash-can-it-was-ginger-baker-jimmy-douglass-on-his-early-days-working-for-atlantic-records
- Hugo Burnham interview on Gang of Four rhythm, space, and Jimmy Douglass: https://www.thecurrent.org/feature/2021/06/05/interview-with-hugo-burnham-of-gang-of-four
- Wired article with "heavy, full-on funk" quote context: https://www.wired.com/2005/11/gang-of-four-remixes-it-up
- Pitchfork 77-81 review with "Everything was thought out in advance" quote context: https://pitchfork.com/reviews/albums/gang-of-four-77-81
- Pitchfork news item on 77-81 remaster from original analog tapes: https://pitchfork.com/news/gang-of-four-77-81-box-set-with-unreleased-music-announced
- Abbey Road official history: https://www.abbeyroad.com/about-us
- Abbey Road Studio Two context: https://www.abbeyroad.com/studio-two
- Abbey Road official gear context: https://www.abbeyroad.com/gear-instruments

### Confirmed Context

- Artist: Gang of Four
- Album: `Solid Gold`
- Year: 1981
- Recorded: January 1981
- Released: March 1981
- Drummer: Hugo Burnham
- Engineer: Jimmy Douglass
- Studio: Abbey Road, London
- Producer credit: Dave Allen, Hugo Burnham, Jimmy Douglass, Andy Gill, Jon King
- Mixing engineer: not publicly documented separately from the production/engineering credits
- Reissue/archive context: the later `77-81` box set includes `Solid Gold` remastered from original analog tapes.

### Sound Goal

Tight, dry-to-semi-dry, dense, controlled, rhythmically exact funk-punk drums. The kit supports the bass/guitar interlock rather than a large open rock drum picture. The drum sound is close-mic dominant, compact, and disciplined, with limited cymbal wash and little obvious room ambience.

Reference track note: "What We All Want" is the main research reference. Source context includes Jon King describing the target as heavy full-on funk with loud guitar, and Hugo Burnham describing the track as the band working out its funk with Jimmy Douglass.

### Room Notes

Confirmed studio: Abbey Road, London.

Unknown:

- Exact Abbey Road room used for drums.
- Exact drum position.
- Exact gobos, rugs, baffles, or isolation.
- Whether Studio Two, Studio Three, or another Abbey Road space was used.

Practical substitute from research notes: controlled medium live room, not a huge reflective rock room and not a fully dead booth. The room should allow some natural air but be easy to control with gobos, rugs, and baffles.

Planner room approximation: 38.25 ft W x 60.17 ft L x 24 ft H for both Solid Gold presets. These are Abbey Road Studio Two context dimensions from the research source, not proof that Solid Gold drums were tracked in Studio Two.

### Kit Notes

Confirmed: Hugo Burnham played drums.

Unknown:

- Kit brand.
- Drum sizes.
- Snare model.
- Cymbals.
- Heads.
- Sticks.
- Muffling.

Practical substitute from research notes:

- Compact, articulate kit.
- 20 or 22 inch kick.
- 14 inch snare tuned medium-high with short decay.
- One rack tom.
- One floor tom.
- Tight hi-hats.
- Controlled crash/ride cymbals.
- Avoid huge open cymbals, long tom sustain, and large room bloom.

### Mic Plan

#### Kick Drum

Mic options: AKG D12/D20 type, EV RE20, Beyerdynamic M88, Sennheiser MD421, or similar full-bodied dynamic mic.

Pattern: cardioid or directional dynamic.

Placement: if the kick is ported, place mic just inside the hole. If unported, place it 4 to 8 inches outside resonant head. Aim between beater impact point and shell center.

Height / distance / angle: around beater height. Angle slightly off-axis if attack is too sharp.

Phase: check against overhead, snare, and any front-of-kit mic. Flip polarity if low end disappears when combined with rest of kit.

Processing: moderate internal damping. Avoid long boom. Add 60 to 80 Hz only if needed. Cut boxiness around 250 to 450 Hz. Add 2 to 4 kHz only enough for definition. Do not make it a modern sub-heavy kick.

Confidence: inferred.

#### Snare Top

Mic options: Shure SM57, Beyerdynamic M201, Sennheiser MD441, Sennheiser MD421, or similar tight cardioid dynamic.

Pattern: cardioid.

Placement: 1 to 2 inches above rim, angled 30 to 45 degrees toward center. Aim rear null toward hi-hat.

Height / distance / angle: close and low for dry crack. Slightly higher for more shell tone.

Phase: use snare top as kit phase anchor. Check against overhead and snare bottom if used.

Processing: tune medium-high with short decay. Use small damping if ring interferes with guitar/bass rhythm. Compress lightly to moderately. Avoid a huge gated 1980s snare sound.

Confidence: inferred.

#### Snare Bottom, Optional

Mic options: small dynamic or small-diaphragm condenser.

Pattern: cardioid.

Placement: 1 to 2 inches below wires, angled away from kick and hi-hat bleed.

Height / distance / angle: close to wires, not aimed at shell.

Phase: invert polarity relative to snare top, then check by ear.

Processing: blend quietly for wire articulation. High-pass aggressively. Mute if it makes kit too bright or modern.

Confidence: guess / optional.

#### Hi-Hat

Mic options: AKG C451, Neumann KM84/KM184, Beyerdynamic M201, Shure SM7B, Sennheiser MD441, or similar.

Pattern: cardioid.

Placement: 4 to 8 inches above outer edge of hats, aimed slightly downward and away from snare.

Height / distance / angle: close but not hyped. Avoid pointing directly at bell unless a sharp tick is needed.

Phase: check with snare top and overhead.

Processing: use less hi-hat mic than expected. Rhythmic clarity should come from playing and arrangement, not from a loud hi-hat channel. High-pass heavily. Use little or no compression.

Confidence: inferred.

#### Rack Tom

Mic options: Sennheiser MD421, Beyerdynamic M201, Shure SM57, AKG D19-style dynamic, or similar.

Pattern: cardioid.

Placement: 1 to 2 inches above rim, aimed between center and edge.

Height / distance / angle: 30 to 45 degrees downward.

Phase: check against overhead and floor tom.

Processing: short controlled sustain. Avoid stadium toms. Gate only if needed; manual cleanup is better than obvious gating.

Confidence: inferred.

#### Floor Tom

Mic options: Sennheiser MD421, EV RE20, Beyerdynamic M201, Shure SM57, or similar dynamic.

Pattern: cardioid.

Placement: 1 to 3 inches above rim, angled toward center.

Height / distance / angle: close enough to reduce room wash.

Phase: check against overhead and kick.

Processing: tune for short low-mid punctuation, not long resonance. Cut mud if it masks bass.

Confidence: inferred.

#### Overhead

Mic options: Coles/STC 4038, RCA-style ribbon, Beyerdynamic M160, AKG D19/D20 type, Neumann KM84, AKG C451, Neumann U67/U87 used conservatively, or another controlled ribbon/dynamic/condenser.

Pattern: figure-8 for ribbon, cardioid for dynamic or condenser.

Placement: preferred approach from research notes is mono overhead or narrow stereo. For mono, place 3 to 4 ft above snare, centered so snare and kick feel coherent. Aim at kick/snare relationship rather than cymbals. For stereo, use XY or narrow pair rather than wide spaced overheads.

Height / distance / angle: lower than roomy rock setup. High enough to capture kit image, low enough to keep room controlled.

Phase: make this the image mic and align close mics around it. Measure from snare to overhead and check in mono.

Processing: keep cymbals dark and controlled. Roll off excessive top end if overhead sounds too modern. Use little compression unless it improves groove.

Confidence: inferred.

#### Front-Of-Kit / Mono Crush Mic, Optional

Mic options: Coles 4038, U47/U48-style condenser, RCA-style ribbon, Beyerdynamic M160, EV RE20, or cheap dynamic for aggressive trash channel.

Pattern: figure-8 for ribbon, cardioid or omni depending on mic and room.

Placement: 3 to 6 ft in front of kit, around kick-to-chest height, aimed between kick and snare.

Height / distance / angle: below cymbal plane to avoid excessive cymbal wash.

Phase: check polarity against kick, snare, and overhead. Delay/slide only if it improves punch without making recording sound too modern.

Processing: compress hard only if blended quietly. This channel should thicken groove, not turn kit into big room-rock sound.

Confidence: guess / practical option.

#### Far Room Mic, Optional And Low In Mix

Mic options: ribbon, condenser pair, or mono dynamic.

Pattern: any pattern that minimizes cymbal harshness.

Placement: 8 to 15 ft from kit only if room sounds controlled and flattering.

Height / distance / angle: chest height or slightly above. Avoid high cymbal-heavy placement.

Phase: check in mono. Delay is optional but should not create a polished modern image.

Processing: blend very low, around 0 to 10 percent. Mute if drum sound loses dry, mechanical, interlocking quality.

Confidence: guess / optional.

### Overall Processing Notes

Treat as analog, close-controlled, pre-sample production. No reliable evidence was found for samples, triggers, drum replacement, quantization, or digital editing on `Solid Gold`.

Use tape or tape-style saturation, console EQ, and restrained compression. Suitable modern equivalents listed in research notes include Neve/API/Trident/TG-style preamps or console paths, 1176/DBX/RS124/Fairchild-style compression, and dark short plate or chamber reverb only if needed.

Avoid over-modernizing: huge sub kick, ultra-bright cymbals, hard sample-like snare, wide stereo room mics, and obvious gated reverb.

### Variations

- "What We All Want": main reference; dense, funk-driven, kick/snare/bass-forward, with controlled cymbal energy.
- "Paralysed": use less room and overhead, keep snare dry, and leave arrangement space exposed. This is audible inference, not documented session information.
- "Outside the Trains Don't Run on Time" and "He'd Send in the Army": public sources identify these as re-recordings of earlier singles, but no reliable song-specific mic or mix documentation was found.

### App Data Notes

Candidate setup labels from research notes:

- `solid-gold-minimum-close-funk`: kick, snare top, hi-hat, mono/narrow overhead.
- `solid-gold-controlled-expanded`: kick, snare top/bottom, hi-hat, rack tom, floor tom, mono/narrow overhead, optional front/crush, optional low room.

Cataloging note: these are labels and channel groupings only. No planner coordinates or compact app template entries were created in this pass.

### What Matters Most

- Drummer restraint and consistency.
- Tight kick/snare/hi-hat relationship with bass.
- Controlled cymbals.
- Close, phase-coherent drum capture.
- Short drum sustain.
- Limited room sound.
- Analog-style density from console/tape/compression.
- Arrangement space.

### Optional Elements

- Exact Abbey Road room.
- Exact historic microphones.
- Exact drum brand.
- Exact preamps.
- Exact tape machine.
- Far room mics.
- Stereo overhead width.
- Heavy parallel compression.

### Studio Booking Checklist

- Ask for a controlled medium live room.
- Ask for gobos, rugs, and baffles.
- Use a compact drum kit.
- Use a controlled 14 inch snare with short decay.
- Use tight hi-hats and restrained cymbals.
- Prioritize dynamic and ribbon mics over very bright condensers.
- Use close mics on kick, snare, toms, and hi-hat.
- Use mono or narrow stereo overheads.
- Add a front-of-kit mic only if it helps density.
- Use room mics sparingly or not at all.
- Use analog-style preamps or console color.
- Use light to moderate compression.
- Use short dark reverb only if needed.
- Check phase constantly in mono.
- Do not rely on sample replacement.
- Do not over-edit the performance.
- Keep drums rhythmically exposed.

### Questions Still Unresolved

- Exact Abbey Road room used for drums.
- Exact kit brand and drum sizes.
- Exact snare, cymbals, heads, sticks, and muffling.
- Exact microphone list.
- Exact mic placements.
- Exact console path, preamps, EQ, compression, tape speed, and tape formulation.
- Song-specific drum setup changes.

---

## Queens of the Stone Age / Songs for the Deaf Dry-Shell + Separate-Cymbal Drums

Working name: Queens of the Stone Age / Songs for the Deaf dry-shell + separate-cymbal overdub drum configuration.

Accuracy boundary: the separate shell/cymbal workflow and no-samples statement are source-supported by Eric Valentine interview material quoted by MusicRadar/Rhythm. Exact drum room, kit, microphones, mic placements, preamps, compressors, tape/converter path, and song-by-song chains are not publicly documented in the reliable sources checked.

### Source Notes

- MusicRadar / Eric Valentine technical source: https://www.musicradar.com/artists/of-course-it-was-gonna-be-a-hit-this-song-is-one-of-the-few-tracks-from-that-period-of-the-noughties-that-really-is-original-its-got-a-super-distinctive-sonic-signature-inside-the-making-of-a-queens-of-the-stone-age-classic
- Album credits/session context: https://en.wikipedia.org/wiki/Songs_for_the_Deaf
- Louder / Metal Hammer performance context: https://www.loudersound.com/bands-artists/why-dave-grohl-joined-queens-of-the-stone-age

### Confirmed Context

- Artist: Queens of the Stone Age.
- Album: Songs for the Deaf.
- Year: 2002.
- Main drummer: Dave Grohl on most of the album.
- Producers: Josh Homme, Eric Valentine, Adam Kasper.
- Recording engineer: Eric Valentine.
- Additional recording and mixing: Adam Kasper.
- Credited studios: The Site, San Rafael; Conway, Los Angeles; Barefoot, Hollywood.
- Exact drum room: not publicly documented with confidence.

### Sound Goal

Tight, focused, punchy, controlled, dry, and somewhat claustrophobic rock drums. The defining method is not a secret mic choice; it is the separation of shell capture from cymbal capture.

Confirmed method:

- Shell pass: Dave Grohl recorded acoustic drum shells while hitting electronic cymbal pads instead of real cymbals.
- Cymbal pass: real cymbals were recorded separately while dummy snare and padded toms minimized shell spill.
- Eric Valentine stated that the drums were not sample-replaced.

Practical target: dry close shells, reduced cymbal bleed, assertive close-mic EQ/compression options, and real cymbals layered as a separate performance pass.

### Room Notes

Confirmed: the drum sound is associated with a notably dead, controlled drum capture rather than a large ambient room.

Unknown:

- Exact drum room.
- Room dimensions.
- Ceiling height.
- Wall, floor, and ceiling materials.
- Gobos, baffles, risers, absorbers, or blankets.
- Which credited studio/room produced each drum track.

Practical substitute: use a small-to-medium dead room, iso room, or heavily controlled live room. Avoid a splashy high-ceiling room unless it can be made much drier with gobos, rugs, absorbers, and blankets.

Planner room approximation: 18 ft W x 22 ft L x 9 ft H for both Songs for the Deaf presets. This is approximate app geometry based on the documented dry/dead drum sound, not a confirmed room measurement from The Site, Conway, or Barefoot.

### Kit Notes

Confirmed: Dave Grohl played drums on most of the album.

Unknown: exact kit brand/model, kick size, snare model/size/material, tom sizes, cymbal models, heads, sticks, muffling, and tuning.

Practical substitute:

- 22 or 24 inch kick with controlled internal damping.
- Medium-low rock snare with short ring plus a brighter crack snare option.
- Rack/floor toms tuned for punch rather than long resonance.
- Cymbals chosen for tone because they are overdubbed separately.

### Mic / Pass Notes

Shell pass guide: electronic cymbal pads are placed where cymbals would normally be. These are not final audio mics.

Kick close / kick in: exact mic unknown. Practical options include AKG D112, Shure Beta 52A, EV RE20, Beyer M88, Sennheiser e602, Audix D6, or boundary mic. Confidence: inferred.

Kick outside: exact mic unknown. Practical options include FET condenser, large dynamic, subkick, or outside dynamic. Confidence: guess / optional.

Snare top: exact mic unknown. Practical options include SM57, Beyer M201, Audix i5, MD441, Shure 545, or similar dynamic. Confidence: inferred.

Snare bottom: exact mic unknown. Practical option for wire layer only. Confidence: guess / optional.

Rack/floor toms: exact mics unknown. Practical options include MD421, e604/e904, M201, MD441, ATM25, or compact condensers. Confidence: inferred.

Shell image / front-of-kit: optional practical glue/crush mic. Not documented as an album fact. Confidence: guess.

Cymbal pass overheads: confirmed method, inferred placement. Record real cymbals in a second pass with dummy snare and padded toms. Start with controlled overheads 2 to 4 ft above cymbals.

Hi-hat / ride / cymbal spots: optional. Because cymbals are isolated, spots can be blended low or omitted. Confidence: guess.

Room mics: not the foundation. Use only as parallel dirt or controlled depth. Confidence: speculation.

### Phase / Processing

Treat the shell pass as the primary drum image. Check kick in/out, snare top/bottom, toms, and any mono kit mic first. Then add the cymbal pass and check whether the groove feels late, early, or smeared. Do not automatically sample-align every cymbal transient to the shell pass; slight human variance may be part of the feel.

Confirmed processing context: Valentine stated there were no samples, and described a frequency-arrangement concept where guitars occupied a concentrated midrange area around roughly 600 to 700 Hz, pushing the drums into a more scooped and controlled role.

### App Data Notes

Candidate setup labels:

- `songs-for-the-deaf-dry-shell-basic`: kick in, snare top, rack tom, floor tom, shell front/glue, cymbal pass overheads.
- `songs-for-the-deaf-expanded-overdub`: kick in/out, snare top/bottom, rack tom, floor tom, shell front/crush, cymbal pass overheads, hat/ride cymbal spots, dead room dirt.

Cataloging note: these are app-ready planning layouts for the documented workflow, not original session mic sheets.

### What Matters Most

- Drummer consistency.
- Willingness to record shells and cymbals separately.
- Small dead room or controlled iso space.
- Short punchy tuning and damping.
- Frequency arrangement around dense midrange guitars.
- Close-mic punch before room sound.
- Real performance over sample replacement.

### Questions Still Unresolved

- Exact drum room.
- Exact kit, snare, cymbals, heads, sticks, muffling, and tuning.
- Exact microphones and mic placements.
- Exact console path, preamps, EQ, compression, gates, tape speed, tape formulation, converters, and plug-ins.
- Exact song-by-song drum chains.
