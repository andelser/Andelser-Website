/* ==========================================================================
   Andelser Website Logic & Micro-interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initCursorGlowTracker();
  initScrollReveal();
  initCopyToClipboard();
});

/**
 * 1. Navbar Scroll State
 * Adds/removes .scrolled class based on window scroll position
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run on load to capture starting scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 2. Mobile Menu Toggle
 * Opens/closes full screen overlay and locks scrolling
 */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!navToggle || !mobileMenu) return;

  const toggleMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle state attributes
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    
    // Toggle CSS classes
    mobileMenu.classList.toggle('open');
    
    // Prevent background scrolling while open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close menu when a link inside is clicked
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * 3. Cursor Glow Tracker
 * Tracks cursor position relative to cards and updates CSS Custom Properties
 * creating the radial glow backdrop and border highlight.
 */
function initCursorGlowTracker() {
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside element
      const y = e.clientY - rect.top;  // y position inside element

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 4. Scroll Reveal Logic (Intersection Observer)
 * Smoothly fades and reveals elements as they cross into viewport
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (!('IntersectionObserver' in window)) {
    // Graceful fallback for older browsers: show all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -8% 0px', // triggers slightly before elements enter fully
    threshold: 0.1 // 10% visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop tracking after element is revealed for performance and layout stability
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Proactively trigger reveal for items initially in viewport on page load
  const revealHero = document.querySelector('.reveal-content');
  if (revealHero) {
    setTimeout(() => {
      revealHero.style.opacity = '1';
      revealHero.style.transform = 'translateY(0)';
      revealHero.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }, 100);
  }
}

/**
 * 5. Clipboard Copy Logic
 * Copies the business email to clipboard and renders animated feedback
 */
function initCopyToClipboard() {
  const btnCopy = document.getElementById('btnCopyEmail');
  if (!btnCopy) return;

  const emailText = 'contact@andelser.com';
  const defaultLayout = btnCopy.querySelector('.copy-text-default');
  const successLayout = btnCopy.querySelector('.copy-text-success');

  btnCopy.addEventListener('click', () => {
    if (!navigator.clipboard) {
      // Fallback copy model for older environments
      fallbackCopyText(emailText, btnCopy, defaultLayout, successLayout);
      return;
    }

    navigator.clipboard.writeText(emailText)
      .then(() => {
        triggerSuccessFeedback(btnCopy, defaultLayout, successLayout);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  });
}

/**
 * Executes visual feedback animation states
 */
function triggerSuccessFeedback(button, defaultText, successText) {
  // Switch visible elements
  defaultText.style.display = 'none';
  successText.style.display = 'inline-flex';
  button.style.borderColor = 'hsl(140, 75%, 35%)';
  button.style.backgroundColor = 'hsla(140, 75%, 45%, 0.05)';

  // Reset after duration
  setTimeout(() => {
    defaultText.style.display = 'inline-flex';
    successText.style.display = 'none';
    button.style.borderColor = '';
    button.style.backgroundColor = '';
  }, 2000);
}

/**
 * Fallback copy routine using text selection (for browser security sandboxes)
 */
function fallbackCopyText(text, button, defaultText, successText) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Keep off-screen
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.opacity = '0';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      triggerSuccessFeedback(button, defaultText, successText);
    } else {
      alert('Could not copy email automatically. Please highlight and copy manually: ' + text);
    }
  } catch (err) {
    console.error('Fallback copy failure', err);
  }

  document.body.removeChild(textArea);
}
