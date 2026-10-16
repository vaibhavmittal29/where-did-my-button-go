// STILL Camera — Full Project Generator for Figma
// Challenge: VinnovateIT UI/UX Round 1: "Where Did My Button Go? — Rethink the Interaction"
// Target Device: iPhone 14/15 Pro (390 x 844 px)

figma.showUI(__html__, { width: 440, height: 600, themeColors: true });

// Color Token Constants
const COLORS = {
  bg: { r: 11 / 255, g: 11 / 255, b: 15 / 255 },             // #0B0B0F
  surface1: { r: 20 / 255, g: 20 / 255, b: 30 / 255 },       // #14141E
  surface2: { r: 30 / 255, g: 30 / 255, b: 44 / 255 },       // #1E1E2C
  textPrimary: { r: 245 / 255, g: 245 / 255, b: 247 / 255 }, // #F5F5F7
  textDim: { r: 163 / 255, g: 163 / 255, b: 178 / 255 },     // #A3A3B2
  accentAmber: { r: 255 / 255, g: 176 / 255, b: 32 / 255 },   // #FFB020
  successGreen: { r: 61 / 255, g: 220 / 255, b: 151 / 255 },  // #3DDC97
  dangerCoral: { r: 255 / 255, g: 107 / 255, b: 94 / 255 },   // #FF6B5E
  white: { r: 1, g: 1, b: 1 },
};

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

// Safe font loader with robust fallback
async function loadFonts() {
  const fonts = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Inter', style: 'Semi Bold' },
    { family: 'Inter', style: 'Bold' },
    { family: 'Space Grotesk', style: 'Regular' },
    { family: 'Space Grotesk', style: 'SemiBold' },
    { family: 'Space Grotesk', style: 'Bold' },
    { family: 'Roboto', style: 'Regular' },
    { family: 'Roboto', style: 'Bold' },
  ];

  for (const f of fonts) {
    try {
      await figma.loadFontAsync(f);
    } catch {
      // Font not installed locally in Figma desktop/web, will fallback gracefully
    }
  }
}

function getSafeFont(family, style) {
  return { family: 'Inter', style: style === 'Bold' ? 'Bold' : style === 'SemiBold' ? 'Semi Bold' : style === 'Medium' ? 'Medium' : 'Regular' };
}

// Helper: Create Text Node
function createTextNode(characters, font, fontSize, color, options = {}) {
  const text = figma.createText();
  text.fontName = font;
  text.characters = characters;
  text.fontSize = fontSize;
  text.fills = [{ type: 'SOLID', color: color || COLORS.textPrimary }];
  if (options.lineHeight) {
    text.lineHeight = { value: options.lineHeight, unit: 'PIXELS' };
  }
  if (options.letterSpacing) {
    text.letterSpacing = { value: options.letterSpacing, unit: 'PERCENT' };
  }
  if (options.textAlignHorizontal) {
    text.textAlignHorizontal = options.textAlignHorizontal;
  }
  return text;
}

// Helper: Create Base Frame
function createFrame(name, width, height, cornerRadius = 0, color = null) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.cornerRadius = cornerRadius;
  frame.clipsContent = true;
  if (color) {
    frame.fills = [{ type: 'SOLID', color }];
  } else {
    frame.fills = [];
  }
  return frame;
}

// Helper: Create Auto Layout Frame
function createAutoLayout(name, direction = 'VERTICAL', padding = [0, 0, 0, 0], gap = 0, color = null) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.paddingTop = padding[0];
  frame.paddingRight = padding[1];
  frame.paddingBottom = padding[2] !== undefined ? padding[2] : padding[0];
  frame.paddingLeft = padding[3] !== undefined ? padding[3] : padding[1];
  frame.itemSpacing = gap;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.clipsContent = false;
  if (color) {
    frame.fills = [{ type: 'SOLID', color }];
  } else {
    frame.fills = [];
  }
  return frame;
}

