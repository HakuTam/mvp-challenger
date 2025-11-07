const topFrame = document.getElementById("top");
const middleFrame = document.getElementById("middle");
const bottomFrame = document.getElementById("bottom");
const frames = [topFrame, middleFrame, bottomFrame];
let frameIndex = 0;

const buttons = document.querySelectorAll(".next-frame-button");
buttons.forEach(async (button) => {
  button.addEventListener("click", nextFrame);
});

async function nextFrame() {
  const currentFrame = frames[frameIndex];
  frameIndex = frameIndex == frames.length - 1 ? 0 : frameIndex + 1;
  const nextFrame = frames[frameIndex];
  console.log(`Trocar para frame ${frameIndex}`);

  currentFrame.classList.toggle("frame-animation-out");
  currentFrame.classList.toggle("active-frame");
  setTimeout(() => {
    currentFrame.classList.toggle("frame-animation-out");
    nextFrame.classList.toggle("frame-animation-in");
    nextFrame.classList.toggle("active-frame");
  }, 1000);
  setTimeout(() => nextFrame.classList.toggle("frame-animation-in"), 2000);
}
