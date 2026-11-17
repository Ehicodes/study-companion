'use strict'

const dashboardTitle = document.querySelector('.dashboard__title')

const getGreeting = function() {
    const hours = new Date().getHours()

    if(hours < 12) return 'Good morning'

    if(hours < 18) return 'Good afternoon'

    return 'Good evening'
}

let userName = load('name', null)

if(userName === null) {
    const answer = prompt('Welcome🙂! What should we call you?')

    if(answer && answer.trim() !== ''){
        userName = answer.trim()
        save('name', userName)
    }
}

dashboardTitle.textContent = userName? `${getGreeting()}, ${userName}` : getGreeting()
dashboardTitle.classList.add('dashboard__tite--effect')
