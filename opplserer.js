// Funksjonalitet for opplesning av tekst
let voices = [];
let voiceSelect = document.querySelector(".voice_select select");
let textBox = document.querySelector(".text_box");

// Hent stemmene som er tilgjengelige
function getVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";
    // Legg til stemmer i nedtrekkslisten
    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.textContent = voice.name;
        option.value = i;
        voiceSelect.appendChild(option);
    });
    // Sett standard stemme til Microsoft Finn eller første tilgjengelige stemme
    let defaultVoice = voices.find(voice => voice.name.includes("Microsoft Finn")) || voices[0];
    voiceSelect.value = voices.indexOf(defaultVoice);
}
// Hent stemmer når de er tilgjengelige (for nettlesere som laster dem asynkront)
window.speechSynthesis.onvoiceschanged = getVoices;
getVoices();
// Hent stemmer når siden lastes inn (for nettlesere som laster dem synkront)
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[parseInt(voiceSelect.value)];
});

// Del teksten i mindre biter
function splitTextIntoChunks(text, chunkSize = 50) {
    // Del teksten i ord og grupper dem i biter av chunkSize ord hver
    let words = text.split(/\s+/);
    let chunks = [];
    // Hvis teksten er kortere enn chunkSize, returner hele teksten som en bit
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
    }
    return chunks;
}
// Les teksten i biter og marker ord under opplesning
function readChunks(chunks, wordElements) {
    // Fjern eksisterende markeringer
    let currentChunkIndex = 0;
    let globalWordIndex = 0; // Global indeks for hele teksten
//    wordElements.forEach(el => el.classList.remove("highlight")); // Fjern markering
    function readNextChunk() {
        // Hvis det ikke er flere biter, stopp opplesningen
        if (currentChunkIndex >= chunks.length) {
            wordElements.forEach(el => el.classList.remove("highlight")); // Fjern markering
            return;
        }
        // Hvis det er flere biter, les neste bit
        let chunk = chunks[currentChunkIndex];
        // Lag en ny SpeechSynthesisUtterance for hver bit
        let speech = new SpeechSynthesisUtterance(chunk);
        speech.voice = voices[parseInt(voiceSelect.value)];

        speech.rate = parseFloat(document.getElementById("speed_slider").value); // Bruk sliderens verdi som hastighet

        speech.onboundary = (event) => {
            if (globalWordIndex > 0) {
                wordElements[globalWordIndex - 1].classList.remove("highlight");
            }
            if (globalWordIndex < wordElements.length) {
                wordElements[globalWordIndex].classList.add("highlight");
            }
            globalWordIndex++;
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
    // legger til en variabel for å sjekke om opplesningen er i gang
    let text = textBox.innerText;
    // splitter teksten i biter av 50 ord
    let chunks = splitTextIntoChunks(text, 50);
    // en array for å lagre tekstnoder
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