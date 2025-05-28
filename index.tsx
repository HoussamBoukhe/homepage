/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav ul li a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(this: HTMLAnchorElement, e: MouseEvent) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector<HTMLElement>(targetId!);
            if (targetElement) {
                const header = document.getElementById('main-header');
                let headerOffset = 0;
                if (header && getComputedStyle(header).position === 'fixed') {
                     headerOffset = header.offsetHeight;
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting on scroll
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const header = document.getElementById('main-header'); // Cache header element
    let headerHeight = header?.offsetHeight || 0;

    // Recalculate header height on resize, especially if it changes from fixed to static
    window.addEventListener('resize', () => {
        if (header && getComputedStyle(header).position === 'fixed') {
            headerHeight = header.offsetHeight;
        } else {
            headerHeight = 0; // If header is not fixed, no offset is needed from it for scroll calculations
        }
    });


    function changeNavActiveState() {
        // Recalculate header height in case it changed (e.g. responsive change)
        if (header && getComputedStyle(header).position === 'fixed') {
            headerHeight = header.offsetHeight;
        } else {
            headerHeight = 0;
        }

        let currentSectionId = '';
        let bottomScroll = window.pageYOffset + window.innerHeight;
        let docHeight = document.documentElement.scrollHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Buffer for activation
            if (window.pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id')!;
            }
        });
        
        // If scrolled to the very bottom of the page, activate the last nav link
        if (bottomScroll >= docHeight - 2) { // Small buffer for precision
            const lastSection = sections[sections.length -1];
            if (lastSection) {
                 currentSectionId = lastSection.getAttribute('id')!;
            }
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial check in case the page loads on a hash
    if (window.location.hash) {
        const initialTarget = document.querySelector<HTMLElement>(window.location.hash);
        if (initialTarget) {
             setTimeout(() => { 
                let currentHeaderOffset = 0;
                if (header && getComputedStyle(header).position === 'fixed') {
                     currentHeaderOffset = header.offsetHeight;
                }
                const elementPosition = initialTarget.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - currentHeaderOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'auto' }); // 'auto' for initial load jump
                changeNavActiveState(); // Update active link after jump
            }, 100);
        }
    } else {
        changeNavActiveState(); // Initial call if no hash
    }


    window.addEventListener('scroll', changeNavActiveState);
    
    // Update footer year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }
});