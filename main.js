document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false, // Allow animations to replay on scroll
      mirror: false
    });
  } else {
    console.warn('AOS library not loaded');
  }

  // Initialize code highlighting
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } else {
    console.warn('Highlight.js library not loaded');
  }

  // Handle navbar transparency on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        navbar.classList.add('bg-blue-900', 'shadow-md');
      } else {
        navbar.classList.remove('bg-blue-900', 'shadow-md');
      }
    });
  }

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      const isExpanded = !mobileMenu.classList.toggle('hidden');
      mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });
  }

  // FAQ accordion functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');
    const answerId = answer?.id;

    if (answer && answerId) {
      question.addEventListener('click', function() {
        const isActive = this.classList.toggle('active');
        this.setAttribute('aria-expanded', isActive);

        if (answer.style.maxHeight) {
          answer.style.maxHeight = null;
          icon?.classList.remove('rotate-180');
        } else {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon?.classList.add('rotate-180');
        }
      });
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar?.offsetHeight || 0;
        window.scrollTo({
          top: targetElement.offsetTop - navbarHeight - 20,
          behavior: 'smooth'
        });

        if (mobileMenu && mobileMenuButton) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Documentation navigation highlighting
  const docNavItems = document.querySelectorAll('.doc-nav-item');
  const docSections = document.querySelectorAll('.documentation-section');

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function highlightCurrentSection() {
    if (docSections.length === 0) return;

    let currentSectionId = docSections[0].id;
    docSections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.id;
      }
    });

    docNavItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href')?.slice(1);
      if (href && href === currentSectionId) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', debounce(highlightCurrentSection, 100));
  highlightCurrentSection();

  // Recalculate FAQ answer heights on resize
  window.addEventListener('resize', () => {
    faqQuestions.forEach(question => {
      const answer = question.nextElementSibling;
      if (answer?.style.maxHeight) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});