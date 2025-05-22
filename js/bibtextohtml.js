/**
 * bibtextohtml.js - Compatibility wrapper for main.js bibliography functionality
 * This file exists for backward compatibility
 */

// Simple BibTeX parser for bibliography entries
class BibTexParser {
  constructor() {
    this.entries = {};
  }

  // Parse BibTeX string into structured data
  parse(bibtex) {
    // Simplified parser for backward compatibility
    const entries = {};
    const entryRegex = /@(\w+)\s*{\s*([^,]+),\s*([\s\S]+?)\s*}/g;
    const fieldRegex = /(\w+)\s*=\s*{([^{}]*)}/g;

    let match;
    while ((match = entryRegex.exec(bibtex)) !== null) {
      const type = match[1].toLowerCase();
      const id = match[2];
      const content = match[3];

      const entry = { type, id };
      let fieldMatch;

      while ((fieldMatch = fieldRegex.exec(content)) !== null) {
        const key = fieldMatch[1].toLowerCase();
        const value = fieldMatch[2].trim();
        entry[key] = value;
      }

      entries[id] = entry;
    }

    this.entries = entries;
    return entries;
  }

  // Format entries as HTML
  toHTML() {
    const html = [];

    Object.values(this.entries).forEach(entry => {
      let entryHTML = '<div class="bib-entry">';

      // Authors
      if (entry.author) {
        entryHTML += `<p class="bib-authors">${entry.author}</p>`;
      }

      // Title
      if (entry.title) {
        entryHTML += `<p class="bib-title">${entry.title}</p>`;
      }

      // Journal/Conference
      if (entry.journal || entry.booktitle) {
        const venue = entry.journal || entry.booktitle;
        entryHTML += `<p class="bib-venue">${venue}</p>`;
      }

      // Year
      if (entry.year) {
        entryHTML += `<p class="bib-year">${entry.year}</p>`;
      }

      entryHTML += '</div>';
      html.push(entryHTML);
    });

    return html.join('\n');
  }
}

// Create global instance for backward compatibility
const bibParser = new BibTexParser();

// Load bibliography from file or element
function loadBibliography(source, target) {
  console.log('Loading bibliography from:', source);

  // Check if main.js initBibliography function exists
  if (typeof initBibliography === 'function') {
    initBibliography();
    return;
  }

  // Fallback implementation
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  // Create loading indicator
  targetElement.innerHTML = '<p>Loading bibliography...</p>';

  // Fetch the bibliography file
  fetch(source)
    .then(response => response.text())
    .then(data => {
      const entries = bibParser.parse(data);
      targetElement.innerHTML = bibParser.toHTML();
    })
    .catch(error => {
      console.error('Failed to load bibliography:', error);
      targetElement.innerHTML = '<p>Failed to load bibliography.</p>';
    });
}

// Initialize on DOM ready for backward compatibility
document.addEventListener('DOMContentLoaded', function() {
  // Look for bibliography elements
  const bibElements = document.querySelectorAll('[data-bib-source]');
  bibElements.forEach(element => {
    const source = element.getAttribute('data-bib-source');
    if (source) {
      loadBibliography(source, '#' + element.id);
    }
  });
});
