/**
 * Gressoy - Minimal JavaScript for Core Functionality
 */

(function() {
  "use strict";

  let criticalAlertShown = false;

  function notifyCriticalIssue(message) {
    if (criticalAlertShown) {
      return;
    }

    criticalAlertShown = true;
    window.alert(message);
  }

  window.addEventListener('error', function(event) {
    console.error('Unhandled app error:', event.error || event.message);
    notifyCriticalIssue('Gressoy mengalami gangguan. Silakan muat ulang halaman.');
  });

  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    notifyCriticalIssue('Gressoy mengalami gangguan pada proses latar. Silakan muat ulang halaman.');
  });

  /**
   * Smooth scrolling for anchor links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

})();