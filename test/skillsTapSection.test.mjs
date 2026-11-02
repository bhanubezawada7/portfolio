import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Skills Section Tap & Water Flow Redesign Tests', () => {
  const skillsFilePath = path.resolve('src/components/portfolio/SkillsSection.tsx');
  const tapGraphicFilePath = path.resolve('src/components/portfolio/WaterTapGraphic.tsx');
  const wateryBgFilePath = path.resolve('src/components/common/WateryBackground.tsx');
  const homePagePath = path.resolve('src/pages/HomePage.tsx');
  const indexCssPath = path.resolve('src/index.css');

  test('All source files exist and are readable', () => {
    assert.ok(fs.existsSync(skillsFilePath), 'SkillsSection.tsx exists');
    assert.ok(fs.existsSync(tapGraphicFilePath), 'WaterTapGraphic.tsx exists');
    assert.ok(fs.existsSync(wateryBgFilePath), 'WateryBackground.tsx exists');
    assert.ok(fs.existsSync(homePagePath), 'HomePage.tsx exists');
    assert.ok(fs.existsSync(indexCssPath), 'index.css exists');
  });

  test('SkillsSection contains all 5 exact prompt categories', () => {
    const content = fs.readFileSync(skillsFilePath, 'utf-8');
    assert.ok(content.includes('Programming'), 'Programming category exists');
    assert.ok(content.includes('Web Development'), 'Web Development category exists');
    assert.ok(content.includes('Digital Marketing'), 'Digital Marketing category exists');
    assert.ok(content.includes('Creative & Productivity'), 'Creative & Productivity category exists');
    assert.ok(content.includes('Technical Tools'), 'Technical Tools category exists');
  });

  test('All 15 exact skills are mapped under their exact categories', () => {
    const content = fs.readFileSync(skillsFilePath, 'utf-8');

    // Programming
    assert.ok(content.includes("'Python'"), 'Python skill exists');
    assert.ok(content.includes("'C'"), 'C skill exists');

    // Web Development
    assert.ok(content.includes("'HTML5'"), 'HTML5 skill exists');
    assert.ok(content.includes("'CSS3'"), 'CSS3 skill exists');
    assert.ok(content.includes("'JavaScript'"), 'JavaScript skill exists');

    // Digital Marketing
    assert.ok(content.includes("'Social Media Marketing'"), 'Social Media Marketing exists');
    assert.ok(content.includes("'Digital Marketing Management'"), 'Digital Marketing Management exists');
    assert.ok(content.includes("'Campaign Planning & Strategy'"), 'Campaign Planning & Strategy exists');

    // Creative & Productivity
    assert.ok(content.includes("'Canva'"), 'Canva exists');
    assert.ok(content.includes("'Microsoft PowerPoint'"), 'Microsoft PowerPoint exists');
    assert.ok(content.includes("'Microsoft Excel'"), 'Microsoft Excel exists');
    assert.ok(content.includes("'AI Tools for Content Creation'"), 'AI Tools for Content Creation exists');

    // Technical Tools
    assert.ok(content.includes("'MATLAB'"), 'MATLAB exists');
    assert.ok(content.includes("'Basic Machine Learning'"), 'Basic Machine Learning exists');
    assert.ok(content.includes("'ProgeCAD'"), 'ProgeCAD exists');
  });

  test('Interactive Water Tap fixture and controls are implemented', () => {
    const tapContent = fs.readFileSync(tapGraphicFilePath, 'utf-8');
    assert.ok(tapContent.includes('Turn off'), 'Turn off toggle label exists');
    assert.ok(tapContent.includes('Turn on'), 'Turn on toggle label exists');
    assert.ok(tapContent.includes('Pump Skills'), 'Pump Skills button exists');
    assert.ok(tapContent.includes('spoutRef'), 'Spout anchor ref exists');
    assert.ok(tapContent.includes('tap-toggle-btn'), 'Tap toggle button ID exists');
    assert.ok(tapContent.includes('tap-pump-btn'), 'Tap pump button ID exists');
  });

  test('Watery background effect component is implemented and loaded', () => {
    const bgContent = fs.readFileSync(wateryBgFilePath, 'utf-8');
    assert.ok(bgContent.includes('WateryBackground'), 'WateryBackground component defined');
    assert.ok(bgContent.includes('requestAnimationFrame'), 'Smooth animation loop in background');

    const homeContent = fs.readFileSync(homePagePath, 'utf-8');
    assert.ok(homeContent.includes('WateryBackground'), 'HomePage mounts WateryBackground');
  });

  test('Fluid drop and tap animations are defined in index.css', () => {
    const cssContent = fs.readFileSync(indexCssPath, 'utf-8');
    assert.ok(cssContent.includes('@keyframes skillWaterDrop'), 'skillWaterDrop animation defined');
    assert.ok(cssContent.includes('.skill-drop-animated'), 'skill-drop-animated class defined');
    assert.ok(cssContent.includes('@keyframes waterStreamDash'), 'waterStreamDash animation defined');
    assert.ok(cssContent.includes('.water-stream-dash'), 'water-stream-dash class defined');
  });
});
