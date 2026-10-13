import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialProjects,
  initialSkills,
  initialEducation,
  initialExperience,
  initialSiteSettings,
  initialResumeMetadata
} from '../src/data/initialData.ts';

describe('Portfolio Seed Data Integrity', () => {
  test('Owner identity matches prompt specifications', () => {
    assert.equal(initialSiteSettings.ownerName, 'Bhausri Bezawada');
    assert.equal(initialSiteSettings.primaryEmail, 'bhanubezawada1@gmail.com');
    assert.equal(initialSiteSettings.phone, '9618624877');
    assert.equal(initialSiteSettings.heroPortrait, '/assets/bhausri_portrait.jpg');
    assert.equal(initialSiteSettings.resumeUrl, '/assets/bhanu_resume.pdf');
  });

  test('Academics include verified degrees and CGPAs', () => {
    assert.equal(initialEducation.length, 3);
    const srgec = initialEducation.find(e => e.institution.includes('SRGEC') || e.institution.includes('Seshadri'));
    assert.ok(srgec, 'SRGEC education record exists');
    assert.equal(srgec.grade, 'CGPA: 7.8');

    const narayana = initialEducation.find(e => e.institution.includes('Narayana'));
    assert.ok(narayana, 'Narayana Jr College record exists');
    assert.equal(narayana.grade, 'CGPA: 8.0');

    const ssc = initialEducation.find(e => e.degree.includes('SSC') || e.degree.includes('Secondary'));
    assert.ok(ssc, 'SSC record exists');
    assert.equal(ssc.grade, 'CGPA: 9.3');
  });

  test('Projects contain verified engineering prototypes', () => {
    assert.equal(initialProjects.length, 3);
    const evProject = initialProjects.find(p => p.slug === 'ultracapacitor-based-ev-charging-prototype');
    assert.ok(evProject, 'EV charging prototype exists');
    assert.equal(evProject.category, 'Engineering');
    assert.ok(evProject.technologies.includes('Arduino'));

    const ledProject = initialProjects.find(p => p.slug === 'led-distance-indicator-arduino');
    assert.ok(ledProject, 'LED distance indicator exists');

    const solarProject = initialProjects.find(p => p.slug === 'solar-tracker');
    assert.ok(solarProject, 'Solar tracker exists');
  });

  test('Skills cover all required prompt categories', () => {
    const categories = new Set(initialSkills.map(s => s.category));
    assert.ok(categories.has('Programming'));
    assert.ok(categories.has('Web Development'));
    assert.ok(categories.has('Digital Marketing'));
    assert.ok(categories.has('Creative & Productivity'));
    assert.ok(categories.has('Technical Tools'));

    const skillNames = initialSkills.map(s => s.name);
    assert.ok(skillNames.includes('Python'));
    assert.ok(skillNames.includes('C'));
    assert.ok(skillNames.includes('HTML5'));
    assert.ok(skillNames.includes('JavaScript'));
    assert.ok(skillNames.includes('Social Media Marketing'));
    assert.ok(skillNames.includes('Canva'));
    assert.ok(skillNames.includes('MATLAB'));
    assert.ok(skillNames.includes('ProgeCAD'));
  });

  test('Experience includes verified work and internships', () => {
    assert.equal(initialExperience.length, 3);
    const smm = initialExperience.find(e => e.role === 'Social Media Manager');
    assert.ok(smm, 'Social Media Manager exists');
    assert.ok(smm.responsibilities.length >= 5);

    const mlIntern = initialExperience.find(e => e.organization.includes('Smart Bridge'));
    assert.ok(mlIntern, 'Smart Bridge ML internship exists');

    const energyIntern = initialExperience.find(e => e.organization.includes('BIGETA'));
    assert.ok(energyIntern, 'BIGETA internship exists');
  });
});
