/**
 * HDF Product Page - JavaScript
 * Contains all interactive functionality:
 * - Sticky header on scroll
 * - Image carousel with zoom preview
 * - Mobile menu toggle
 * - FAQ accordion
 * - Tab switching
 */

document.addEventListener('DOMContentLoaded', function () {

  // ================= STICKY HEADER FUNCTIONALITY =================
  const mainHeader = document.getElementById('mainHeader');
  const stickyHeader = document.getElementById('stickyHeader');
  let lastScrollY = 0;
  let ticking = false;
  let scrollDirection = 'none';
  const SCROLL_THRESHOLD = 500; // Show sticky header after scrolling past first fold

  function updateStickyHeader() {
    const currentScrollY = window.scrollY;

    // Determine scroll direction
    if (currentScrollY > lastScrollY) {
      scrollDirection = 'down';
    } else if (currentScrollY < lastScrollY) {
      scrollDirection = 'up';
    }

    // Show sticky header when:
    // 1. Scrolled past the first fold (threshold)
    // 2. Currently scrolling DOWN
    if (currentScrollY > SCROLL_THRESHOLD && scrollDirection === 'down') {
      stickyHeader.classList.add('visible');
    }
    // Hide sticky header when:
    // 1. Scrolling UP and near the top (within threshold)
    // 2. Or scrolling back up past the fold
    else if (scrollDirection === 'up') {
      // Hide the sticky header when scrolling up
      stickyHeader.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  // ================= MOBILE MENU TOGGLE =================
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }


  // ================= IMAGE CAROUSEL FUNCTIONALITY =================
  const thumbnails = document.querySelectorAll('.thumb');
  const mainImage = document.getElementById('mainImage');
  const zoomImage = document.getElementById('zoomImage');
  const mainImageContainer = document.getElementById('mainImageContainer');
  const zoomPreview = document.getElementById('zoomPreview');

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function () {
        // Update active state
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Get the image source from data attribute or img element
        const newImageSrc = this.dataset.image || this.querySelector('img').src;

        // Update main image
        mainImage.src = newImageSrc;

        // Update zoom preview image
        if (zoomImage) {
          zoomImage.src = newImageSrc;
        }
      });
    });
  }


  // ================= ZOOM PREVIEW ON HOVER =================
  if (mainImageContainer && zoomPreview) {
    mainImageContainer.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate percentage position
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Update zoom image position
      zoomImage.style.left = `-${xPercent * 1}%`;
      zoomImage.style.top = `-${yPercent * 1}%`;

      // Show zoom preview
      zoomPreview.classList.add('show');
    });

    mainImageContainer.addEventListener('mouseleave', function () {
      // Hide zoom preview
      zoomPreview.classList.remove('show');
    });

    // Adjust zoom preview position for mobile
    function adjustZoomPosition() {
      if (window.innerWidth <= 768) {
        zoomPreview.style.left = '50%';
        zoomPreview.style.transform = 'translateX(-50%)';
        zoomPreview.style.top = '100%';
        zoomPreview.style.marginTop = '10px';
      } else {
        zoomPreview.style.left = '105%';
        zoomPreview.style.transform = 'none';
        zoomPreview.style.top = '0';
        zoomPreview.style.marginTop = '0';
      }
    }

    // Initial check
    adjustZoomPosition();

    // Check on resize
    window.addEventListener('resize', adjustZoomPosition);
  }


  // ================= FAQ ACCORDION =================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      // Toggle current item
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });


  // ================= TAB SWITCHING =================
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');
    });
  });


  // ================= SMOOTH SCROLL FOR ANCHOR LINKS =================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href !== '#') {
        e.preventDefault();

        const target = document.querySelector(href);

        if (target) {
          // Calculate offset for fixed header
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });


  // ================= NAVIGATION LINK SCROLL =================
  // Add active state to navigation based on scroll position
  const sections = document.querySelectorAll('section[id]');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.style.color = '#2f4ea2';
        } else {
          navLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation, { passive: true });


  // ================= BUTTON HOVER EFFECTS =================
  const primaryBtns = document.querySelectorAll('.primary-btn');

  primaryBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });


  // ================= WINDOW LOAD COMPLETE =================
  window.addEventListener('load', function () {
    // Remove any loading states if needed
    document.body.classList.add('loaded');
  });


  // ================= MODAL POPUP FUNCTIONALITY WITH FOCUS TRAP =================
  const modal = document.getElementById('datasheetModal');
  const modalClose = document.getElementById('modalClose');
  const downloadBtn = document.querySelector('.download-btn');
  
  // Store the element that triggered the modal
  let lastFocusedElement = null;
  
  // Get all focusable elements within a modal
  function getFocusableElements(modalEl) {
    if (!modalEl) return [];
    return modalEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }
  
  // Focus trap function for modals
  function trapFocus(e, modalEl) {
    const focusableElements = getFocusableElements(modalEl);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      // Shift + Tab (backward)
      if (e.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === modalEl) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
  
  // Open modal with focus management
  function openModal(modalEl, triggerElement) {
    if (!modalEl) return;
    
    // Store the element that triggered the modal
    lastFocusedElement = triggerElement || document.activeElement;
    
    // Show modal
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Move focus to first focusable element in modal
    const focusableElements = getFocusableElements(modalEl);
    if (focusableElements.length > 0) {
      setTimeout(() => {
        focusableElements[0].focus();
      }, 100);
    } else {
      // If no focusable elements, focus the modal itself
      modalEl.focus();
    }
  }
  
  // Close modal with focus restoration
  function closeModal(modalEl) {
    if (!modalEl) return;
    
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to the element that triggered the modal
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  // Open modal when "Download Full Technical Datasheet" button is clicked
  if (downloadBtn && modal) {
    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(modal, downloadBtn);
    });
  }

  // Close modal when X close button is clicked
  if (modalClose && modal) {
    modalClose.addEventListener('click', function () {
      closeModal(modal);
    });
  }

  // Close modal when clicking on the overlay
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  }

  // Add focus trap and Escape handling for datasheetModal
  if (modal) {
    modal.addEventListener('keydown', function (e) {
      // Handle Tab for focus trap
      trapFocus(e, modal);
      
      // Handle Escape to close modal
      if (e.key === 'Escape') {
        closeModal(modal);
      }
    });
  }

  // Handle Escape key for all active modals (including quoteModal)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const datasheetModal = document.getElementById('datasheetModal');
      const quoteModal = document.getElementById('quoteModal');
      
      if (datasheetModal && datasheetModal.classList.contains('active')) {
        closeModal(datasheetModal);
      }
      if (quoteModal && quoteModal.classList.contains('active')) {
        closeModal(quoteModal);
      }
    }
  });



  // ================= AUTO-MOVING CAROUSELS =================

  // Hero Gallery Auto-rotate
  let heroCurrentIndex = 0;
  const heroImages = [
    'images/A_Person_Helmet.jpg',
    'images/Two_People.jpg',
    'images/Working.jpg',
    'images/Home Solar.png'
  ];
  const heroThumbnails = document.querySelectorAll('.hero-gallery .thumb');
  const heroMainImage = document.getElementById('mainImage');
  const heroZoomImage = document.getElementById('zoomImage');

  function updateHeroCarousel(index) {
    // Update main image
    if (heroMainImage) {
      heroMainImage.src = heroImages[index];
    }
    if (heroZoomImage) {
      heroZoomImage.src = heroImages[index];
    }

    // Update thumbnail active state
    heroThumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  function nextHeroSlide() {
    heroCurrentIndex = (heroCurrentIndex + 1) % heroImages.length;
    updateHeroCarousel(heroCurrentIndex);
  }

  // Auto-rotate hero carousel every 3 seconds
  setInterval(nextHeroSlide, 3000);

  // Add click handlers for hero navigation buttons
  const heroPrevBtn = document.querySelector('.hero-gallery .prev-btn');
  const heroNextBtn = document.querySelector('.hero-gallery .next-btn');

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', function () {
      heroCurrentIndex = (heroCurrentIndex - 1 + heroImages.length) % heroImages.length;
      updateHeroCarousel(heroCurrentIndex);
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', function () {
      nextHeroSlide();
    });
  }


  // ================= APPLICATIONS SECTION SLIDER =================
  const appSlider = document.querySelector('.app-slider');
  const appCards = document.querySelectorAll('.app-card');
  let appCurrentIndex = 0;
  let appSliderInterval;

  function moveAppSlider(direction) {
    if (!appSlider || appCards.length === 0) return;

    const visibleCards = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 4);
    const maxIndex = Math.max(0, appCards.length - visibleCards);

    if (direction === 'next') {
      // Loop back to start when at end
      appCurrentIndex = appCurrentIndex >= maxIndex ? 0 : appCurrentIndex + 1;
    } else if (direction === 'prev') {
      // Loop to end when at start
      appCurrentIndex = appCurrentIndex <= 0 ? maxIndex : appCurrentIndex - 1;
    }

    // Calculate card width dynamically
    const cardWidth = appCards[0].offsetWidth + 24; // Include gap
    appSlider.style.transform = `translateX(-${appCurrentIndex * cardWidth}px)`;
  }

  function startAppSlider() {
    appSliderInterval = setInterval(() => moveAppSlider('next'), 4000);
  }

  function resetAppSliderInterval() {
    clearInterval(appSliderInterval);
    startAppSlider();
  }

  // Start auto-rotate app slider
  if (appSlider && appCards.length > 0) {
    startAppSlider();
  }

  // Add click handlers for app slider navigation
  const appPrevBtn = document.querySelector('.app-nav .prev');
  const appNextBtn = document.querySelector('.app-nav .next');

  if (appPrevBtn) {
    appPrevBtn.addEventListener('click', function () {
      moveAppSlider('prev');
      resetAppSliderInterval();
    });
  }

  if (appNextBtn) {
    appNextBtn.addEventListener('click', function () {
      moveAppSlider('next');
      resetAppSliderInterval();
    });
  }


  // ================= PROCESS SECTION CAROUSEL (Advanced HDPE Pipe Manufacturing) =================
  const processImages = [
    'images/Working.jpg',
    'images/A_Person_Helmet.jpg',
    'images/Two_People.jpg'
  ];
  let processCurrentIndex = 0;
  let processInterval;
  const processImageElement = document.querySelector('.process-image-wrap img');
  const processPrevBtn = document.querySelector('.process-image-wrap .img-arrow.prev');
  const processNextBtn = document.querySelector('.process-image-wrap .img-arrow.next');

  function updateProcessCarousel(index) {
    if (processImageElement) {
      processImageElement.src = processImages[index];
    }
  }

  function nextProcessSlide() {
    processCurrentIndex = (processCurrentIndex + 1) % processImages.length;
    updateProcessCarousel(processCurrentIndex);
  }

  function startProcessCarousel() {
    processInterval = setInterval(nextProcessSlide, 5000);
  }

  function resetProcessInterval() {
    clearInterval(processInterval);
    startProcessCarousel();
  }

  // Start auto-rotate process carousel
  if (processImageElement) {
    startProcessCarousel();
  }

  if (processPrevBtn) {
    processPrevBtn.addEventListener('click', function () {
      processCurrentIndex = (processCurrentIndex - 1 + processImages.length) % processImages.length;
      updateProcessCarousel(processCurrentIndex);
      resetProcessInterval();
    });
  }

  if (processNextBtn) {
    processNextBtn.addEventListener('click', function () {
      nextProcessSlide();
      resetProcessInterval();
    });
  }


  // ================= TESTIMONIALS CAROUSEL (Trusted Performance. Proven Results) =================
  const testimonialSection = document.querySelector('.testimonial-section');
  const testimonialGrid = document.querySelector('.testimonial-grid');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let testimonialCurrentIndex = 0;
  let testimonialInterval;

  // Create testimonial carousel structure if it doesn't exist
  function setupTestimonialCarousel() {
    if (!testimonialGrid || testimonialCards.length === 0) return;

    // Replace the grid with the carousel structure
    if (!testimonialGrid.parentElement.classList.contains('testimonial-carousel-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'testimonial-carousel-wrapper';
      wrapper.innerHTML = `
        <div class="testimonial-carousel" style="display: flex; transition: transform 0.5s ease;">
          ${testimonialGrid.innerHTML}
        </div>
      `;

      const nav = document.createElement('div');
      nav.className = 'testimonial-nav';
      nav.innerHTML = `
        <button class="testimonial-prev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="testimonial-next"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
      `;

      testimonialGrid.parentNode.replaceChild(wrapper, testimonialGrid);
      wrapper.parentNode.insertBefore(nav, wrapper.nextSibling);

      // Add navigation styles
      const navStyle = document.createElement('style');
      navStyle.textContent = `
        .testimonial-carousel-wrapper {
          overflow: hidden;
        }
        .testimonial-carousel {
          display: flex;
          gap: 24px;
          width: 100%;
        }
        .testimonial-carousel .testimonial-card {
          min-width: calc(25% - 18px); /* Adjusting for gap */
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .testimonial-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 30px;
        }
        .testimonial-nav button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #eaeaea;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #333;
        }
        .testimonial-nav button:hover {
          border-color: #2f4ea2;
          color: #2f4ea2;
        }
        @media (max-width: 1024px) {
          .testimonial-carousel .testimonial-card {
            min-width: calc(50% - 12px);
          }
        }
        @media (max-width: 768px) {
          .testimonial-carousel .testimonial-card {
            min-width: 100%;
          }
        }
      `;
      document.head.appendChild(navStyle);
    }

    // IMPORTANT: Attach event listeners AFTER DOM is updated
    const prevBtn = testimonialSection.querySelector('.testimonial-prev');
    const nextBtn = testimonialSection.querySelector('.testimonial-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        moveTestimonial('prev');
        resetTestimonialInterval();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        moveTestimonial('next');
        resetTestimonialInterval();
      });
    }
  }

  function moveTestimonial(direction) {
    const carousel = document.querySelector('.testimonial-carousel');
    const cards = document.querySelectorAll('.testimonial-carousel .testimonial-card');
    if (!carousel || cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 24; // Include gap (synced with index.html)
    const visibleCards = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 4); // 4 on desktop

    // If we have 4 or fewer cards and visible is 4, don't move
    if (cards.length <= visibleCards) {
      carousel.style.transform = 'translateX(0)';
      return;
    }

    const maxIndex = Math.max(0, cards.length - visibleCards);

    if (direction === 'next') {
      // Loop back to start
      testimonialCurrentIndex = testimonialCurrentIndex >= maxIndex ? 0 : testimonialCurrentIndex + 1;
    } else if (direction === 'prev') {
      // Loop to end
      testimonialCurrentIndex = testimonialCurrentIndex <= 0 ? maxIndex : testimonialCurrentIndex - 1;
    }

    carousel.style.transform = `translateX(-${testimonialCurrentIndex * cardWidth}px)`;
  }

  function startTestimonialCarousel() {
    testimonialInterval = setInterval(() => moveTestimonial('next'), 5000);
  }

  function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    startTestimonialCarousel();
  }

  // Initialize testimonial carousel
  if (testimonialSection && testimonialCards.length > 0) {
    setupTestimonialCarousel(); // listeners are now attached inside this function
    startTestimonialCarousel();
  }


  // ================= REQUEST A QUOTE MODAL FUNCTIONALITY WITH FOCUS TRAP =================
  const quoteModal = document.getElementById('quoteModal');
  const quoteModalClose = document.getElementById('quoteModalClose');
  const quoteModalSubmit = document.getElementById('quoteModalSubmit');

  // Get all buttons that should open the quote modal
  document.querySelectorAll('.primary-btn, button').forEach(btn => {
    // Skip buttons already inside any modal or that are the download/submit buttons
    if (btn.closest('.modal-overlay')) return;

    btn.addEventListener('click', function (e) {
      const buttonText = btn.textContent.trim().toLowerCase();
      if (buttonText.includes('quote') || buttonText.includes('custom quote') || buttonText.includes('talk to an expert') || buttonText.includes('request catalogue')) {
        e.preventDefault();
        if (quoteModal) {
          openModal(quoteModal, btn);
        }
      }
    });
  });

  // Close quote modal
  if (quoteModalClose) {
    quoteModalClose.addEventListener('click', () => closeModal(quoteModal));
  }

  if (quoteModalSubmit) {
    quoteModalSubmit.addEventListener('click', function () {
      const name = document.getElementById('quoteName')?.value?.trim();
      const email = document.getElementById('quoteEmail')?.value?.trim();

      if (name && email) {
        alert('Thank you! We will call you back shortly.');
        closeModal(quoteModal);
      } else {
        alert('Please fill in your name and email address.');
      }
    });
  }

  // Close modal when clicking on the dark overlay
  if (quoteModal) {
    quoteModal.addEventListener('click', function (e) {
      if (e.target === quoteModal) closeModal(quoteModal);
    });
    
    // Add focus trap and Escape handling for quoteModal
    quoteModal.addEventListener('keydown', function (e) {
      // Handle Tab for focus trap
      trapFocus(e, quoteModal);
      
      // Handle Escape to close modal
      if (e.key === 'Escape') {
        closeModal(quoteModal);
      }
    });
  }

  // ================= CATALOGUE MODAL (datasheetModal) DOWNLOAD BUTTON =================
  const catalogueModal = document.getElementById('datasheetModal');
  if (catalogueModal) {
    catalogueModal.addEventListener('click', function (e) {
      if (e.target === catalogueModal) closeModal(catalogueModal);
    });
  }
  // Download Brochure button already handled by existing datasheetModal logic above
  const catalogueDownload = document.getElementById('modalDownload');
  if (catalogueDownload) {
    catalogueDownload.addEventListener('click', function () {
      const emailVal = document.getElementById('modalEmail')?.value?.trim();
      if (emailVal) {
        alert('Thank you! We will email the catalogue to ' + emailVal);
        closeModal(catalogueModal);
      } else {
        alert('Please enter your email address.');
      }
    });
  }

});


