function hamburgerMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelector('.mobile-links');
    const ul = document.querySelector(' .nav-links>ul ');
    const menuLinks = ul.cloneNode(true);

    
    mobileMenu.addEventListener('click', () => {
        mobileLinks.appendChild(menuLinks);
        mobileMenu.classList.toggle('mobile-menu_open');
    });
}
hamburgerMenu();