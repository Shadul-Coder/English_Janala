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
      <button onclick="loadWord(${
        level[`level_no`]
      })" class="btn btn-soft btn-info hover:text-white active:text-white">
        <i class="fa-solid fa-book-open"></i> Lesson - ${level[`level_no`]}
      </button>
    `;
    container.appendChild(lessonButton);
  }
};

const loadWord = async (level) => {
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
              <h1 class="mt-3 text-xl font-bold sm:mt-5 sm:text-2xl">${word.word}</h1>
              <p class="text-base sm:text-xl">Meaning/Pronunciation</p>
              <h3 class="Bangla-Font text-xl font-semibold sm:text-2xl">
                ${word.meaning} / ${word.pronunciation}
              </h3>
              <div class="flex justify-between">
                <button class="btn bg-[#1a91ff1a] border-none rounded-lg">
                  <i class="fa-solid fa-circle-info"></i>
                </button>
                <button class="btn bg-[#1a91ff1a] border-none rounded-lg">
                  <i class="fa-solid fa-volume-high"></i>
                </button>
              </div>
    `;
    container.appendChild(box);
  }
  parent.innerHTML = ``;
  parent.appendChild(container);
};