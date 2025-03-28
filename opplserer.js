// Funksjonalitet for opplesning av tekst
let voices = [];
let voiceSelect = document.querySelector(".voice_select select");
let textBox = document.querySelector(".text_box");

// Hent stemmene som er tilgjengelige
function getVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.textContent = voice.name;
        option.value = i;
        voiceSelect.appendChild(option);
    });

    let defaultVoice = voices.find(voice => voice.name.includes("Microsoft Finn")) || voices[0];
    voiceSelect.value = voices.indexOf(defaultVoice);
}

window.speechSynthesis.onvoiceschanged = getVoices;
getVoices();

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[parseInt(voiceSelect.value)];
});

// Del teksten i mindre biter
function splitTextIntoChunks(text, chunkSize = 50) {
    let words = text.split(/\s+/);
    let chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
    }
    return chunks;
}

// Les opp én bit om gangen
function readChunks(chunks, wordElements) {
    let currentChunkIndex = 0;
    let globalWordIndex = 0; // Global indeks for hele teksten

    function readNextChunk() {
        if (currentChunkIndex >= chunks.length) {
            wordElements.forEach(el => el.classList.remove("highlight")); // Fjern markering
            return;
        }

        let chunk = chunks[currentChunkIndex];
        let speech = new SpeechSynthesisUtterance(chunk);
        speech.voice = voices[parseInt(voiceSelect.value)];
        let localWordIndex = 0; // Indeks for ordene i denne biten

        speech.onboundary = (event) => {
            if (globalWordIndex > 0) {
                wordElements[globalWordIndex - 1].classList.remove("highlight");
            }
            if (globalWordIndex < wordElements.length) {
                wordElements[globalWordIndex].classList.add("highlight");
            }
            localWordIndex++;
            globalWordIndex++; // Oppdater global indeks
        };

        speech.onend = () => {
            currentChunkIndex++;
            readNextChunk(); // Les neste bit
        };

        window.speechSynthesis.speak(speech);
    }

    readNextChunk();
}

// Start opplesningen
document.querySelector(".lese_knapp").addEventListener("click", () => {
    let text = textBox.innerText;
    let chunks = splitTextIntoChunks(text, 50);

    let textNodes = [];
    function getTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            node.childNodes.forEach(getTextNodes);
        }
    }
    getTextNodes(textBox);

    textNodes.forEach(node => {
        let words = node.textContent.split(/\s+/);
        let fragment = document.createDocumentFragment();

        words.forEach((word) => {
            if (word.trim() === "") return;
            let span = document.createElement("span");
            span.textContent = word + " ";
            span.classList.add("word");
            fragment.appendChild(span);
        });

        node.replaceWith(fragment);
    });

    let wordElements = textBox.querySelectorAll(".word");
    readChunks(chunks, wordElements);
});

// Pause opplesningen
document.querySelector(".pause_knapp").addEventListener("click", () => {
    window.speechSynthesis.pause();
});

// Fortsett opplesningen
document.querySelector(".fortsett_knapp").addEventListener("click", () => {
    window.speechSynthesis.resume();
});

// Stopp opplesningen
document.querySelector(".stopp_knapp").addEventListener("click", () => {
    window.speechSynthesis.cancel();
});