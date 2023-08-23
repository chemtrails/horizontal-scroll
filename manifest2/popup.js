const stepInput = document.getElementById('step-input')

main()

stepInput.oninput = async e => {
    await browser.storage.local.set({step: stepInput.value})
}

async function main() {
    const res = await browser.storage.local.get('step')
    if (res.step) {
        stepInput.value = res.step
    }
}