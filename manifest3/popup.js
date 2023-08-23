const stepInput = document.getElementById('step-input')

main()

stepInput.oninput = async e => {
    await chrome.storage.local.set({step: stepInput.value})
}

async function main() {
    const res = await chrome.storage.local.get('step')
    if (res.step) {
        stepInput.value = res.step
    }
}