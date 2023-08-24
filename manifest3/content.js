const se = document.scrollingElement

let step = 100
let negativeStep = -step
let scrollable = se
let smooth = false
let scrollBehavior = 'instant'

main()

document.addEventListener('mouseover', e => {
    if (e.shiftKey === true) return
    scrollable = getScrollable(e.target)
})

document.addEventListener('wheel', e => {
    if (e.shiftKey === false) return
    e.preventDefault()
    const target = e.ctrlKey === true ? se : scrollable

    if (e.deltaY > 0) {
        target.scrollBy({ left: step, behavior: scrollBehavior })
    } else {
        target.scrollBy({ left: negativeStep, behavior: scrollBehavior })
    }

}, { passive: false })

async function main() {
    const res = await chrome.storage.local.get(['step', 'smooth'])

    if (res.step) {
        step = res.step
        negativeStep = -step
    }

    if (res.smooth) {
        smooth = res.smooth
        setScrollBehavior()
    }
    
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.step) {
            step = changes.step.newValue
            negativeStep = -step
        }
        
        if (changes.smooth) {
            smooth = changes.smooth.newValue
            setScrollBehavior()
        }
    })
}

function getScrollable(el) {
    if (el === se) return se

    try {
        const overflowX = window.getComputedStyle(el).getPropertyValue('overflow-x')

        return (overflowX !== 'visible' && overflowX !== 'clip') && (el.scrollWidth > el.clientWidth)
            ? el
            : getScrollable(el.parentElement)

    } catch (e) {
        console.error(e)
        return se
    }
}

function setScrollBehavior() {
    scrollBehavior = smooth === true ? 'smooth' : 'instant'
}