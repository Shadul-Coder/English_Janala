const loadingScreen = (parent) => {
  let load = document.createElement(`span`);
  load.className = `loading loading-spinner loading-xl`;
  const container = document.querySelector(parent);
  container.appendChild(load);
};

(async () => {
  let res = await fetch(`https://openapi.programming-hero.com/api/levels/all`);
  let json = await res.json();
  displayLesson(json.data);
})();

const displayLesson = (levels) => {
  const container = document.querySelector(`#Lesson_Container`);
  for (const level of levels) {
    let button = document.createElement(`button`);
    button.innerHTML = `
          <button
            class="btn btn-soft btn-info hover:text-white active:text-white"
          >
            <i class="fa-solid fa-book-open"></i> Lesson - ${level[`level_no`]}
          </button>
        `;
    container.appendChild(button);
  }
};