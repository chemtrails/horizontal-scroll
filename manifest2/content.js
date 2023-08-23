const se = document.scrollingElement

let step = 100
let negativeStep = -100
let scrollable = se

main()

document.addEventListener('mouseover', e => {
    if (e.shiftKey !== false) return
    scrollable = getScrollable(e.target)
})

document.addEventListener('wheel', e => {
    if (e.shiftKey !== true) return
    e.preventDefault()
    
    if (e.deltaY > 0) {
        scrollable.scrollBy({ left: step, behavior: 'instant' })
    } else {
        scrollable.scrollBy({ left: negativeStep, behavior: 'instant' })
    }
}, { passive: false })

async function main() {
    const res = await browser.storage.local.get('step')

    if (res.step) {
        step = parseInt(res.step)
        negativeStep = -1 * step
    }

    browser.storage.onChanged.addListener((changes) => {
        if (changes.step) {
            step = changes.step.newValue
            negativeStep = -1 * step
        }
    })
}

function getScrollable(el) {
    if (el === se) return se
    const overflowX = window.getComputedStyle(el).getPropertyValue('overflow-x')

    return (overflowX !== 'visible' && overflowX !== 'clip') && (el.scrollWidth > el.offsetWidth)
        ? el
        : getScrollable(el.parentElement)
}