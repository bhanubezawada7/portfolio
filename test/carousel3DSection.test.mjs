import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Section 02 - Redesigned Clean & Interactive About Me Layout', () => {
  const aboutPath = path.resolve('src/components/portfolio/AboutSection.tsx');

  test('Step 1: Clean Up - All clutter, long titles, stat counters, buttons and boxes are removed', () => {
    assert.ok(fs.existsSync(aboutPath), 'AboutSection.tsx must exist');
    const content = fs.readFileSync(aboutPath, 'utf8');

    // 1. Remove long titles and paragraphs
    assert.ok(
      !content.includes('Engineering Foundations, Digital Strategy & Creative Execution'),
      'Must remove old long title'
    );
    assert.ok(
      !content.includes('Bridging technical precision with digital engagement'),
      'Must remove old long subtitle paragraph'
    );

    // 2. Remove stat counters
    assert.ok(!content.includes('B.Tech CGPA'), 'Must remove B.Tech CGPA stat counter');
    assert.ok(!content.includes('Core Projects'), 'Must remove Core Projects counter');
    assert.ok(!content.includes('Industry Internships'), 'Must remove Internships counter');

    // 3. Remove buttons
    assert.ok(!content.includes('Contact Me'), 'Must remove Contact Me button');
    assert.ok(!content.includes('View Projects'), 'Must remove View Projects button');
    assert.ok(!content.includes('Download Resume'), 'Must remove Download Resume button');

    // 4. Remove Career Objective and Profile Trajectory boxes
    assert.ok(!content.includes('Career Objective'), 'Must remove Career Objective box');
    assert.ok(!content.includes('Profile Trajectory'), 'Must remove Profile Trajectory box');
  });

  test('Step 2: New About Me Layout - Clean side-aligned heading, AI Web Developer subtitle & Read More button', () => {
    const content = fs.readFileSync(aboutPath, 'utf8');

    // 1. Clean side-aligned heading: 'About Me'
    assert.match(content, /About Me/, 'Must include clean heading: About Me');
    assert.match(content, /text-left/, 'Must be side-aligned');

    // 2. Subtitle: 'AI Web Developer'
    assert.match(content, /AI Web Developer/, 'Must display subtitle: AI Web Developer');
    assert.ok(
      !content.includes('Frontend Developer'),
      'Must not use Frontend Developer as requested'
    );

    // 3. No profile image in this section
    assert.ok(!content.includes('<img'), 'Must not include an img element in this section');
    assert.ok(
      !content.includes('bhausri_portrait.jpg'),
      'Must not include portrait image in this section'
    );

    // 4. Description starting with 'Hi, my name is Bhanusri Bezawada...'
    assert.match(
      content,
      /Hi, my name is Bhanusri Bezawada/,
      'Description must start with Hi, my name is Bhanusri Bezawada'
    );

    // 5. Prominent highlighted 'Read More' interactive button
    assert.match(content, /Read More/, 'Must have Read More button');
    assert.match(content, /setIsExpanded/, 'Must have state toggle for expanding skills');
  });

  test('Step 3: Interactive Skills Cards - Initially hidden, reveals 3 premium curved 3D cards on click without Our Services', () => {
    const content = fs.readFileSync(aboutPath, 'utf8');

    // 1. Initially hidden skills section
    assert.match(
      content,
      /const \[isExpanded, setIsExpanded\] = useState<boolean>\(false\)/,
      'isExpanded must default to false so cards are initially hidden'
    );
    assert.match(
      content,
      /\{isExpanded &&/,
      'Cards must be conditionally revealed when isExpanded is true'
    );

    // 2. Do NOT use the heading 'Our Services'
    assert.ok(
      !content.includes('Our Services'),
      'Must NOT use the heading Our Services'
    );

    // 3. Card 1: Web Development with icon & short description
    assert.match(content, /title:\s*'Web Development'/, 'Card 1 title must be Web Development');
    assert.match(content, /Code2/, 'Card 1 must include relevant Code2 icon');

    // 4. Card 2: Graphic Design with icon & short description
    assert.match(content, /title:\s*'Graphic Design'/, 'Card 2 title must be Graphic Design');
    assert.match(content, /Palette/, 'Card 2 must include relevant Palette icon');

    // 5. Card 3: Social Media Marketing with icon & short description
    assert.match(
      content,
      /title:\s*'Social Media Marketing'/,
      'Card 3 title must be Social Media Marketing'
    );
    assert.match(content, /Share2/, 'Card 3 must include relevant Share2 icon');

    // 6. Premium curved design and 3D interactive tilt
    assert.match(content, /rounded-\[2rem\]/, 'Cards must have premium curved edges');
    assert.match(content, /perspective\(1000px\)/, 'Cards must use 3D perspective projection');
    assert.match(content, /rotateX/, 'Cards must calculate 3D tilt on X axis');
    assert.match(content, /rotateY/, 'Cards must calculate 3D tilt on Y axis');
    assert.match(content, /handleMouseMove/, 'Cards must track mouse movement for interactive 3D tilt');
  });

  test('3D Particle Sphere Scroll & Positioning Transition between Hero and About Me', () => {
    const aboutContent = fs.readFileSync(aboutPath, 'utf8');
    const heroPath = path.resolve('src/components/portfolio/HeroSection.tsx');
    const heroContent = fs.readFileSync(heroPath, 'utf8');
    const canvasPath = path.resolve('src/components/portfolio/ParticleSphereCanvas.tsx');
    const canvasContent = fs.readFileSync(canvasPath, 'utf8');

    // 1. HeroSection defines hero-sphere-target behind photo
    assert.match(heroContent, /id="hero-sphere-target"/, 'Hero section must define hero-sphere-target anchor');

    // 2. AboutSection defines about-sphere-target on empty right side
    assert.match(aboutContent, /id="about-sphere-target"/, 'About section must define about-sphere-target landing anchor');
    assert.match(aboutContent, /lg:col-span-5/, 'About section right column must allocate width for 3D sphere');

    // 3. ParticleSphereCanvas interpolates scroll between Hero and About Me
    assert.match(canvasContent, /hero-sphere-target/, 'Canvas must reference hero target anchor');
    assert.match(canvasContent, /about-sphere-target/, 'Canvas must reference about target anchor');
    assert.match(canvasContent, /rawProgress|scrollProgress/, 'Canvas must compute scroll progress between sections');
    assert.match(canvasContent, /smoothProgress/, 'Canvas must smoothly interpolate position between Hero and About');

    // 4. Continued interactive mouse tracking
    assert.match(canvasContent, /handleGlobalMouseMove/, 'Canvas must track mouse movement across the page');
    assert.match(canvasContent, /rotRef/, 'Canvas must maintain 3D rotation state');
  });
});
