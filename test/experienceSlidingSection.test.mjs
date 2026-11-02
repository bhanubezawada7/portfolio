import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Experience Section Redesign - Clean & Minimalist Card-Sliding Layout', () => {
  const expPath = path.resolve('src/components/portfolio/ExperienceSection.tsx');

  test('Step 1: Clean Up & Title - Removes old long headings/filters and uses only clean "Experience"', () => {
    assert.ok(fs.existsSync(expPath), 'ExperienceSection.tsx must exist');
    const content = fs.readFileSync(expPath, 'utf8');

    // 1. Remove old cluttered headings & descriptive text
    assert.ok(!content.includes('Career Journey'), 'Must remove Career Journey badge');
    assert.ok(
      !content.includes('Professional Experience & Internships'),
      'Must remove Professional Experience & Internships'
    );
    assert.ok(
      !content.includes('Hands-on digital marketing execution'),
      'Must remove long descriptive subtitle'
    );
    assert.ok(!content.includes('All Experiences'), 'Must remove All Experiences filter');
    assert.ok(!content.includes('Work & Management'), 'Must remove Work & Management filter');

    // 2. Uses only one clean heading: 'Experience'
    assert.match(content, /<h2[^>]*>\s*Experience\s*<\/h2>/, 'Must use only one clean heading: Experience');
  });

  test('Step 2: Card Sliding Animation (No 3D Visuals)', () => {
    const content = fs.readFileSync(expPath, 'utf8');

    // 1. No 3D visuals or canvas
    assert.ok(!content.includes('Particle'), 'Must not include 3D particle canvas');
    assert.ok(!content.includes('<canvas'), 'Must not include canvas element');
    assert.ok(!content.includes('FocusParticleMorphCanvas'), 'Must not include FocusParticleMorphCanvas');

    // 2. Three experience cards present
    assert.match(content, /Social Media Manager/, 'Must include Social Media Manager');
    assert.match(content, /Machine Learning Intern/, 'Must include Machine Learning Intern');
    assert.match(content, /Energy Audit Intern/, 'Must include Energy Audit Intern');

    // 3. Card sliding state & horizontal sliding track with translateX
    assert.match(
      content,
      /const \[activeIndex, setActiveIndex\] = useState<number>\(0\)/,
      'Must have activeIndex state for sliding selection'
    );
    assert.match(
      content,
      /transform:\s*`translateX\(-\$\{cardOffsets\[activeIndex\]/,
      'Must slide previous cards completely to the left via translateX'
    );
    assert.match(
      content,
      /overflow-hidden/,
      'Container must hide offscreen cards'
    );
    assert.match(
      content,
      /bg-gradient-to-br from-\[#1b2352\] via-\[#24306d\] to-\[#151c42\]/,
      'Active card must highlight with rich blue tint'
    );
    assert.match(
      content,
      /rounded-\[2rem\]/,
      'Active card must feature premium curved edges'
    );

    // 4. Navigation arrows: Left and Right carets
    assert.match(content, /data-testid="exp-nav-prev"/, 'Must include previous navigation arrow');
    assert.match(content, /data-testid="exp-nav-next"/, 'Must include next navigation arrow');
    assert.match(content, /handlePrev/, 'Must handle previous navigation click');
    assert.match(content, /handleNext/, 'Must handle next navigation click');

    // 5. Inactive cards show numbers and click handler
    assert.match(content, /setActiveIndex\(index\)/, 'Clicking inactive card must make it active');
    assert.match(content, /card\.num/, 'Inactive cards must display their numbers (01, 02, 03)');
  });

  test('Step 3: Simplify Text - Text is concise, elegant and professional', () => {
    const content = fs.readFileSync(expPath, 'utf8');

    // 1. No heavy "+ 3 additional responsibilities" clutter
    assert.ok(!content.includes('additional responsibilities'), 'Must remove additional responsibilities clutter');

    // 2. Crisp key highlights
    assert.match(content, /Key Highlights/, 'Must show crisp highlights');
    assert.match(content, /Tools:/, 'Must display concise tech tools');
    assert.match(content, /summary:/, 'Cards must include concise summaries');
  });
});

