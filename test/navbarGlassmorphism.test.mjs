import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Floating Glassmorphism Navbar Redesign Tests', () => {
  const navbarPath = path.resolve('src/components/layout/Navbar.tsx');

  test('Navbar file exists and is readable', () => {
    assert.ok(fs.existsSync(navbarPath), 'Navbar.tsx must exist');
  });

  test('Requirement 1: Logo/Name Update - Removes bulky box, uses Bhanusri Bezawada with metallic glow', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');

    // Bulky logo box removed
    assert.ok(!content.includes('>BB<') && !content.includes('> BB <'), 'Bulky BB monogram box must be removed');
    assert.ok(!content.includes('Engineering & Marketing'), 'Subtitle "Engineering & Marketing" must be removed');

    // Clean name: Bhanusri Bezawada
    assert.match(
      content,
      /Bhanusri Bezawada/,
      'Must contain "Bhanusri Bezawada"'
    );

    // Subtle metallic / glowing gradient styling
    assert.match(
      content,
      /bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent/,
      'Name must feature elegant metallic gradient'
    );
    assert.match(
      content,
      /drop-shadow-\[0_0_12px_rgba\(99,102,241,0\.3\)\]/,
      'Name must have subtle glowing drop shadow'
    );
  });

  test('Requirement 2: Floating Glassmorphism Pill - Centered floating pill with blur and subtle border', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');

    // Centered floating pill container
    assert.match(
      content,
      /fixed top-3 sm:top-5 left-0 right-0 z-50 flex flex-col items-center/,
      'Must be a fixed floating pill centered at the top'
    );
    assert.match(
      content,
      /rounded-full/,
      'Navbar must feature a floating pill shape (rounded-full)'
    );

    // Glassmorphism styling with cross-browser backdrop-filter
    assert.match(content, /backdrop-blur-xl/, 'Must have backdrop-blur-xl');
    assert.match(content, /backdrop-blur-2xl/, 'Must have backdrop-blur-2xl when scrolled');
    assert.match(content, /WebkitBackdropFilter/, 'Must include WebkitBackdropFilter for Safari/WebKit cross-browser support');
    assert.match(content, /backdropFilter/, 'Must include backdropFilter');
    assert.match(content, /border-white\/15/, 'Must feature subtle semi-transparent border');
  });

  test('Requirement 3: Magnetic Hover Effects & Gliding Indicator', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');

    // All 7 required nav links
    const expectedLinks = ['About', 'Skills', 'Education', 'Experience', 'Projects', 'Gallery', 'Contact'];
    for (const link of expectedLinks) {
      assert.ok(content.includes(`name: '${link}'`), `Must include nav link: ${link}`);
    }

    // Magnetic physics implementation
    assert.match(content, /handleMouseMove/, 'Must track mouse movement for magnetic effect');
    assert.match(content, /rect\.left \+ rect\.width \/ 2/, 'Must compute center X for magnetic pull');
    assert.match(content, /rect\.top \+ rect\.height \/ 2/, 'Must compute center Y for magnetic pull');
    assert.match(content, /translate3d\(/, 'Must apply 3D translate for magnetic pull');

    // Gliding underline and glowing dot indicator
    assert.match(content, /data-testid="navbar-gliding-indicator"/, 'Must render gliding indicator');
    assert.match(content, /from-cyan-400 via-indigo-400 to-purple-400/, 'Gliding indicator must have gradient underline');
    assert.match(content, /w-1\.5 h-1\.5 rounded-full bg-cyan-300 shadow-\[0_0_8px_#38bdf8\]/, 'Gliding indicator must include soft glowing dot');
    assert.match(content, /updateGliderToElement/, 'Must calculate smooth glide coordinates');
  });

  test('Requirement 4: Sticky & Dynamic Scroll Behavior - Shrinks subtly on scroll', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');

    // Scroll state tracking
    assert.match(content, /setScrolled\(window\.scrollY > 25\)/, 'Must detect scroll position for shrinking');
    assert.match(content, /data-scrolled=/, 'Must expose scrolled state attribute');

    // Dynamic shrinking transition
    assert.match(content, /scale-\[0\.98\]/, 'Must subtly shrink scale when scrolled');
    assert.match(content, /py-2 px-5 sm:px-8/, 'Must reduce padding when scrolled');
    assert.match(content, /transition-all duration-300 ease-out/, 'Must animate shrink smoothly');
  });

  test('Requirement 5: Spacious Distribution & Wide Sizing - Left name, centered links, right actions', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');

    // Wide maximum width to comfortably fit links with generous spacing
    assert.match(content, /max-w-6xl xl:max-w-7xl/, 'Navbar must have a wide max width to avoid crowding');

    // Spacious justify-between distribution
    assert.match(content, /justify-between/, 'Must use space-between layout for far-left, center, and far-right');

    // Far left alignment for brand name
    assert.match(content, /justify-start shrink-0/, 'Logo/Name must be firmly anchored to far left');

    // Generous gaps between menu links
    assert.match(content, /gap-1\.5 xl:gap-3/, 'Menu links must have generous comfortable gaps');
    assert.match(content, /px-3\.5 xl:px-4 py-2/, 'Menu links must have generous padding');

    // Far right alignment for actions
    assert.match(content, /justify-end gap-2\.5 sm:gap-3\.5 shrink-0/, 'Actions must be firmly anchored to far right');
  });
});
