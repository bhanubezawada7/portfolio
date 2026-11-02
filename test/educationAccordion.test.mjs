import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Education & Qualifications Accordion Redesign', () => {
  const eduPath = path.resolve('src/components/portfolio/EducationSection.tsx');

  test('Component exists and old slider is completely removed', () => {
    assert.ok(fs.existsSync(eduPath), 'EducationSection.tsx must exist');
    const content = fs.readFileSync(eduPath, 'utf8');

    // Confirm old slider elements are removed
    assert.ok(!content.includes('perspective-1400'), 'Old 3D perspective slider must be removed');
    assert.ok(!content.includes('rotate-y-'), 'Old 3D rotating cards must be removed');
    assert.ok(!content.includes('ChevronLeft'), 'Old carousel chevron buttons must be removed');
    assert.ok(!content.includes('ChevronRight'), 'Old carousel chevron buttons must be removed');
    assert.ok(!content.includes('Click card or Next to slide'), 'Old slider helper text must be removed');
  });

  test('Card 1: 10th Class (SSC) satisfies all structure, image, closed & expanded requirements', () => {
    const content = fs.readFileSync(eduPath, 'utf8');

    // Background image
    assert.match(content, /Colorful School Courtyard Playground\.png/, 'Must use Colorful School Courtyard Playground.png');
    
    // Closed state: title
    assert.match(content, /10th Class/, 'Must show closed title 10th Class');

    // Expanded state: SVR English Medium High School, Gudlavalleru & CGPA: 9.3
    assert.match(content, /SVR English Medium High School, Gudlavalleru/, 'Must reveal SVR English Medium High School');
    assert.match(content, /CGPA:\s*9\.3/, 'Must reveal CGPA: 9.3');
  });

  test('Card 2: Intermediate satisfies all structure, image, closed & expanded requirements', () => {
    const content = fs.readFileSync(eduPath, 'utf8');

    // Background image
    assert.match(content, /Screenshot 2026-10-30 125309\.jpg/, 'Must use Screenshot 2026-10-30 125309.jpg');

    // Closed state: title
    assert.match(content, /Intermediate/, 'Must show closed title Intermediate');

    // Expanded state: Narayana Junior College, Gudivada, MPC, and CGPA: 8.0
    assert.match(content, /Narayana Junior College, Gudivada/, 'Must reveal Narayana Junior College');
    assert.match(content, /MPC/, 'Must reveal MPC branch');
    assert.match(content, /CGPA:\s*8\.0/, 'Must reveal CGPA: 8.0');
  });

  test('Card 3: B.Tech satisfies all structure, image, closed & expanded requirements', () => {
    const content = fs.readFileSync(eduPath, 'utf8');

    // Background image
    assert.match(content, /Screenshot 2026-10-30 125347\.jpg/, 'Must use Screenshot 2026-10-30 125347.jpg');

    // Closed state: title
    assert.match(content, /B\.Tech - EEE/, 'Must show closed title B.Tech - EEE');

    // Expanded state: SRGEC, Electrical and Electronics Engineering, 2021–2025, CGPA: 7.8
    assert.match(content, /Seshadri Rao Gudlavalleru Engineering College \(SRGEC\)/, 'Must reveal SRGEC college');
    assert.match(content, /Electrical and Electronics Engineering/, 'Must reveal EEE branch');
    assert.match(content, /2021[–-]2025/, 'Must reveal 2021–2025 period');
    assert.match(content, /CGPA:\s*7\.8/, 'Must reveal CGPA: 7.8');
  });

  test('Accordion & Animation: Side-by-side vertical cards with smooth horizontal expansion and dark overlay', () => {
    const content = fs.readFileSync(eduPath, 'utf8');

    // Side-by-side vertical cards layout
    assert.match(content, /flex flex-col md:flex-row/, 'Must use flex layout transitioning to horizontal md:flex-row');
    assert.match(content, /flex-\[3\.5\]|flex-\[4\]/, 'Expanded card must have wide flex value');
    assert.match(content, /flex-1/, 'Closed card must shrink to flex-1');

    // Smooth horizontal expansion transition
    assert.match(content, /transition-all duration-700/, 'Must have 700ms smooth transition');
    assert.match(content, /cubic-bezier/, 'Must use cubic-bezier easing');

    // Click-to-expand handler
    assert.match(content, /handleCardClick|setExpandedIndex/, 'Must implement click-to-expand handler');

    // Dark overlay on background images for high contrast white text readability
    assert.match(content, /bg-gradient-to-t\s+from-slate-950|bg-gradient-to-t\s+from-black/, 'Must have dark overlay for readability');
    assert.match(content, /text-white/, 'Must style headings and details in crisp white text');
  });

  test('Image files exist on disk and are readable', () => {
    const img1 = path.resolve('public/assets/education/Colorful School Courtyard Playground.png');
    const img2 = path.resolve('public/assets/education/Screenshot 2026-10-30 125309.jpg');
    const img3 = path.resolve('public/assets/education/Screenshot 2026-10-30 125347.jpg');

    assert.ok(fs.existsSync(img1), 'Card 1 image must exist in public/assets/education');
    assert.ok(fs.existsSync(img2), 'Card 2 image must exist in public/assets/education');
    assert.ok(fs.existsSync(img3), 'Card 3 image must exist in public/assets/education');

    assert.ok(fs.statSync(img1).size > 10000, 'Card 1 image must be non-empty valid file');
    assert.ok(fs.statSync(img2).size > 10000, 'Card 2 image must be non-empty valid file');
    assert.ok(fs.statSync(img3).size > 10000, 'Card 3 image must be non-empty valid file');
  });
});

