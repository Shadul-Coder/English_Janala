const loadingScreen = (parent) => {
  let loader = document.createElement(`div`);
  loader.className = `flex items-center justify-center my-15`;
  loader.innerHTML = `<span class="loading loading-spinner loading-xl w-15"></span>`;
  parent.appendChild(loader);
};

(async () => {
  let res = await fetch(`https://openapi.programming-hero.com/api/levels/all`);
  let json = await res.json();
  displayLesson(json.data);
})();

const displayLesson = (levels) => {
  let container = document.querySelector(`#Lesson_Container`);
  for (const level of levels) {
    let lessonButton = document.createElement(`div`);
    lessonButton.innerHTML = `
      <button onclick="loadWord(${level[`level_no`]})" id="Lesson_Button-${
      level[`level_no`]
    }" class="Lesson_Button btn btn-soft btn-info hover:text-white active:text-white">
        <i class="fa-solid fa-book-open"></i> Lesson - ${level[`level_no`]}
      </button>
    `;
    container.appendChild(lessonButton);
  }
};

const loadWord = async (level) => {
  let buttons = document.querySelectorAll(`.Lesson_Button`);
  for (let button of buttons) {
    button.classList.remove(`text-white`, `bg-[#0ca8e0]`);
  }
  document
    .querySelector(`#Lesson_Button-${level}`)
    .classList.add(`text-white`, `bg-[#0ca8e0]`);
  let container = document.querySelector(`#Word_Parent`);
  container.innerHTML = ``;
  loadingScreen(container);
  let res = await fetch(
    `https://openapi.programming-hero.com/api/level/${level}`
  );
  let json = await res.json();
  displayWord(json.data);
};

const displayWord = (wordList) => {
  let parent = document.querySelector(`#Word_Parent`);
  if (wordList.length === 0) {
    let noLesson = document.createElement(`div`);
    noLesson.className = `Bangla-Font text-center my-5 sm:my-10`;
    noLesson.innerHTML = `
            <img class="mx-auto" src="Images/Alert Error.png" alt="">
            <p class="text-[#79716b] text-[11px] sm:text-base">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি</p>
            <h1 class="text-xl font-medium sm:text-3xl">নেক্সট Lesson এ যান</h1>
    `;
    parent.innerHTML = ``;
    parent.appendChild(noLesson);
    return;
  }
  let container = document.createElement(`div`);
  container.className = `grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5`;
  for (const word of wordList) {
    let box = document.createElement(`div`);
    box.className = `bg-white p-5 text-center rounded-xl space-y-3 sm:space-y-5`;
    box.innerHTML = `
              <h1 class="mt-3 text-xl font-bold sm:mt-5 sm:text-2xl">${
                word.word
              }</h1>
              <p class="text-base sm:text-xl">Meaning/Pronunciation</p>
              <h3 class="Bangla-Font text-xl font-semibold sm:text-2xl">
                ${word.meaning ? word.meaning : `অর্থ পাওয়া যায়নি`} / ${
      word.pronunciation
    }
              </h3>
              <div class="flex justify-between">
                <button onclick="loadWordDetails(${
                  word.id
                })" class="btn bg-[#1a91ff1a] border-none rounded-lg">
                  <i class="fa-solid fa-circle-info"></i>
                </button>
                <button onclick="pronounceWord('${
                  word.word
                }')" class="btn bg-[#1a91ff1a] border-none rounded-lg">
                  <i class="fa-solid fa-volume-high"></i>
                </button>
              </div>
    `;
    container.appendChild(box);
  }
  parent.innerHTML = ``;
  parent.appendChild(container);
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

const loadSynonyms = (synonyms) => {
  if (synonyms.length === 0) {
    return `<p class="Bangla-Font">কোনো সমার্থক শব্দ পাওয়া যায়নি</p>`;
  }
  const synonymList = synonyms.map(
    (syn) =>
      `<button class="btn bg-[#1a91ff1a] rounded-md font-normal text-[13px] sm:text-base">${syn}</button>`
  );
  return synonymList.join(` `);
};

const loadWordDetails = async (id) => {
  let res = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
  let json = await res.json();
  displayWordDetails(json.data);
};

const displayWordDetails = (data) => {
  let parent = document.querySelector(`#Modal_Content`);
  parent.innerHTML = ``;
  let content = document.createElement(`div`);
  content.className = `border-1 border-[#edf7ff] p-5 rounded-xl space-y-3 sm:space-y-7`;
  content.innerHTML = `
                <h1 class="font-bold sm:text-2xl">
                  ${data.word} (<i class="fa-solid fa-microphone-lines"></i> :
                  <span class="Bangla-Font">${data.pronunciation}</span>)
                </h1>
                <div class="text-[13px] space-y-1 sm:text-lg sm:space-y-3">
                  <h3 class="font-semibold">Meaning</h3>
                  <h1 class="Bangla-Font">${
                    data.meaning ? data.meaning : `অর্থ পাওয়া যায়নি`
                  }</h1>
                </div>
                <div class="text-[13px] space-y-1 sm:text-lg sm:space-y-3">
                  <h5 class="font-semibold">Example</h5>
                  <p>${data.sentence}</p>
                </div>
                <div class="text-[13px] space-y-1 sm:text-lg sm:space-y-3">
                  <h5 class="Bangla-Font font-semibold">সমার্থক শব্দগুলো</h5>
                  <div class="flex flex-wrap gap-1 sm:gap-1.5">
                    ${loadSynonyms(data.synonyms)}
                  </div>
                </div>
  `;
  parent.appendChild(content);
  word_modal.showModal();
};

document.querySelector(`#Search_Form`).addEventListener(`submit`, (event) => {
  event.preventDefault();
  let word = document.querySelector(`#Search_Word`).value;
  document.querySelector(`#Search_Word`).value = ``;
  loadAllWord(word);
});

const loadAllWord = async (word) => {
  let container = document.querySelector(`#Word_Parent`);
  container.innerHTML = ``;
  loadingScreen(container);
  let res = await fetch(`https://openapi.programming-hero.com/api/words/all`);
  let json = await res.json();
  const matchWords = json.data.filter((w) =>
    w.word.toLowerCase().includes(word.toLowerCase())
  );
  if (matchWords.length === 0) {
    let parent = document.querySelector(`#Word_Parent`);
    let noWord = document.createElement(`div`);
    noWord.className = `Bangla-Font text-center my-5 sm:my-10`;
    noWord.innerHTML = `
            <img class="mx-auto" src="Images/Alert Error.png" alt="">
            <h1 class="mt-5 text-xl font-medium sm:text-3xl">কোনো শব্দ পাওয়া যায়নি</h1>
    `;
    parent.innerHTML = ``;
    parent.appendChild(noWord);
    return;
  }
  displayWord(matchWords);
};