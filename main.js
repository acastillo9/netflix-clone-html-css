// open sidebar on click open button
const openSidebarButton = document.getElementById('openSidebarButton')
openSidebarButton.addEventListener('click', () => {
    const mainHeader = document.getElementById('mainHeader')
    mainHeader.classList.toggle('sidebar-nav-open')
})

// close sidebar on click overlay
const sidebarOverlay = document.getElementById('sidebarOverlay')
sidebarOverlay.addEventListener('click', () => {
    const mainHeader = document.getElementById('mainHeader')
    mainHeader.classList.remove('sidebar-nav-open')
})

function mod(n, m) {
    return ((n % m) + m) % m;
}

/**
 * Adds the interactions to a carousel element in the DOM.
 *
 * @param carouselElement - The carousel element.
 * @returns void
 */
function createCarousel(carouselElement, duration = 500) {
    const carouselInner = carouselElement.querySelector('.carousel-inner')
    const carouselItems = carouselElement.querySelectorAll('.carousel-item')
    const itemsArray = Array.from(carouselItems)

    let page = 1
    let itemsPerPage = 0
    let totalPages = 0
    let itemPercentage = 0
    let startIndex = 0
    let endIndex = 0
    let currentPosition = 0

    function resetCarousel() {
        const newCarouselTransition = document.createElement('div')
        newCarouselTransition.classList.add('carousel-items')
        for (let i = 0; i < itemsArray.length; i++) {
            newCarouselTransition.appendChild(itemsArray[i].cloneNode(true))
        }
        const carouselTransition = carouselInner.querySelector('.carousel-items')
        carouselTransition.replaceWith(newCarouselTransition)
    }

    function calculateCarousel() {
        const carouselItems = carouselElement.querySelectorAll('.carousel-item')
        const carouselInnerWidth = carouselInner.clientWidth
        const carouselItemWidth = carouselItems[0].clientWidth
        itemsPerPage = Math.floor(carouselInnerWidth / carouselItemWidth)
        totalPages = Math.ceil(itemsArray.length / itemsPerPage)
        itemPercentage = 100 / itemsPerPage
        startIndex = (page - 2) * itemsPerPage - 1
        endIndex = (page + 1) * itemsPerPage + 1
        currentPosition = -100 - itemPercentage

        const newCarouselTransition = document.createElement('div')
        newCarouselTransition.classList.add('carousel-items')
        newCarouselTransition.style.transform = `translateX(${currentPosition}%)`
        for (let i = startIndex; i < endIndex; i++) {
            const itemIndex = mod(i, itemsArray.length)
            newCarouselTransition.appendChild(itemsArray[itemIndex].cloneNode(true))
        }
        const carouselTransition = carouselInner.querySelector('.carousel-items')
        carouselTransition.replaceWith(newCarouselTransition)
    }

    function next() {
        move()
    }

    function prev() {
        move(-1)
    }

    function move(direction = 1) {
        const carouselTransition = carouselInner.querySelector('.carousel-items')
        carouselTransition.style.transition = `transform ${duration}ms ease-in-out`
        currentPosition = currentPosition - direction * 100
        carouselTransition.style.transform = `translateX(${currentPosition}%)`
        page = page + direction * 1

        setTimeout(() => {
            calculateCarousel()
            changePagination(page)
        }, duration)
    }

    function calculatePagination() {
        const newCarouselPagination = document.createElement('ul')
        newCarouselPagination.classList.add('carousel-pagination')
        for (let index = 1; index <= totalPages; index++) {
            const dot = document.createElement('li')
            if (index === page) {
                dot.classList.add('active')
            }
            newCarouselPagination.appendChild(dot)
        }
        const carouselPagination = carouselElement.querySelector('.carousel-pagination')
        carouselPagination.replaceWith(newCarouselPagination)
    }

    function changePagination(page) {
        const carouselPagination = carouselElement.querySelector('.carousel-pagination')
        const dots = carouselPagination.querySelectorAll('li')
        dots.forEach((dot, index) => dot.classList.toggle('active', index + 1 === (mod(page, totalPages) || totalPages)))
    }

    calculateCarousel()
    calculatePagination()

    // Adds click event listener to the previous and next button
    const prevButton = carouselElement.querySelector('.carousel-button.prev')
    prevButton.addEventListener('click', prev)
    const nextButton = carouselElement.querySelector('.carousel-button.next')
    nextButton.addEventListener('click', next)

    // Adds the resize event listener to fix the carousel position on resize
    window.addEventListener('resize', document.body.clientWidth >= 1024 ? calculateCarousel() : resetCarousel())
}

window.addEventListener('load', function() {
    // Initialize all carousels in the page
    const carousels = document.getElementsByClassName('carousel')
    Array.from(carousels).forEach((carousel) => document.body.clientWidth >= 1024 && createCarousel(carousel))
});
