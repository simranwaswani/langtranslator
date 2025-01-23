const countries = {
    "en-GB": "English",
    "hi-IN": "Hindi",
    "es-ES": "Spanish",
    "fr-FR": "French",
    "de-DE": "German"
};

const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchangeIcon = document.querySelector(".exchange"),
      selectTags = document.querySelectorAll("select"),
      translateBtn = document.querySelector(".translate-btn"),
      icons = document.querySelectorAll(".row i");

// Populate the select options dynamically
selectTags.forEach((tag, id) => {
    for (let code in countries) {
        let selected = (id === 0 && code === "en-GB") || (id === 1 && code === "hi-IN") ? "selected" : "";
        tag.insertAdjacentHTML("beforeend", `<option value="${code}" ${selected}>${countries[code]}</option>`);
    }
});

// Language exchange logic
exchangeIcon.addEventListener("click", () => {
    const tempText = fromText.value;
    const tempLang = selectTags[0].value;
    
    fromText.value = toText.value;
    toText.value = tempText;
    
    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
});

// Clear translation on input change
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
      toText.value = "";
    }
});

// Translate the text using the translation API
translateBtn.addEventListener("click", () => {
    const text = fromText.value.trim(),
          fromLang = selectTags[0].value,
          toLang = selectTags[1].value;

    if (!text) return;

    toText.setAttribute("placeholder", "Translating...");

    const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
      });
});

// Copy or speak functionality for text
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
      if (!fromText.value || !toText.value) return;

      if (target.classList.contains("fa-copy")) {
        const text = target.id === "from-copy" ? fromText.value : toText.value;
        navigator.clipboard.writeText(text);
      } else {
        const utterance = new SpeechSynthesisUtterance(target.id === "from-sound" ? fromText.value : toText.value);
        utterance.lang = target.id === "from-sound" ? selectTags[0].value : selectTags[1].value;
        speechSynthesis.speak(utterance);
      }
    });
});
