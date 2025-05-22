/**
 * Enhanced main.js - Core functionality for SARL website
 * Modernized with performance optimizations and improved user experience
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize page components
  initMobileMenu();
  handleExternalLinks();
  initSmoothScrolling();
  initAnimations();
  setupPublications();

  // Add loaded class for CSS transitions
  document.body.classList.add('loaded');

  // Set active navigation based on current scroll position
  updateActiveNavOnScroll();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  // Toggle menu visibility when button is clicked
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    menuToggle.setAttribute(
      'aria-expanded',
      menuToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
    );
  });

  // Close menu when a link is clicked
  const navItems = navLinks.querySelectorAll('a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInside = menuToggle.contains(event.target) || navLinks.contains(event.target);
    if (!isClickInside && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Add security attributes to external links
 */
function handleExternalLinks() {
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(link => {
    // Add security and performance attributes to external links
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }

    // Add visual indicator for external links (optional)
    if (!link.classList.contains('no-external-icon')) {
      link.classList.add('external-link');
    }
  });
}

/**
 * Implement smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      const headerOffset = 80; // Adjust based on header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      history.pushState(null, null, targetId);
    });
  });
}

/**
 * Update active navigation based on scroll position
 */
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  // Initial check on page load
  setActiveNavLink();

  // Update on scroll with throttling
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        setActiveNavLink();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  function setActiveNavLink() {
    const scrollPosition = window.scrollY + 100; // Add offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        // Add active class to corresponding link
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });

    // Special case for top of page
    if (scrollPosition < sections[0].offsetTop) {
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
      navLinks[0].classList.add('active');
    }
  }
}

/**
 * Initialize scroll animations
 */
function initAnimations() {
  // Add animation to elements when they enter viewport
  const animatedElements = document.querySelectorAll('.card, .publication-item, .team-card');

  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    animatedElements.forEach(el => {
      el.classList.add('animate-in');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% visible
    rootMargin: '0px 0px -50px 0px' // trigger slightly before entering viewport
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Setup publications section
 * Simulates loading publications from a data source
 */
function setupPublications() {
  const publicationsContainer = document.querySelector('.publications-list');
  if (!publicationsContainer) return;

  // Simon Hirlaender's actual research publications
  const publications = [
    {
      title: "Ultra Fast Reinforcement Learning Demonstrated at CERN AWAKE",
      authors: "Hirlaender, S., Lamminger, L., Zevi Della Porta, G., Kain, V.",
      venue: "IPAC'23 Conference Proceedings, 4459-4462, 2023",
      links: [
        { text: "PDF", url: "https://cds.cern.ch/record/2886522/files/document.pdf" },
        { text: "DOI", url: "https://inspirehep.net/literature/2716660" }
      ]
    },
    {
      title: "Sample-Efficient Reinforcement Learning for CERN Accelerator Control",
      authors: "Kain, V., Hirlander, S., Goddard, B., Velotti, F.M., Della Porta, G.Z., Bruchon, N.",
      venue: "Physical Review Accelerators and Beams, Vol. 23, 2020",
      links: [
        { text: "DOI", url: "https://link.aps.org/doi/10.1103/PhysRevAccelBeams.23.124801" }
      ]
    },
    {
      title: "Model-Free and Bayesian Ensembling Model-Based Deep Reinforcement Learning for Particle Accelerator Control",
      authors: "Hirlander, S., Bruchon, N.",
      venue: "arXiv preprint, 2020",
      links: [
        { text: "arXiv", url: "https://arxiv.org/abs/2012.09737" }
      ]
    },
    {
      title: "Deep Meta Reinforcement Learning for Rapid Adaptation in Linear Markov Decision Processes",
      authors: "Hirländer, S.",
      venue: "Applications to CERN's AWAKE Project, 2022",
      links: [
        { text: "Info", url: "https://uni-salzburg.elsevierpure.com/en/publications/deep-meta-reinforcement-learning-for-rapid-adaptation-in-linear-m" }
      ]
    }
  ];

  // Generate HTML for publications
  let publicationsHTML = '';

  publications.forEach(pub => {
    let linksHTML = '';
    pub.links.forEach(link => {
      linksHTML += `<a href="${link.url}" class="publication-link">${link.text}</a>`;
    });

    publicationsHTML += `
      <div class="publication-item">
        <h3 class="publication-title">${pub.title}</h3>
        <p class="publication-authors">${pub.authors}</p>
        <p class="publication-venue">${pub.venue}</p>
        <div class="publication-links">
          ${linksHTML}
        </div>
      </div>
    `;
  });

  // Replace placeholder content
  publicationsContainer.innerHTML = publicationsHTML;
}

/**
 * Simplified bibliography functionality
 * Will only be initialized if bibliography elements exist on the page
 */
function initBibliography() {
  const bibElements = document.querySelectorAll('.bibliography');
  if (bibElements.length === 0) return;

  // Basic bibliography rendering function
  bibElements.forEach(element => {
    const bibId = element.getAttribute('data-bib-id');
    if (!bibId) return;

    // Show loading state
    element.innerHTML = '<p class="loading">Loading bibliography...</p>';

    // Fetch bibliography data (simplified implementation)
    fetchBibliography(bibId)
      .then(data => {
        element.innerHTML = formatBibliography(data);
      })
      .catch(error => {
        console.error('Failed to load bibliography:', error);
        element.innerHTML = '<p class="error">Bibliography could not be loaded.</p>';
      });
  });
}

/**
 * Track page performance metrics
 */
function trackPerformance() {
  if (!window.performance || !window.performance.getEntriesByType) return;

  // Wait for page to be fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const pageLoadTime = performance.now();
      console.log(`📊 Page fully loaded in ${Math.round(pageLoadTime)}ms`);

      // Performance metrics
      const paintMetrics = performance.getEntriesByType('paint');
      const navigationTiming = performance.getEntriesByType('navigation')[0];

      if (paintMetrics.length) {
        const fpEntry = paintMetrics.find(entry => entry.name === 'first-paint');
        const fcpEntry = paintMetrics.find(entry => entry.name === 'first-contentful-paint');

        if (fpEntry) console.log(`🎨 First Paint: ${Math.round(fpEntry.startTime)}ms`);
        if (fcpEntry) console.log(`🖼️ First Contentful Paint: ${Math.round(fcpEntry.startTime)}ms`);
      }

      if (navigationTiming) {
        console.log(`⚡ DOM Interactive: ${Math.round(navigationTiming.domInteractive)}ms`);
        console.log(`✅ DOM Complete: ${Math.round(navigationTiming.domComplete)}ms`);
      }

      // Resource timing
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(r => r.duration > 500);

      if (slowResources.length > 0) {
        console.warn('⚠️ Slow resources:',
          slowResources.map(r => ({
            name: r.name.split('/').pop(),
            duration: Math.round(r.duration) + 'ms'
          }))
        );
      }
    }, 0);
  });
}

// Run performance tracking
trackPerformance();