// ---------------------------------------------------------------------------
// 1. GENERATE DESIGN TOKENS & VARIABLES
// ---------------------------------------------------------------------------
async function generateTokens() {
  let tokensCreated = 0;

  // 1.1 Local Variables (Figma Variables API)
  if (figma.variables) {
    try {
      const existing = figma.variables.getLocalVariableCollections();
      let collection = existing.find((c) => c.name === 'STILL-Tokens');
      if (!collection) {
        collection = figma.variables.createVariableCollection('STILL-Tokens');
      }
      const modeId = collection.modes[0].modeId;

      const colorDefs = [
        ['color/bg', COLORS.bg, 1],
        ['color/surface-1', COLORS.surface1, 1],
        ['color/surface-2', COLORS.surface2, 1],
        ['color/text-primary', COLORS.textPrimary, 1],
        ['color/text-dim', COLORS.textDim, 1],
        ['color/text-muted', COLORS.textDim, 1],
        ['color/accent-amber', COLORS.accentAmber, 1],
        ['color/accent-soft', COLORS.accentAmber, 0.14],
        ['color/success-green', COLORS.successGreen, 1],
        ['color/danger-coral', COLORS.dangerCoral, 1],
        ['color/glass-bg', COLORS.surface1, 0.7],
        ['color/glass-border', COLORS.white, 0.08],
      ];

      for (const [name, rgb, opacity] of colorDefs) {
        try {
          const v = figma.variables.createVariable(name, collection, 'COLOR');
          v.setValueForMode(modeId, { ...rgb, a: opacity });
          tokensCreated++;
        } catch {
          // Variable already exists or duplicate
        }
      }

      const floatDefs = [
        ['radius/chip', 8],
        ['radius/card', 16],
        ['radius/sheet', 28],
        ['radius/device', 48],
        ['radius/pill', 999],
        ['space/1', 4],
        ['space/2', 8],
        ['space/3', 12],
        ['space/4', 16],
        ['space/6', 24],
        ['space/8', 32],
      ];

      for (const [name, val] of floatDefs) {
        try {
          const v = figma.variables.createVariable(name, collection, 'FLOAT');
          v.setValueForMode(modeId, val);
          tokensCreated++;
        } catch {}
      }
    } catch (e) {
      console.warn('Variables API not available or errored:', e);
    }
  }

  // 1.2 Paint Styles (Figma Color Styles)
  const paintDefs = [
    ['STILL / Background', COLORS.bg, 1],
    ['STILL / Surface 1', COLORS.surface1, 1],
    ['STILL / Surface 2', COLORS.surface2, 1],
    ['STILL / Text Primary', COLORS.textPrimary, 1],
    ['STILL / Text Dim', COLORS.textDim, 1],
    ['STILL / Accent Amber', COLORS.accentAmber, 1],
    ['STILL / Success Green', COLORS.successGreen, 1],
    ['STILL / Danger Coral', COLORS.dangerCoral, 1],
    ['STILL / Glass Scrim', COLORS.surface1, 0.7],
  ];

  for (const [name, rgb, opacity] of paintDefs) {
    try {
      const style = figma.createPaintStyle();
      style.name = name;
      style.paints = [{ type: 'SOLID', color: rgb, opacity }];
    } catch {}
  }

  return tokensCreated;
}

// ---------------------------------------------------------------------------
// 2. GENERATE MASTER COMPONENTS
// ---------------------------------------------------------------------------
async function generateMasterComponents(targetPage) {
  figma.currentPage = targetPage;

  const fontBold = getSafeFont('Space Grotesk', 'Bold');
  const fontMed = getSafeFont('Inter', 'Medium');
  const fontReg = getSafeFont('Inter', 'Regular');

  let currentX = 0;
  const compGap = 60;

  // 2.1 Component: IconButton (44 x 44 px Apple HIG)
  const iconBtn = figma.createComponent();
  iconBtn.name = 'Component / IconButton';
  iconBtn.resize(44, 44);
  iconBtn.cornerRadius = 999;
  iconBtn.fills = [{ type: 'SOLID', color: COLORS.surface1, opacity: 0.7 }];
  iconBtn.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.08 }];
  iconBtn.strokeWeight = 1;
  iconBtn.x = currentX;
  iconBtn.y = 0;

  const iconGlyph = createTextNode('⚙', fontReg, 18, COLORS.textPrimary);
  iconGlyph.x = (44 - iconGlyph.width) / 2;
  iconGlyph.y = (44 - iconGlyph.height) / 2;
  iconBtn.appendChild(iconGlyph);
  currentX += 44 + compGap;

  // 2.2 Component: GlassChip (Pill 32px height)
  const glassChip = figma.createComponent();
  glassChip.name = 'Component / GlassChip';
  glassChip.layoutMode = 'HORIZONTAL';
  glassChip.paddingLeft = 14;
  glassChip.paddingRight = 14;
  glassChip.paddingTop = 6;
  glassChip.paddingBottom = 6;
  glassChip.itemSpacing = 6;
  glassChip.cornerRadius = 999;
  glassChip.fills = [{ type: 'SOLID', color: COLORS.surface1, opacity: 0.75 }];
  glassChip.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.08 }];
  glassChip.strokeWeight = 1;
  glassChip.x = currentX;
  glassChip.y = 0;

  const chipText = createTextNode('Rewind Buffer Active (simulated)', fontMed, 12, COLORS.textPrimary);
  glassChip.appendChild(chipText);
  currentX += 260 + compGap;

  // 2.3 Component: LockRing (104 x 104 px focus ring with 4 tracking brackets)
  const lockRing = figma.createComponent();
  lockRing.name = 'Component / LockRing';
  lockRing.resize(104, 104);
  lockRing.fills = [];
  lockRing.x = currentX;
  lockRing.y = 0;

  // Outer track circle
  const track = figma.createEllipse();
  track.name = 'Ring Track';
  track.resize(104, 104);
  track.x = 0;
  track.y = 0;
  track.fills = [];
  track.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.22 }];
  track.strokeWeight = 4;
  lockRing.appendChild(track);

  // Active sweep arc (represented as 60% partial ellipse arc)
  const arc = figma.createEllipse();
  arc.name = 'Active Arc (60%)';
  arc.resize(104, 104);
  arc.x = 0;
  arc.y = 0;
  arc.fills = [];
  arc.strokes = [{ type: 'SOLID', color: COLORS.accentAmber }];
  arc.strokeWeight = 4;
  arc.arcData = { startingAngle: -Math.PI / 2, endingAngle: Math.PI * 0.7, innerRadius: 0 };
  lockRing.appendChild(arc);

  // Center focus dot
  const centerPin = figma.createEllipse();
  centerPin.name = 'Focus Pin';
  centerPin.resize(6, 6);
  centerPin.x = 49;
  centerPin.y = 49;
  centerPin.fills = [{ type: 'SOLID', color: COLORS.accentAmber }];
  lockRing.appendChild(centerPin);

  currentX += 104 + compGap;

  // 2.4 Component: Toast (358 x 48 px with Undo action)
  const toast = figma.createComponent();
  toast.name = 'Component / Toast';
  toast.layoutMode = 'HORIZONTAL';
  toast.primaryAxisAlignItems = 'SPACE_BETWEEN';
  toast.counterAxisAlignItems = 'CENTER';
  toast.resize(358, 48);
  toast.paddingLeft = 16;
  toast.paddingRight = 16;
  toast.cornerRadius = 14;
  toast.fills = [{ type: 'SOLID', color: COLORS.surface2 }];
  toast.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.12 }];
  toast.strokeWeight = 1;
  toast.x = currentX;
  toast.y = 0;

  const toastLeft = createAutoLayout('Left', 'HORIZONTAL', [0, 0, 0, 0], 8);
  const toastCheck = createTextNode('✓', fontBold, 14, COLORS.successGreen);
  const toastMsg = createTextNode('Saved (simulated)', fontMed, 14, COLORS.textPrimary);
  toastLeft.appendChild(toastCheck);
  toastLeft.appendChild(toastMsg);

  const toastUndo = createTextNode('Undo', fontBold, 14, COLORS.accentAmber);
  toast.appendChild(toastLeft);
  toast.appendChild(toastUndo);

  currentX += 358 + compGap;

  // 2.5 Component: ModeCarousel (Still, Group, Doc)
  const carousel = figma.createComponent();
  carousel.name = 'Component / ModeCarousel';
  carousel.layoutMode = 'HORIZONTAL';
  carousel.primaryAxisAlignItems = 'CENTER';
  carousel.counterAxisAlignItems = 'CENTER';
  carousel.itemSpacing = 24;
  carousel.resize(220, 44);
  carousel.fills = [];
  carousel.x = currentX;
  carousel.y = 0;

  const modeStillCol = createAutoLayout('Mode Still', 'VERTICAL', [0, 0, 0, 0], 4);
  modeStillCol.primaryAxisAlignItems = 'CENTER';
  modeStillCol.counterAxisAlignItems = 'CENTER';
  const labelStill = createTextNode('Still', fontBold, 13, COLORS.accentAmber);
  const dotStill = figma.createEllipse();
  dotStill.resize(4, 4);
  dotStill.fills = [{ type: 'SOLID', color: COLORS.accentAmber }];
  modeStillCol.appendChild(labelStill);
  modeStillCol.appendChild(dotStill);

  const labelGroup = createTextNode('Group', fontMed, 13, COLORS.textDim);
  const labelDoc = createTextNode('Doc', fontMed, 13, COLORS.textDim);

  carousel.appendChild(modeStillCol);
  carousel.appendChild(labelGroup);
  carousel.appendChild(labelDoc);
}

