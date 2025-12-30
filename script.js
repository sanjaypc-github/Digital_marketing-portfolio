// Main JavaScript file for Sanjay's Portfolio

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Loaded (Restored)');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Interaction Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Booklet Scroll Logic (Vertical -> Horizontal)
    const bookletSection = document.getElementById('booklet');
    const bookletTrack = document.getElementById('bookletTrack');

    // Only run this logic on non-mobile devices where we used the sticky height
    if (bookletSection && bookletTrack && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const sectionRect = bookletSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const viewportHeight = window.innerHeight;

            // The scrollable distance is the section height minus the viewport (sticky duration)
            const scrollDistance = sectionHeight - viewportHeight;

            // If we haven't scrolled into the section yet, or passed it
            if (sectionTop > 0) {
                bookletTrack.style.transform = `translateX(0px)`;
                return;
            }

            // How far we have scrolled into the section (0 to scrollDistance)
            // Since top becomes negative as we scroll down:
            let scrolled = -sectionTop;

            // Normalize progress 0 to 1
            let progress = scrolled / scrollDistance;
            progress = Math.max(0, Math.min(1, progress));

            // Calculate how much to scroll horizontally
            // Maximum horizontal scroll is Track Width - Main Container Width
            const trackWidth = bookletTrack.scrollWidth;
            const containerWidth = window.innerWidth;

            // We want to scroll such that the last item is visible at the end
            // Simplified: trackWidth - containerWidth + buffer
            const maxTranslate = trackWidth - containerWidth + 200;

            if (maxTranslate > 0) {
                const translateX = -(maxTranslate * progress);
                bookletTrack.style.transform = `translateX(${translateX}px)`;
            }
        });
    }

    // Modal Logic
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeModal = document.querySelector('.close-modal');
    const workItems = document.querySelectorAll('.work-item');
    const modalCta = document.querySelector('#imageModal .btn-primary'); // The contact button

    // Open Modal
    if (workItems.length > 0 && modal) {
        workItems.forEach(item => {
            item.style.cursor = 'pointer'; // Make sure they look clickable
            item.addEventListener('click', () => {
                const title = item.getAttribute('data-title');
                const desc = item.getAttribute('data-desc');
                const img = item.getAttribute('data-img');

                if (title && img) {
                    modalTitle.textContent = title;
                    if (modalDesc) modalDesc.textContent = desc || '';
                    if (modalImg) modalImg.src = img;

                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });
    }

    // Close Modal Helper
    function hideModal() {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Special Modal CTA Click (Contact Me)
    if (modalCta) {
        modalCta.addEventListener('click', (e) => {
            hideModal(); // Close modal first
            // Default anchor behavior will take us to #contact if href="#contact"
            const targetId = modalCta.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Small timeout to allow modal fade out
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        });
    }

    // Close Button Event
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (modal && e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });
});
