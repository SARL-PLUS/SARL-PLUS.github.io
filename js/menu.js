/**
 * menu.js - Compatibility wrapper for the main.js functionality
 * This file exists for backward compatibility and simply calls the functions in main.js
 */

// Import main.js functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if main.js is loaded
  if (typeof initMenu === 'function') {
    // Main.js is already loaded, do nothing
    console.log('menu.js: Using functions from main.js');
  } else {
    // Main.js is not loaded, add a script tag to load it
    console.log('menu.js: Loading main.js');
    const script = document.createElement('script');
    script.src = 'js/main.js';
    script.onload = function() {
      // Initialize menu when main.js is loaded
      if (typeof initMenu === 'function') {
        initMenu();
      }
    };
    document.body.appendChild(script);
  }
});