// ---------------------------------------------------------------------------
// 3. GENERATE THE 5 HIGH-FIDELITY MOBILE SCREENS (390 x 844 px)
// ---------------------------------------------------------------------------
async function generateScreens(targetPage) {
  figma.currentPage = targetPage;

  const fontBold = getSafeFont('Space Grotesk', 'Bold');
  const fontSemi = getSafeFont('Space Grotesk', 'SemiBold');
  const fontMed = getSafeFont('Inter', 'Medium');
  const fontReg = getSafeFont('Inter', 'Regular');

  const screenWidth = 390;
  const screenHeight = 844;
  const screenGap = 80;
  const screens = [];

  // -------------------------------------------------------------------------
  // Screen 1: Progressive Onboarding
  // -------------------------------------------------------------------------
  const s1 = createFrame('01 · Progressive Onboarding', screenWidth, screenHeight, 48, COLORS.bg);
  s1.x = 0;
  s1.y = 0;

  // Top Ghost Ring Demo
  const s1Ring = figma.createEllipse();
  s1Ring.resize(96, 96);
  s1Ring.x = (screenWidth - 96) / 2;
  s1Ring.y = 200;
  s1Ring.fills = [];
  s1Ring.strokes = [{ type: 'SOLID', color: COLORS.accentAmber, opacity: 0.7 }];
  s1Ring.strokeWeight = 3;
  s1.appendChild(s1Ring);

  const s1Chip = createAutoLayout('Hold Chip', 'HORIZONTAL', [6, 14, 6, 14], 0, COLORS.surface1);
  s1Chip.cornerRadius = 999;
  s1Chip.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.1 }];
  s1Chip.strokeWeight = 1;
  const s1ChipText = createTextNode('Hold steady · 0.5s', fontMed, 12, COLORS.accentAmber);
  s1Chip.appendChild(s1ChipText);
  s1Chip.x = (screenWidth - 130) / 2;
  s1Chip.y = 310;
  s1.appendChild(s1Chip);

  // Bottom Onboarding Card
  const s1Card = createAutoLayout('Onboarding Card', 'VERTICAL', [24, 20, 24, 20], 16, COLORS.surface1);
  s1Card.resize(358, 420);
  s1Card.cornerRadius = 28;
  s1Card.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.12 }];
  s1Card.strokeWeight = 1;
  s1Card.x = 16;
  s1Card.y = 390;

  const s1Title = createTextNode('No shutter. Just stillness.', fontBold, 22, COLORS.textPrimary);
  const s1Sub = createTextNode('STILL waits for your hand to settle before capturing.', fontReg, 13, COLORS.textDim);
  s1Card.appendChild(s1Title);
  s1Card.appendChild(s1Sub);

  // 3 Steps
  const steps = [
    ['1', 'Tap what matters to set focus.'],
    ['2', 'Hold still while the ring fills (~0.8s).'],
    ['3', 'Rewind to pick your favourite moment.'],
  ];
  for (const [num, desc] of steps) {
    const row = createAutoLayout('Step ' + num, 'HORIZONTAL', [0, 0, 0, 0], 12);
    row.counterAxisAlignItems = 'CENTER';

    const numBadge = createAutoLayout('Num Badge', 'HORIZONTAL', [4, 8, 4, 8], 0, COLORS.surface2);
    numBadge.cornerRadius = 999;
    const numText = createTextNode(num, fontBold, 11, COLORS.accentAmber);
    numBadge.appendChild(numText);

    const descText = createTextNode(desc, fontMed, 13, COLORS.textPrimary);
    row.appendChild(numBadge);
    row.appendChild(descText);
    s1Card.appendChild(row);
  }

  // CTA Button
  const s1Btn = createAutoLayout('CTA Got It', 'HORIZONTAL', [12, 0, 12, 0], 0, COLORS.accentAmber);
  s1Btn.resize(318, 48);
  s1Btn.primaryAxisAlignItems = 'CENTER';
  s1Btn.counterAxisAlignItems = 'CENTER';
  s1Btn.cornerRadius = 999;
  const s1BtnText = createTextNode('Got it', fontBold, 15, COLORS.bg);
  s1Btn.appendChild(s1BtnText);
  s1Card.appendChild(s1Btn);

  s1.appendChild(s1Card);
  screens.push(s1);

  // -------------------------------------------------------------------------
  // Screen 2: Viewfinder (Idle)
  // -------------------------------------------------------------------------
  const s2 = createFrame('02 · Viewfinder Idle', screenWidth, screenHeight, 48, COLORS.bg);
  s2.x = (screenWidth + screenGap) * 1;
  s2.y = 0;

  // Header Scrim Bar
  const s2Header = createAutoLayout('Header Bar', 'HORIZONTAL', [47, 16, 0, 16], 0);
  s2Header.resize(screenWidth, 90);
  s2Header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s2Header.counterAxisAlignItems = 'CENTER';

  const s2Flash = createTextNode('⚡', fontReg, 18, COLORS.textPrimary);
  const s2LightChip = createAutoLayout('Light Chip', 'HORIZONTAL', [6, 12, 6, 12], 0, COLORS.surface1);
  s2LightChip.cornerRadius = 999;
  s2LightChip.appendChild(createTextNode('Rewind Buffer Active (simulated)', fontMed, 11, COLORS.textDim));
  const s2Settings = createTextNode('⚙', fontReg, 18, COLORS.textPrimary);

  s2Header.appendChild(s2Flash);
  s2Header.appendChild(s2LightChip);
  s2Header.appendChild(s2Settings);
  s2.appendChild(s2Header);

  // Center Ghost Ring & Coachmark
  const s2Ghost = figma.createEllipse();
  s2Ghost.name = 'Ghost Ring';
  s2Ghost.resize(96, 96);
  s2Ghost.x = (screenWidth - 96) / 2;
  s2Ghost.y = 340;
  s2Ghost.fills = [];
  s2Ghost.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.28 }];
  s2Ghost.strokeWeight = 3;
  s2.appendChild(s2Ghost);

  const s2Coach = createAutoLayout('Coachmark Pill', 'HORIZONTAL', [6, 14, 6, 14], 0, COLORS.surface1);
  s2Coach.cornerRadius = 999;
  s2Coach.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.1 }];
  s2Coach.strokeWeight = 1;
  s2Coach.appendChild(createTextNode('Tap what you want to keep', fontMed, 12, COLORS.textPrimary));
  s2Coach.x = (screenWidth - 170) / 2;
  s2Coach.y = 455;
  s2.appendChild(s2Coach);

  // Bottom Controls Bar (No Shutter Button!)
  const s2Bottom = createAutoLayout('Bottom Bar', 'HORIZONTAL', [0, 24, 34, 24], 0);
  s2Bottom.resize(screenWidth, 120);
  s2Bottom.x = 0;
  s2Bottom.y = screenHeight - 120;
  s2Bottom.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s2Bottom.counterAxisAlignItems = 'CENTER';

  const s2Thumb = createFrame('Recent Thumbnail', 44, 44, 12, COLORS.surface2);
  s2Thumb.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.15 }];
  s2Thumb.strokeWeight = 1;

  const s2Carousel = createAutoLayout('Carousel', 'HORIZONTAL', [0, 0, 0, 0], 20);
  s2Carousel.counterAxisAlignItems = 'CENTER';
  s2Carousel.appendChild(createTextNode('Still', fontBold, 14, COLORS.accentAmber));
  s2Carousel.appendChild(createTextNode('Group', fontMed, 14, COLORS.textDim));
  s2Carousel.appendChild(createTextNode('Doc', fontMed, 14, COLORS.textDim));

  const s2Flip = createTextNode('🔄', fontReg, 18, COLORS.textPrimary);

  s2Bottom.appendChild(s2Thumb);
  s2Bottom.appendChild(s2Carousel);
  s2Bottom.appendChild(s2Flip);
  s2.appendChild(s2Bottom);

  screens.push(s2);

  // -------------------------------------------------------------------------
  // Screen 3: Hero Locking (Mid-Action)
  // -------------------------------------------------------------------------
  const s3 = createFrame('03 · Hero Locking (Mid-Action)', screenWidth, screenHeight, 48, COLORS.bg);
  s3.x = (screenWidth + screenGap) * 2;
  s3.y = 0;

  // Header Bar
  const s3Header = createAutoLayout('Header Bar', 'HORIZONTAL', [47, 16, 0, 16], 0);
  s3Header.resize(screenWidth, 90);
  s3Header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s3Header.counterAxisAlignItems = 'CENTER';
  s3Header.appendChild(createTextNode('⚡', fontReg, 18, COLORS.textPrimary));
  const s3Chip = createAutoLayout('Locking Chip', 'HORIZONTAL', [6, 12, 6, 12], 0, COLORS.surface1);
  s3Chip.cornerRadius = 999;
  s3Chip.appendChild(createTextNode('Locking Focus · 1×', fontMed, 11, COLORS.accentAmber));
  s3Header.appendChild(s3Chip);
  s3Header.appendChild(createTextNode('⚙', fontReg, 18, COLORS.textPrimary));
  s3.appendChild(s3Header);

  // Hero Focus Ring (60% Progress Arc + Corner Brackets)
  const s3RingGroup = createFrame('Hero Ring Group', 104, 104);
  s3RingGroup.x = (screenWidth - 104) / 2;
  s3RingGroup.y = 330;

  const s3Track = figma.createEllipse();
  s3Track.resize(104, 104);
  s3Track.fills = [];
  s3Track.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.22 }];
  s3Track.strokeWeight = 4;
  s3RingGroup.appendChild(s3Track);

  const s3Arc = figma.createEllipse();
  s3Arc.resize(104, 104);
  s3Arc.fills = [];
  s3Arc.strokes = [{ type: 'SOLID', color: COLORS.accentAmber }];
  s3Arc.strokeWeight = 4;
  s3Arc.arcData = { startingAngle: -Math.PI / 2, endingAngle: Math.PI * 0.7, innerRadius: 0 };
  s3RingGroup.appendChild(s3Arc);

  const s3Pin = figma.createEllipse();
  s3Pin.resize(6, 6);
  s3Pin.x = 49;
  s3Pin.y = 49;
  s3Pin.fills = [{ type: 'SOLID', color: COLORS.accentAmber }];
  s3RingGroup.appendChild(s3Pin);
  s3.appendChild(s3RingGroup);

  // Microcopy Chip below Ring
  const s3TimeChip = createAutoLayout('Time Chip', 'HORIZONTAL', [6, 14, 6, 14], 0, COLORS.surface1);
  s3TimeChip.cornerRadius = 999;
  s3TimeChip.strokes = [{ type: 'SOLID', color: COLORS.accentAmber, opacity: 0.35 }];
  s3TimeChip.strokeWeight = 1;
  s3TimeChip.appendChild(createTextNode('Hold steady · 0.3s', fontBold, 12, COLORS.accentAmber));
  s3TimeChip.x = (screenWidth - 136) / 2;
  s3TimeChip.y = 450;
  s3.appendChild(s3TimeChip);

  // Device Steadiness Meter
  const s3Meter = createAutoLayout('Steadiness Meter', 'VERTICAL', [8, 12, 8, 12], 4, COLORS.surface1);
  s3Meter.resize(180, 52);
  s3Meter.cornerRadius = 14;
  s3Meter.counterAxisAlignItems = 'CENTER';
  s3Meter.x = (screenWidth - 180) / 2;
  s3Meter.y = 660;
  s3Meter.appendChild(createTextNode('Device Steadiness (88%)', fontMed, 11, COLORS.accentAmber));
  const s3Bar = createFrame('Meter Line', 156, 3, 999, COLORS.accentAmber);
  s3Meter.appendChild(s3Bar);
  s3.appendChild(s3Meter);

  screens.push(s3);

  // -------------------------------------------------------------------------
  // Screen 4: Moment Strip (Rewind & Review)
  // -------------------------------------------------------------------------
  const s4 = createFrame('04 · Moment Strip Review', screenWidth, screenHeight, 48, COLORS.bg);
  s4.x = (screenWidth + screenGap) * 3;
  s4.y = 0;

  // Top Bar
  const s4Header = createAutoLayout('Review Header', 'HORIZONTAL', [47, 16, 0, 16], 0);
  s4Header.resize(screenWidth, 90);
  s4Header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s4Header.counterAxisAlignItems = 'CENTER';
  s4Header.appendChild(createTextNode('✕', fontReg, 18, COLORS.textDim));
  const s4Chip = createAutoLayout('Best Chip', 'HORIZONTAL', [6, 12, 6, 12], 0, COLORS.surface1);
  s4Chip.cornerRadius = 999;
  s4Chip.appendChild(createTextNode('Suggested (illustrative)', fontBold, 11, COLORS.accentAmber));
  s4Header.appendChild(s4Chip);
  s4Header.appendChild(createTextNode('↗', fontReg, 18, COLORS.textPrimary));
  s4.appendChild(s4Header);

  // Bottom Moment Strip Sheet
  const s4Sheet = createAutoLayout('Moment Strip Sheet', 'VERTICAL', [16, 16, 34, 16], 14, COLORS.surface1);
  s4Sheet.resize(screenWidth, 320);
  s4Sheet.x = 0;
  s4Sheet.y = screenHeight - 320;
  s4Sheet.cornerRadius = 24;
  s4Sheet.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.1 }];
  s4Sheet.strokeWeight = 1;

  // Title Row
  const s4TitleRow = createAutoLayout('Title Row', 'HORIZONTAL', [0, 0, 0, 0], 0);
  s4TitleRow.resize(358, 20);
  s4TitleRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s4TitleRow.counterAxisAlignItems = 'CENTER';
  s4TitleRow.appendChild(createTextNode('Pick your favourite moment', fontMed, 13, COLORS.textPrimary));
  s4TitleRow.appendChild(createTextNode('Rewind 3s (sim)', fontReg, 11, COLORS.accentAmber));
  s4Sheet.appendChild(s4TitleRow);

  // 7 Frames Row
  const s4ThumbRow = createAutoLayout('Thumbnails Row', 'HORIZONTAL', [0, 0, 0, 0], 6);
  s4ThumbRow.counterAxisAlignItems = 'CENTER';
  for (let i = 0; i < 7; i++) {
    const isSelected = i === 3;
    const card = createFrame('Thumb ' + (i + 1), isSelected ? 48 : 44, isSelected ? 70 : 64, 10, COLORS.surface2);
    if (isSelected) {
      card.strokes = [{ type: 'SOLID', color: COLORS.accentAmber }];
      card.strokeWeight = 2;
      const bestTag = createAutoLayout('Tag', 'HORIZONTAL', [2, 4, 2, 4], 0, COLORS.accentAmber);
      bestTag.cornerRadius = 4;
      bestTag.appendChild(createTextNode('SUGGESTED', fontBold, 7, COLORS.bg));
      card.appendChild(bestTag);
    } else {
      card.strokes = [{ type: 'SOLID', color: COLORS.white, opacity: 0.12 }];
      card.strokeWeight = 1;
    }
    s4ThumbRow.appendChild(card);
  }
  s4Sheet.appendChild(s4ThumbRow);

  // Autosave Progress Line
  const s4ProgressCol = createAutoLayout('Progress Col', 'VERTICAL', [0, 0, 0, 0], 6);
  const s4ProgressTrack = createFrame('Progress Track', 358, 3, 999, COLORS.surface2);
  const s4ProgressFill = createFrame('Progress Fill', 240, 3, 999, COLORS.accentAmber);
  s4ProgressTrack.appendChild(s4ProgressFill);
  s4ProgressCol.appendChild(s4ProgressTrack);

  const s4ProgressInfo = createAutoLayout('Progress Info', 'HORIZONTAL', [0, 0, 0, 0], 0);
  s4ProgressInfo.resize(358, 16);
  s4ProgressInfo.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s4ProgressInfo.appendChild(createTextNode('Saving suggested moment...', fontReg, 11, COLORS.textDim));
  s4ProgressInfo.appendChild(createTextNode('1.2s', fontMed, 11, COLORS.textDim));
  s4ProgressCol.appendChild(s4ProgressInfo);
  s4Sheet.appendChild(s4ProgressCol);

  // Save Selection CTA
  const s4SaveBtn = createAutoLayout('Save CTA', 'HORIZONTAL', [12, 0, 12, 0], 0, COLORS.accentAmber);
  s4SaveBtn.resize(358, 44);
  s4SaveBtn.primaryAxisAlignItems = 'CENTER';
  s4SaveBtn.counterAxisAlignItems = 'CENTER';
  s4SaveBtn.cornerRadius = 999;
  s4SaveBtn.appendChild(createTextNode('Save Selection (prototype)', fontBold, 14, COLORS.bg));
  s4Sheet.appendChild(s4SaveBtn);

  s4.appendChild(s4Sheet);
  screens.push(s4);

  // -------------------------------------------------------------------------
  // Screen 5: Group Mode
  // -------------------------------------------------------------------------
  const s5 = createFrame('05 · Group Mode', screenWidth, screenHeight, 48, COLORS.bg);
  s5.x = (screenWidth + screenGap) * 4;
  s5.y = 0;

  // Global Perimeter Frame Ring
  const s5Perimeter = figma.createFrame();
  s5Perimeter.name = 'Group Perimeter Ring';
  s5Perimeter.resize(screenWidth - 32, screenHeight - 32);
  s5Perimeter.x = 16;
  s5Perimeter.y = 16;
  s5Perimeter.cornerRadius = 32;
  s5Perimeter.fills = [];
  s5Perimeter.strokes = [{ type: 'SOLID', color: COLORS.accentAmber }];
  s5Perimeter.strokeWeight = 3;
  s5.appendChild(s5Perimeter);

  // Top Header Chip
  const s5Header = createAutoLayout('Header Bar', 'HORIZONTAL', [47, 16, 0, 16], 0);
  s5Header.resize(screenWidth, 90);
  s5Header.primaryAxisAlignItems = 'CENTER';
  const s5Chip = createAutoLayout('Group Ready Chip', 'HORIZONTAL', [6, 14, 6, 14], 6, COLORS.surface1);
  s5Chip.cornerRadius = 999;
  s5Chip.strokes = [{ type: 'SOLID', color: COLORS.accentAmber, opacity: 0.35 }];
  s5Chip.strokeWeight = 1;
  s5Chip.appendChild(createTextNode('3 of 4 ready (simulated)', fontBold, 12, COLORS.accentAmber));
  s5Header.appendChild(s5Chip);
  s5.appendChild(s5Header);

  // 4 Face Detection Boxes
  const faces = [
    { name: 'Tara · Blinking', x: 45, y: 390, w: 54, h: 68, ready: false },
    { name: 'Aarav', x: 122, y: 396, w: 48, h: 68, ready: true },
    { name: 'Pooja', x: 212, y: 405, w: 48, h: 68, ready: true },
    { name: 'Neha', x: 285, y: 388, w: 50, h: 68, ready: true },
  ];

  for (const f of faces) {
    const box = figma.createFrame();
    box.name = 'Face: ' + f.name;
    box.resize(f.w, f.h);
    box.x = f.x;
    box.y = f.y;
    box.cornerRadius = 6;
    box.fills = [];
    box.strokes = [{ type: 'SOLID', color: f.ready ? COLORS.successGreen : COLORS.accentAmber }];
    box.strokeWeight = 2;

    const tag = createAutoLayout('Tag', 'HORIZONTAL', [2, 6, 2, 6], 0, f.ready ? COLORS.successGreen : COLORS.accentAmber);
    tag.cornerRadius = 4;
    tag.y = -20;
    tag.appendChild(createTextNode(f.name, fontBold, 9, COLORS.bg));
    box.appendChild(tag);
    s5.appendChild(box);
  }

  // Voice Hint Chip
  const s5Voice = createAutoLayout('Voice Hint', 'HORIZONTAL', [6, 14, 6, 14], 6, COLORS.surface1);
  s5Voice.cornerRadius = 999;
  s5Voice.appendChild(createTextNode('Or say "Cheese" / "Capture"', fontMed, 12, COLORS.textDim));
  s5Voice.x = (screenWidth - 190) / 2;
  s5Voice.y = 660;
  s5.appendChild(s5Voice);

  // Bottom Bar (Group active)
  const s5Bottom = createAutoLayout('Bottom Bar', 'HORIZONTAL', [0, 24, 34, 24], 0);
  s5Bottom.resize(screenWidth, 120);
  s5Bottom.x = 0;
  s5Bottom.y = screenHeight - 120;
  s5Bottom.primaryAxisAlignItems = 'SPACE_BETWEEN';
  s5Bottom.counterAxisAlignItems = 'CENTER';

  const s5Thumb = createFrame('Recent Thumbnail', 44, 44, 12, COLORS.surface2);
  const s5Carousel = createAutoLayout('Carousel', 'HORIZONTAL', [0, 0, 0, 0], 20);
  s5Carousel.counterAxisAlignItems = 'CENTER';
  s5Carousel.appendChild(createTextNode('Still', fontMed, 14, COLORS.textDim));
  s5Carousel.appendChild(createTextNode('Group', fontBold, 14, COLORS.accentAmber));
  s5Carousel.appendChild(createTextNode('Doc', fontMed, 14, COLORS.textDim));
  const s5Flip = createTextNode('🔄', fontReg, 18, COLORS.textPrimary);

  s5Bottom.appendChild(s5Thumb);
  s5Bottom.appendChild(s5Carousel);
  s5Bottom.appendChild(s5Flip);
  s5.appendChild(s5Bottom);

  screens.push(s5);

  return screens;
}

