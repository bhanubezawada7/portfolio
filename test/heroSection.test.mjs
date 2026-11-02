import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Cinematic Sequence & Hero Section Requirements', () => {
  test('Hero section executes step-by-step animation: dot -> Bhanu -> PORTFOLIO moving below photo', () => {
    const heroPath = path.resolve('src/components/portfolio/HeroSection.tsx');
    assert.ok(fs.existsSync(heroPath), 'HeroSection.tsx must exist');
    const content = fs.readFileSync(heroPath, 'utf8');

    // 1. Initial State: Single dot dropping down from the top
    assert.match(content, /dot-drop/, 'Must implement dot dropping animation');
    assert.match(content, /dot-pulse/, 'Must style glowing pulsing dot');

    // 2. Transition into 'Bhanu'
    assert.match(content, /Bhanu/, 'Must transition into text Bhanu');

    // 3. Transition into 'PORTFOLIO' moving down strictly below photo
    assert.match(content, /PORTFOLIO/, 'Must transition into PORTFOLIO title');
    assert.match(content, /translate-y-0\s+mt-4/, 'PORTFOLIO must move down below photo');

    // 4. Subtitle: 'AI Web Developer' right below PORTFOLIO
    assert.match(content, /AI Web Developer/, 'Must display AI Web Developer subtitle');
    assert.ok(!content.includes('ENGINEER & CREATOR'), 'ENGINEER & CREATOR must be completely removed');

    // 5. 3D Parallax Mouse Tracking on Profile Photo
    assert.match(content, /bhausri_portrait\.jpg/, 'Must use real portrait photo');
    assert.match(content, /perspective\(1200px\)/, 'Must implement 3D perspective');
    assert.match(content, /rotateX/, 'Must implement vertical tilt');
    assert.match(content, /rotateY/, 'Must implement horizontal tilt');
    assert.match(content, /handleMouseMove/, 'Must track mouse movement');

    // 6. Buttons and descriptions removed from Hero
    assert.ok(!content.includes('Contact Me'), 'Contact Me button must not be in Hero');
    assert.ok(!content.includes('View Projects'), 'View Projects button must not be in Hero');
    assert.ok(!content.includes('Download Resume'), 'Download Resume button must not be in Hero');
    assert.ok(!content.includes('B.Tech CGPA'), 'Stat counters must not be in Hero');

    // 7. Replay capability
    assert.match(content, /Replay Intro/, 'Must provide Replay Intro button');
  });

  test('Hero section implements dynamic mouse-tracking on BHANU, PORTFOLIO, AI Web Developer with Cyan-to-Royal Blue theme', () => {
    const heroPath = path.resolve('src/components/portfolio/HeroSection.tsx');
    const content = fs.readFileSync(heroPath, 'utf8');

    // 1. Text elements have dedicated refs for mouse tracking
    assert.match(content, /bhanuTextRef/, 'Must have ref for BHANU text tracking');
    assert.match(content, /portfolioTextRef/, 'Must have ref for PORTFOLIO text tracking');
    assert.match(content, /subtitleRef/, 'Must have ref for AI Web Developer subtitle tracking');

    // 2. Multi-layered 3D tilt & parallax applied to texts in animation loop
    assert.match(content, /bhanuTextRef\.current\.style\.transform/, 'Must dynamically transform BHANU');
    assert.match(content, /portfolioTextRef\.current\.style\.transform/, 'Must dynamically transform PORTFOLIO');
    assert.match(content, /subtitleRef\.current\.style\.transform/, 'Must dynamically transform AI Web Developer');

    // 3. Dynamic glowing shadow / chromatic effect on mouse movement
    assert.match(content, /bhanuTextRef\.current\.style\.filter/, 'Must apply dynamic glowing filter to BHANU');
    assert.match(content, /portfolioTextRef\.current\.style\.filter/, 'Must apply dynamic glowing filter to PORTFOLIO');

    // 4. Rich Cyan to Royal Blue palette (#00E5FF and #0056B3)
    assert.match(content, /#00E5FF/, 'Must use Cyan #00E5FF in color scheme');
    assert.match(content, /#0056B3/, 'Must use Royal Blue #0056B3 in color scheme');

    // 5. Interactive background spotlight
    assert.match(content, /spotlightRef/, 'Must track cursor with dynamic ambient spotlight');
  });

  test('AboutSection clean up: removes stat counters, duplicate action buttons, and trajectory boxes', () => {
    const aboutPath = path.resolve('src/components/portfolio/AboutSection.tsx');
    assert.ok(fs.existsSync(aboutPath), 'AboutSection.tsx must exist');
    const content = fs.readFileSync(aboutPath, 'utf8');

    // Clutter items must be removed as requested in Step 1
    assert.ok(!content.includes('Career Objective'), 'Career Objective must be removed');
    assert.ok(!content.includes('Profile Trajectory'), 'Profile Trajectory must be removed');
    assert.ok(!content.includes('B.Tech CGPA'), 'Stat counters must be removed');
    assert.ok(!content.includes('Engineering Foundations, Digital Strategy'), 'Old long titles must be removed');
  });

  test('3D Particle Sphere and Quote Layering Requirements', () => {
    const spherePath = path.resolve('src/components/portfolio/ParticleSphereCanvas.tsx');
    assert.ok(fs.existsSync(spherePath), 'ParticleSphereCanvas.tsx must exist');
    const sphereContent = fs.readFileSync(spherePath, 'utf8');

    // 1. 3D Particle Sphere implementation
    assert.match(sphereContent, /canvas/, 'Must use canvas element');
    assert.match(sphereContent, /goldenAngle|goldenRatio|theta/, 'Must use spherical mathematical distribution');
    assert.match(sphereContent, /rotRef|rotX|rotY|cosY/, 'Must compute 3D rotation projection');
    assert.match(sphereContent, /mousemove/, 'Must track mouse movement for interactive rotation');

    const heroPath = path.resolve('src/components/portfolio/HeroSection.tsx');
    const heroContent = fs.readFileSync(heroPath, 'utf8');

    // 2. Integration in HeroSection
    assert.match(heroContent, /ParticleSphereCanvas/, 'Must import and mount ParticleSphereCanvas');
    assert.match(heroContent, /Thoughtfully\s+.*?Designed.*?Purposefully\s+.*?Built/s, 'Must include exact tagline: Thoughtfully Designed. Purposefully Built.');
    assert.match(heroContent, /quoteRef/, 'Must have dedicated ref for quote 3D parallax tracking');

    // 3. Three-tier text layering (Sphere background -> Quote middle -> BHANU foreground)
    assert.match(heroContent, /z-0|z-10/, 'Sphere must be positioned in background');
    assert.match(heroContent, /z-20/, 'Quote must be positioned in middle layer');
    assert.match(heroContent, /z-30/, 'BHANU must be positioned prominently in foreground layer');
  });
});
