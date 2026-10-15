'use strict'

const headerNav = document.querySelector('.header__nav')
const menuBtn = document.querySelector('.header__menu-btn')
const overlay = document.querySelector('.overlay')

menuBtn.addEventListener('click', function() {
   const isMenuOpen = headerNav.classList.toggle('header__nav--open')
   menuBtn.classList.toggle('header__menu-btn--open', isMenuOpen)
   overlay.classList.toggle('overlay--visible', isMenuOpen)
   menuBtn.setAttribute('aria-expanded', isMenuOpen)
   menuBtn.setAttribute('aria-label', isMenuOpen ? 'Close menu' : 'Open menu')
})

overlay.addEventListener('click', function() {
    menuBtn.click()
})


