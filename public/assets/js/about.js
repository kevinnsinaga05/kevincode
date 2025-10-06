// About page JavaScript functionality
if (window.AOS) AOS.init({ once: true, duration: 700, offset: 60 });

// Counter Animation for Statistics
function animateCounters() {
	const counters = document.querySelectorAll('.stat-number');
	
	counters.forEach(counter => {
		const target = parseInt(counter.innerText.replace(/,/g, ''));
		const increment = target / 200;
		let current = 0;
		
		const timer = setInterval(() => {
			current += increment;
			if (current >= target) {
				counter.innerText = target.toLocaleString();
				clearInterval(timer);
			} else {
				counter.innerText = Math.floor(current).toLocaleString();
			}
		}, 10);
	});
}

// Intersection Observer for counter animation
const observerOptions = {
	threshold: 0.5,
	rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			animateCounters();
			observer.unobserve(entry.target);
		}
	});
}, observerOptions);

// Start observing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const statsSection = document.querySelector('#statistics');
	if (statsSection) {
		observer.observe(statsSection);
	}
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
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

// Lazy loading for images
if ('IntersectionObserver' in window) {
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.classList.remove('loading-placeholder');
				observer.unobserve(img);
			}
		});
	});

	document.querySelectorAll('img[data-src]').forEach(img => {
		imageObserver.observe(img);
	});
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// Add loading states for better UX
document.addEventListener('DOMContentLoaded', () => {
	// Hide loading spinner if exists
	const loader = document.querySelector('.page-loader');
	if (loader) {
		loader.style.display = 'none';
	}

	// Add fade-in animation to main content
	document.body.style.opacity = '1';
});

// Error handling for failed image loads
document.querySelectorAll('img').forEach(img => {
	img.addEventListener('error', function() {
		this.src = 'assets/img/placeholder.jpg'; // Fallback image
		this.alt = 'Image not available';
	});
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.key === ' ') {
		const activeElement = document.activeElement;
		if (activeElement.classList.contains('accordion-button')) {
			activeElement.click();
		}
	}
});