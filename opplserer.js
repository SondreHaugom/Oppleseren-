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

// Uthev ord under opplesning
document.querySelector(".lese_knapp").addEventListener("click", () => {
    let text = textBox.innerText || textBox.textContent;
    let words = text.split(/\s+/);

// Deler opp teksten i ord og legger til span-elementer for hvert ord
    textBox.innerHTML = words.map(word => `<span>${word}</span>`).join(" ");
    let wordElements = textBox.getElementsByTagName("span");
// Starter opplesningen
    let wordIndex = 0;
    let speech = new SpeechSynthesisUtterance(text);
    speech.voice = voices[parseInt(voiceSelect.value)];

    // merkerer ord som blir lest
    speech.onboundary = (event) => {
        if (event.name === "word") {
            if (wordIndex > 0) {
                wordElements[wordIndex - 1].classList.remove("highlight");
            }
            if (wordIndex < wordElements.length) {
                wordElements[wordIndex].classList.add("highlight");
            }
            wordIndex++;
        }
    };
    // fjerner markeringen når opplesningen er ferdig
    speech.onend = () => {
        wordElements[wordIndex - 1]?.classList.remove("highlight");
    };

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
