'use strict'

const nav = document.querySelector('.header__nav')
const menuBtn = document.querySelector('.header__menu-btn')


menuBtn.addEventListener('click', function() {
  const isOpen = nav.classList.toggle('header__nav--open')
  menuBtn.classList.toggle('header__menu-btn--open', isOpen)
   console.log(isOpen)
  menuBtn.setAttribute('aria-expanded', isOpen)
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
})

console.log(menuBtn)

