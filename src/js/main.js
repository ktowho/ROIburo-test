import "./vendor/masonry.pkgd.min.js";

console.log('hi')

// Masonry.js

const catalogGrid = document.querySelector(".catalog");
const listGrids = document.getElementsByClassName("section__list");

const reloadlayout = () => {
  listMasonryLoop();
  catalogMasonry();
}
// Расстояние между колонками
let gutter = 16;

// Раскладка списков с позициями категорий
const listMasonryLoop = () => {
  const n = listGrids.length;
  for (let i = 0; i < n; i++) {
    new Masonry(listGrids[i], {
      itemSelector: ".section__item",
      columnWidth: ".section__item",
      horizontalOrder: true,
      gutter: gutter,
    });
  }
};

// Раскладка секций категорий
const catalogMasonry = () =>
  new Masonry(catalogGrid, {
    itemSelector: ".section",
    columnWidth: ".section",
    horizontalOrder: true,
    gutter: gutter,
  });

// Masonry.js отрабатывает только после onload. С DOMContentLoaded - не получится. В результате при медленном соединении заметны оба этапа (в reloadLayout) "раскладки" элементов по местам.
window.onload = () => {
  checkResize();
  reloadlayout();
};


// При изменении размера окна выполняются:
// 1) checkResize - Проверка размера окна - изменяются некоторые переменные, влиющие на количество отображаемых элементов
// 2) reloadLayout - Раскладка компонентов по своим местам (для реализации "каменной кладки" (Masonry))

let innerWidth = document.documentElement.clientWidth;

window.addEventListener('resize', function (e) {
  innerWidth = window.innerWidth
  checkResize();
  reloadlayout();
});


// Проверка размера окна. В зависимости от разрешения меняем количество отображаемых элементов.
// TODO: Уменьшить количество промежуточных классов, часто встречающиеся вынести в переменные
// TODO: Исправить ошибки:
// 1) Отображение кнопки "Показать больше" (у раскрытого списка textContent кнопки не меняется на "Свернуть") в категориях при изменении ширины окна с 767 на 768
// 2) Отображение развернутых списков при изменении ширины окна с 767 на 768

// Переменные для работы chechResize
let classNamesToHide;
let countOfVisible;
const checkResize = () => {

  if (innerWidth >= 1400) {
    classNamesToHide = ".section__item--2more"
    countOfVisible = 10;
    const itemsToHide = document.querySelectorAll(".section__item--1more");
    for (let item of itemsToHide) {
      item.classList.remove("section__item--invisible");
    }
  }

  else if (innerWidth < 1400) {
    classNamesToHide = "a.section__item--2more, a.section__item--1more"
    countOfVisible = 5;
    const itemsToHide = document.querySelectorAll(classNamesToHide);

    for (let item of itemsToHide) {
      if (item.parentNode.parentNode.classList.contains("section__more--opened")) {
        item.classList.remove("section__item--invisible");
      }
    }
  }

  if (innerWidth < 767) {
    classNamesToHide = ".section__item"
    const itemsToHide = document.querySelectorAll(".section__item");
    for (let item of itemsToHide) {
      if (item.parentNode.parentNode.classList.contains("section__more--opened")) { }
      else {
        item.classList.add("section__item--invisible");
      }
    }
  }

  // В это же время принимается решение о показе/скрытии кнопок "Показать еще"/"Скрыть", также производится расчет количества элементов для показа.

  const smallButtons = document.querySelectorAll(".section__more");
  for (let button of smallButtons) {
    const quantiti = button.previousElementSibling.childNodes.length - countOfVisible -5;

    if (quantiti <= 0) {
      button.style.display = 'none';
    } else {
      button.style.display = 'flex';
    }

    if (button.classList.contains("section__more--opened")) {
      button.firstChild.textContent = 'Свернуть';
    } else {
      button.firstChild.textContent = 'Показать еще ' + quantiti;
    }
  }
  reloadlayout();
}


// Header button (для мобильных экранов)
// Показ/скрытие списков по нажатию на header секции, изменение угла поворота стрелки.

const headerButtons = document.querySelectorAll(".section__header")
for (let button of headerButtons) {
  button.onclick = (event) => {
    checkResize();
    const section = event.target.closest(".section")
    const arrow = section.firstChild.lastChild

    if (section.classList.contains("section__more--opened")) {
      arrow.style.transform = "rotate(180deg)"
      const itemsToHide = section.querySelectorAll(classNamesToHide);
      for (let item of itemsToHide) {
        item.classList.add("section__item--invisible");
      }
      button.parentNode.classList.remove("section__more--opened")

    } else {
      arrow.style.transform = "rotate(0deg)"
      const itemsToShow = section.querySelectorAll(classNamesToHide);
      for (let item of itemsToShow) {
        item.classList.remove("section__item--invisible");
      }
      button.parentNode.classList.add("section__more--opened")
    }
      reloadlayout();
  }
}


// Кнопки "Показать еще"/"Скрыть"
const smallButtons = document.querySelectorAll(".section__more");
for (let button of smallButtons) {
  button.onclick = (event) => {
    checkResize();

    const section = event.target.parentNode;

    if (button.classList.contains("section__more--opened")) {
      const itemsToHide = section.querySelectorAll(classNamesToHide);
      const n = itemsToHide.length;
      for (let item of itemsToHide) {
        item.classList.add("section__item--invisible");
      }
      button.classList.remove("section__more--opened")
      button.firstChild.textContent = 'Показать еще ' + n;
    }
    // Показать невидимые элементы
    else {
      const itemsToShow = section.querySelectorAll(classNamesToHide);
      console.log(section ,classNamesToHide ,itemsToShow)
      for (let item of itemsToShow) {
        item.classList.remove("section__item--invisible");
      }
      button.classList.add("section__more--opened")
      button.firstChild.textContent = 'Свернуть';
    }
    reloadlayout();
  };
}

// Кнопка "Показать больше"
const sections = document.querySelectorAll(".section");
const showMoreButton = document.querySelector(".more");

for (let i = 0; i < 11; i++) {
  sections[i].style.display = "inline-block";
}
showMoreButton.onclick = function () {
  for (const el of sections) {
    el.style.display = "inline-block";
  }
  showMoreButton.style.display = "none";
  reloadlayout();
};




