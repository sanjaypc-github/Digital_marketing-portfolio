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
    let toastTimer;
    const showToast = (message) => {
        if (!message) return;
        let toast = document.querySelector('.toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const mailtoLinks = document.querySelectorAll('[data-mailto]');
    if (mailtoLinks.length) {
        mailtoLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const email = link.dataset.mailto;
                if (!email) return;

                const params = [];
                if (link.dataset.subject) {
                    params.push(`subject=${encodeURIComponent(link.dataset.subject)}`);
                }
                if (link.dataset.body) {
                    params.push(`body=${encodeURIComponent(link.dataset.body)}`);
                }
                const mailtoHref = `mailto:${email}${params.length ? '?' + params.join('&') : ''}`;

                window.location.href = mailtoHref;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(email)
                        .then(() => showToast('Email copied. Paste it into your mail app.'))
                        .catch(() => showToast(`Email: ${email}`));
                } else {
                    showToast(`Email: ${email}`);
                }
            });
        });
    }

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = document.querySelector('.close-modal');
    const workItems = document.querySelectorAll('.work-item');

    // Open Modal
    if (workItems.length > 0 && modal) {
        workItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const img = item.getAttribute('data-img');
                if (img && modalImg) {
                    modalImg.src = img;
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
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
