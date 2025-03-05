let speech = new SpeechSynthesisUtterance();
let voices = [];

function getVoices() {
    voices = window.speechSynthesis.getVoices();
    
    // Velg en Google- eller Microsoft-stemme hvis tilgjengelig
    speech.voice = voices.find(voice => 
        voice.name.includes("Google") || voice.name.includes("Microsoft") || voice.name.includes("Natural")
    ) || voices[0]; // Hvis ingen finnes, bruk første tilgjengelige
}


// Oppdater listen over stemmer
window.speechSynthesis.onvoiceschanged = getVoices;

// Knytt opplesningen til knappen
document.querySelector(".lese_knapp").addEventListener("click", () => {
    speech.text = document.querySelector(".text_box").value;
    window.speechSynthesis.speak(speech);
}); 

document.querySelector(".stopp_knapp").addEventListener("click", () => {
    window.speechSynthesis.pause();
});

document.querySelector(".fortsett_knapp").addEventListener("click", () => {
    window.speechSynthesis.resume();
});