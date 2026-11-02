import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Hero Section 3D Booklet & In-Place Backward Flip Tests', () => {
  const bookletPath = path.resolve('src/components/portfolio/BookletSubtitle.tsx');
  const heroPath = path.resolve('src/components/portfolio/HeroSection.tsx');

  test('BookletSubtitle component exists and is mounted in HeroSection', () => {
    assert.ok(fs.existsSync(bookletPath), 'BookletSubtitle.tsx must exist');
    assert.ok(fs.existsSync(heroPath), 'HeroSection.tsx must exist');

    const heroContent = fs.readFileSync(heroPath, 'utf8');
    assert.match(heroContent, /import\s+.*BookletSubtitle.*from/, 'HeroSection must import BookletSubtitle');
    assert.match(heroContent, /<BookletSubtitle/, 'HeroSection must render BookletSubtitle inside subtitleRef');
  });

  test('Requirement 1: Clean UI - Removes all extra text and counters', () => {
    const bookletContent = fs.readFileSync(bookletPath, 'utf8');

    // Front Face Clean Requirements:
    assert.ok(!bookletContent.includes('SPECIALIZATION'), 'Front face must remove SPECIALIZATION label');
    assert.ok(!bookletContent.includes('>flip<') && !bookletContent.includes('CornerDownRight'), 'Front face must remove flip hint');
    assert.ok(!bookletContent.includes('01 / 02'), 'Front face must remove 01 / 02 counter');
    assert.match(bookletContent, /Graphic Designer/, 'Front face must simply display "Graphic Designer"');

    // Back Face Clean Requirements:
    assert.ok(!bookletContent.includes('CORE ROLE'), 'Back face must remove CORE ROLE label');
    assert.ok(!bookletContent.includes('02 / 02'), 'Back face must remove 02 / 02 counter');
    assert.match(bookletContent, /AI Web Developer/, 'Back face must simply display "AI Web Developer"');
  });

  test('Requirement 2: In-Place Backward Flip (Single Page View, No Side Spread, No Upward Overlap)', () => {
    const bookletContent = fs.readFileSync(bookletPath, 'utf8');

    // Single Page View: Card flips in-place around 'center center'
    assert.match(bookletContent, /transformOrigin:\s*'center center'/, 'Must flip strictly in-place around center center');
    assert.match(bookletContent, /rotateX\(-180deg\)/, 'Must flip backwards around X axis');

    // Does not flip to the side (no rotateY side-by-side spread)
    assert.ok(!bookletContent.includes('rotateY(-175deg)'), 'Must NOT open sideways into a two-page spread');

    // Does not flip upward around top axis
    assert.ok(!bookletContent.includes("transformOrigin: 'top center'"), 'Must NOT flip upward from top edge');

    // Front and Back faces with backfaceVisibility hidden
    assert.match(bookletContent, /backfaceVisibility:\s*'hidden'/, 'Must hide backface for clean single card view');
    assert.match(bookletContent, /rotateX\(180deg\)/, 'Back face must be oriented right-side up');

    // Hover and Click trigger state
    assert.match(bookletContent, /onMouseEnter/, 'Must support hover interaction');
    assert.match(bookletContent, /onClick/, 'Must support click toggle interaction');
    assert.match(bookletContent, /isHovered\s*\|\|\s*isClicked/, 'Must flip on hover or click');
  });

  test('Requirement 3: Stationary multi-layer paper depth and binding rings', () => {
    const bookletContent = fs.readFileSync(bookletPath, 'utf8');

    // Top wire rings along top edge
    assert.match(bookletContent, /data-testid="booklet-spiral-rings"/, 'Must include binding rings');
    assert.match(bookletContent, /ringCount/, 'Must define ring loop count');

    // Stationary stacked backing sheets for 3D depth without spreading
    assert.match(bookletContent, /translate3d\(0,\s*3px,\s*-8px\)/, 'Must render layer 3 deep backing sheet');
    assert.match(bookletContent, /translate3d\(0,\s*1\.5px,\s*-4px\)/, 'Must render layer 2 middle sheet');
  });
});
