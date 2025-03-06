let voices = [];
let voiceSelect = document.querySelector(".voice_select select"); // Velg <select> elementet
let speech = new SpeechSynthesisUtterance();
let textBox = document.querySelector(".text_box"); // Definer textBox her

function getVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = ""; // Tømmer dropdown før vi legger til nye stemmer

    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.textContent = voice.name;
        option.value = i;
        voiceSelect.appendChild(option);
    });

    // Velg en standardstemme
    let defaultVoice = voices.find(voice => voice.name.includes("Microsoft Finn") || voice.name.includes("Microsoft Finn")) || voices[0];
    speech.voice = defaultVoice;
    voiceSelect.value = voices.indexOf(defaultVoice);
}

// Last inn stemmene når siden åpnes
window.speechSynthesis.onvoiceschanged = getVoices;
getVoices(); // Kall denne manuelt for å sikre at stemmer lastes i Chrome

// Endre stemmen når brukeren velger en annen
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[parseInt(voiceSelect.value)];
});

// Knytt opplesningen til knappen
document.querySelector(".lese_knapp").addEventListener("click", () => {
    // Opprett nytt speech objekt for hver ny opplesning
    let speech = new SpeechSynthesisUtterance();
    speech.text = textBox.innerText || textBox.textContent; // Henter teksten fra div
    speech.voice = voices[parseInt(voiceSelect.value)];
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