// ---------------------------------------------------------------------------
// 4. INTERACTIVE PROTOTYPE WIRING (Smart Animate)
// ---------------------------------------------------------------------------
async function wirePrototype(screens) {
  if (!screens || screens.length < 5) return;
  const [s1, s2, s3, s4, s5] = screens;

  try {
    // S1 CTA Button ("Got it") -> S2 Idle
    const s1Btn = s1.findOne((n) => n.name === 'CTA Got It');
    if (s1Btn) {
      s1Btn.reactions = [
        {
          trigger: { type: 'ON_CLICK' },
          actions: [
            {
              type: 'NODE',
              destinationId: s2.id,
              navigation: 'NAVIGATE',
              transition: {
                type: 'SMART_ANIMATE',
                easing: { type: 'EASE_OUT' },
                duration: 0.3,
              },
            },
          ],
        },
      ];
    }

    // S2 Center Ghost / Canvas Tap -> S3 Locking
    const s2Ghost = s2.findOne((n) => n.name === 'Ghost Ring');
    if (s2Ghost) {
      s2Ghost.reactions = [
        {
          trigger: { type: 'ON_CLICK' },
          actions: [
            {
              type: 'NODE',
              destinationId: s3.id,
              navigation: 'NAVIGATE',
              transition: {
                type: 'SMART_ANIMATE',
                easing: { type: 'EASE_OUT' },
                duration: 0.35,
              },
            },
          ],
        },
      ];
    }

    // S3 After Delay (800ms) -> S4 Moments
    s3.reactions = [
      {
        trigger: { type: 'AFTER_TIMEOUT', timeout: 800 },
        actions: [
          {
            type: 'NODE',
            destinationId: s4.id,
            navigation: 'NAVIGATE',
            transition: {
              type: 'SMART_ANIMATE',
              easing: { type: 'EASE_IN_AND_OUT' },
              duration: 0.4,
            },
          },
        ],
      },
    ];

    // S4 "Save Selection" -> S2 Idle
    const s4Save = s4.findOne((n) => n.name === 'Save CTA');
    if (s4Save) {
      s4Save.reactions = [
        {
          trigger: { type: 'ON_CLICK' },
          actions: [
            {
              type: 'NODE',
              destinationId: s2.id,
              navigation: 'NAVIGATE',
              transition: {
                type: 'SMART_ANIMATE',
                easing: { type: 'EASE_OUT' },
                duration: 0.3,
              },
            },
          ],
        },
      ];
    }
  } catch (e) {
    console.warn('Prototype reaction wiring requires Figma Prototype API:', e);
  }
}

