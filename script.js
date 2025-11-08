const topFrame = document.getElementById("top");
const middleFrame = document.getElementById("middle");
const bottomFrame = document.getElementById("bottom");
const frames = [topFrame, middleFrame, bottomFrame];
let frameIndex = 0;

const downloadBtn = document.getElementById("download-button");

const buttons = document.querySelectorAll(".next-frame-button");
buttons.forEach(async (button) => {
  button.addEventListener("click", nextFrame);
});

const chatbotOutput = document.getElementById("chatbot");
const botMessages = [
  "Confirmando o recebimento do arquivo...",
  "Detectando a linguagem utilizada.",
  "Codigo indentificado como Assembly x8086, preparando LLM para tradução.",
  "Linguagem alvo para transpilação: JavaScript, inicializando...",
  "Finalizando o arquivo morse-code.js, abrindo endpoint para busca do arquivo.",
  "Frontend: enviando requisição para a API REST requisitando o arquivo",
  "Arquivo recebido para download, confirmando integridade.",
  "Tudo pronto! clique em 'baixar' para começar o download de morse-code.js",
];

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
  setTimeout(() => {
    nextFrame.classList.toggle("frame-animation-in");
    if (frameIndex == 2) {
      typeTextArray(chatbotOutput, botMessages);
      setTimeout(() => {
        downloadBtn.classList.toggle("disable");
      }, 31500);
    }
    typeTextArray();
  }, 2000);
}

// Aqui usei IA mesmo.. falta mt pouco tempo!
async function typeTextArray(element, textArray) {
  const charDelay = 50; // Delay in milliseconds between characters
  const arrayPause = 1000; // Pause in milliseconds between strings (1 second)
  const lineBreakCount = 2; // Number of <br> elements to insert between strings

  // Helper function to create a delay using a Promise
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Clear the element's content before starting
  element.innerHTML = ""; // Use innerHTML for clearing and appending

  for (let i = 0; i < textArray.length; i++) {
    const currentString = textArray[i];

    // Type the current string character by character
    for (const char of currentString) {
      // FIX: Use element.innerHTML += char to ensure subsequent HTML elements (like <br>) are recognized.
      element.innerHTML += char;
      await delay(charDelay);
    }

    // Pause and insert line breaks between array elements (except after the last one)
    if (i < textArray.length - 1) {
      // Insert line breaks using the appropriate HTML tag
      for (let j = 0; j < lineBreakCount; j++) {
        element.appendChild(document.createElement("br"));
      }

      // Wait for the full 1-second pause
      await delay(arrayPause);
    }
  }
}

document
  .getElementById("download-button")
  .addEventListener("click", downloadGeneratedFile);

/**
 * Generates text content and forces the browser to download it locally.
 */
function downloadGeneratedFile() {
  // 1. Define the content and metadata for the file.
  const filename = "morse-code.js";
  const fileContent = `
  var globalAudioContext = new webkitAudioContext();

  function morsecode(text, unit, freq) {
	'use strict';

	// defaults
	unit = unit ? unit : 0.05;
	freq = freq ? freq : 700;
	var cont = globalAudioContext;
	var time = cont.currentTime;

	// morsecode
	var code = {
		a: '._',    b: '_...',  c: '_._.',  d: '_..',   e: '.',     f: '.._.',
		g: '__.',   h: '....',  i: '..',    j: '.___',  k: '_._',   l: '._..',
		m: '__',    n: '_.',    o: '___',   p: '.__.',  q: '__._',  r: '._.',
		s: '...',   t: '_',     u: '.._',   v: '..._',  w: '.__',   x: '_.._',
		y: '_.__',  z: '__..',  0: '_____', 1: '.____', 2: '..___', 3: '...__',
		4: '...._', 5: '.....', 6: '_....', 7: '__...', 8: '___..', 9: '____.'
	};

	// generate code for text
	function makecode(data) {
		for (var i = 0; i <= data.length; i ++) {
			var codedata = data.substr(i, 1).toLowerCase();
			codedata = code[codedata];
			// recognised character
			if (codedata !== undefined) {
				maketime(codedata);
			}
			// unrecognised character
			else {
				time += unit * 7;
			}
		}
	}

	// generate time for code
	function maketime(data) {
		for (var i = 0; i <= data.length; i ++) {
			var timedata = data.substr(i, 1);
			timedata = (timedata === '.') ? 1 : (timedata === '_') ? 3 : 0;
			timedata *= unit;
			if (timedata > 0) {
				maketone(timedata);
				time += timedata;
				// tone gap
				time += unit * 1;
			}
		}
		// char gap
		time += unit * 2;
	}

	// generate tone for time
	function maketone(data) {
		var start = time;
		var stop = time + data;
		// filter: envelope the tone slightly
		gain.gain.linearRampToValueAtTime(0, start);
		gain.gain.linearRampToValueAtTime(1, start + (unit / 8));
		gain.gain.linearRampToValueAtTime(1, stop - (unit / 16));
		gain.gain.linearRampToValueAtTime(0, stop);
	}

	// create: oscillator, gain, destination
	var osci = cont.createOscillator();
	osci.frequency.value = freq;
	var gain = cont.createGainNode();
	gain.gain.value = 0;
	var dest = cont.destination;
	// connect: oscillator -> gain -> destination
	osci.connect(gain);
	gain.connect(dest);
	// start oscillator
	osci.start(time);

	// begin encoding: text -> code -> time -> tone
	makecode(text);

	// return web audio context for reuse / control
	return cont;
        }
        `;

  // The MIME type tells the browser what kind of data the blob contains (plain text in this case).
  const mimeType = "text/plain";

  // 2. Create a Blob (Binary Large Object) from the content.
  // The content is passed as an array of parts.
  const blob = new Blob([fileContent], { type: mimeType });

  // 3. Create a temporary URL for the Blob.
  // This URL lives only in the current browser session.
  const url = URL.createObjectURL(blob);

  // 4. Create a temporary anchor (<a>) element to trigger the download.
  const a = document.createElement("a");

  // Set the download attribute with the desired filename. This is what forces the download behavior.
  a.download = filename;

  // Set the href to the temporary Blob URL.
  a.href = url;

  // 5. Programmatically click the anchor element to trigger the download dialog.
  a.click();

  // 6. Clean up: Revoke the temporary URL to free up browser memory.
  URL.revokeObjectURL(url);

  // Update status message
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = `Successfully prepared and triggered download for "${filename}". Check your downloads folder!`;
  statusMessage.classList.remove("hidden");
}
