const stepInput = document.getElementById('step-input');
const smooth = document.getElementById('smooth');

main();

stepInput.oninput = async () => {
  await browser.storage.local.set({ step: parseInt(stepInput.value) });
}

smooth.oninput = async () => {
  await browser.storage.local.set({ smooth: smooth.checked });
}

async function main() {
  const res = await browser.storage.local.get(['step', 'smooth']);

  if (res.step) {
    stepInput.value = res.step;
  }

  if (res.smooth === true) {
    smooth.checked = true;
  }
}