// ---------------------------------------------------------------------------
// 5. COVER & PRESENTATION PAGE
// ---------------------------------------------------------------------------
async function generateCoverPage(targetPage) {
  figma.currentPage = targetPage;
  const fontBold = getSafeFont('Space Grotesk', 'Bold');
  const fontReg = getSafeFont('Inter', 'Regular');

  const coverFrame = createFrame('STILL — Presentation Banner', 1920, 1080, 0, COLORS.bg);
  coverFrame.x = 0;
  coverFrame.y = 0;

  const title = createTextNode('STILL', fontBold, 88, COLORS.accentAmber);
  title.x = 120;
  title.y = 180;
  coverFrame.appendChild(title);

  const tagline = createTextNode('Hold still to capture. Rewind to choose.', fontBold, 36, COLORS.textPrimary);
  tagline.x = 120;
  tagline.y = 290;
  coverFrame.appendChild(tagline);

  const sub = createTextNode(
    'VinnovateIT UI/UX Round 1 Challenge Submission · "Where Did My Button Go? — Rethink the Interaction"\nAuthor: Vaibhav Mittal (@vaibhavmittal29)',
    fontReg,
    20,
    COLORS.textDim,
    { lineHeight: 30 }
  );
  sub.x = 120;
  sub.y = 360;
  coverFrame.appendChild(sub);
}

