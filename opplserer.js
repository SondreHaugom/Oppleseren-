// Funksjonalitet for opplesning av tekst
// Bruker Web Speech API for å opplese tekst
// Bruker SpeechSynthesisUtterance for å opplese tekst
// Bruker SpeechSynthesisVoice for å velge stemme
// Bruker SpeechSynthesis for å styre opplesningen
let voices = [];
let voiceSelect = document.querySelector(".voice_select select");
let textBox = document.querySelector(".text_box");
let speech = new SpeechSynthesisUtterance();

// Hent stemmene som er tilgjengelige
function getVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    // Legg til stemmene i dropdown-menyen
    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.textContent = voice.name;
        option.value = i;
        voiceSelect.appendChild(option);
    });
    // Velger en standard stemme
    let defaultVoice = voices.find(voice => voice.name.includes("Microsoft Finn")) || voices[0];
    speech.voice = defaultVoice;
    voiceSelect.value = voices.indexOf(defaultVoice);
}

// Last inn stemmene når siden åpnes
window.speechSynthesis.onvoiceschanged = getVoices;
getVoices();

// Endre stemmen når brukeren velger en annen
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[parseInt(voiceSelect.value)];
});

// Start opplesningen
document.querySelector(".lese_knapp").addEventListener("click", () => {
    let textNodes = [];
    
// Hent tekstnodene i tekstboksen
    function getTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            node.childNodes.forEach(getTextNodes);
        }
    }
 // Del opp teksten i ord   
    let textBox = document.querySelector(".text_box");
    getTextNodes(textBox);
 // Lag span-elementer for hvert ord   
    textNodes.forEach(node => {
        let words = node.textContent.split(/\s+/);
        let fragment = document.createDocumentFragment();
// Hvis ordet er tomt, hopp over       
        words.forEach((word, i) => {
            if (word.trim() === "") return;
            let span = document.createElement("span");
            span.textContent = word + " ";
            span.classList.add("word");
            fragment.appendChild(span);
        });
// Erstatt tekstnoden med span-elementene
        node.replaceWith(fragment);
    });
// Start opplesningen på nytt vis brukeren stopper opplesningen helt
    let wordElements = textBox.querySelectorAll(".word");
    let wordIndex = 0;
    let speech = new SpeechSynthesisUtterance(textBox.innerText);
    speech.voice = voices[parseInt(voiceSelect.value)];
// Marker ordet som leses opp
    speech.onboundary = (event) => {
        if (wordIndex > 0) wordElements[wordIndex - 1].classList.remove("highlight");
        if (wordIndex < wordElements.length) wordElements[wordIndex].classList.add("highlight");
        wordIndex++;
    };
// Fjern markeringen når opplesningen er ferdig
    speech.onend = () => {
        wordElements.forEach(el => el.classList.remove("highlight"));
    };
// Start opplesningen
    window.speechSynthesis.speak(speech);
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