// ---------------------------------------------------------------------------
// MAIN PLUGIN ENTRY POINT
// ---------------------------------------------------------------------------
figma.ui.onmessage = async (msg) => {
  await loadFonts();

  if (msg.type === 'BUILD_ALL') {
    figma.notify('🚀 Building STILL complete Figma project...');

    // Ensure pages exist
    let pCover = figma.root.children.find((p) => p.name.includes('Cover')) || figma.createPage();
    pCover.name = '01 · Cover & Overview';

    let pTokens = figma.root.children.find((p) => p.name.includes('Tokens')) || figma.createPage();
    pTokens.name = '02 · Design System & Tokens';

    let pComponents = figma.root.children.find((p) => p.name.includes('Components')) || figma.createPage();
    pComponents.name = '03 · Master Components';

    let pScreens = figma.root.children.find((p) => p.name.includes('Screens')) || figma.createPage();
    pScreens.name = '04 · 5 Hi-Fi Screens';

    let pProto = figma.root.children.find((p) => p.name.includes('Prototype')) || figma.createPage();
    pProto.name = '05 · Interactive Prototype';

    // 1. Tokens
    await generateTokens();

    // 2. Cover Page
    await generateCoverPage(pCover);

    // 3. Components Page
    await generateMasterComponents(pComponents);

    // 4. Screens Page
    const screens = await generateScreens(pScreens);

    // 5. Prototype Page
    const protoScreens = await generateScreens(pProto);
    await wirePrototype(protoScreens);

    figma.currentPage = pScreens;
    figma.viewport.scrollAndZoomIntoView(screens);
    figma.notify('✨ STILL project generated successfully! Check all 5 pages.');
  }

  if (msg.type === 'BUILD_TOKENS') {
    await generateTokens();
    figma.notify('🎨 STILL-Tokens collection and styles generated!');
  }

  if (msg.type === 'BUILD_SCREENS') {
    const screens = await generateScreens(figma.currentPage);
    figma.viewport.scrollAndZoomIntoView(screens);
    figma.notify('📱 5 Mobile screens generated on current page!');
  }
};
