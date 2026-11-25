import type { Page } from './types/navigation';
import { renderAboutPage } from './pages/about';
import { mountLearnPage } from './pages/learn';
import { flashcardStore } from './store';
import {
  renderVocabularyPage,
  setupAddWordModal,
  setupDeleteCards,
} from './pages/vocabulary';

// Храним идентификатор текущей активной страницы.
let activePage: Page = 'about';

// Создаём HTML-оболочку приложения с навигацией.
export function createApp(): string {
  const pages: { id: Page; title: string }[] = [
    { id: 'about', title: 'About Us' },
    { id: 'vocabulary', title: 'Vocabulary' },
    { id: 'learn', title: 'Learn' },
    { id: 'statistics', title: 'Statistics' },
  ];

  // Преобразуем каждый объект страницы в HTML-кнопку.
  const navigationButtons = pages
    .map((page) => {
      return `
      <button
        type="button"
        class="nav-button"
        data-page="${page.id}"
      >
        ${page.title}
      </button>
    `;
    })
    .join('');

  // Создаём HTML-оболочку приложения.
  return `
  <div class="app">
    <header class="header">
      <h1>WordFlow</h1>

      <nav class="navigation">
        ${navigationButtons}
      </nav>
    </header>

    <main id="page-content"></main>
  </div>
`;
}

// Проверяем идентификатор страницы и возвращаем безопасное значение.
function resolvePage(page: string | undefined): Page {
  if (
    page === 'about' ||
    page === 'vocabulary' ||
    page === 'learn' ||
    page === 'statistics'
  ) {
    return page;
  }

  // Если страница неизвестна, возвращаем About Us.
  return 'about';
}

// Отображаем содержимое текущей активной страницы.
function renderPage(): void {
  console.log('renderPage вызвана! Активная страница:', activePage);

  // Находим контейнер для содержимого страницы.
  const content = document.querySelector<HTMLElement>('#page-content');

  if (!content) {
    return;
  }

  // Для страницы About Us используем отдельный модуль.
  if (activePage === 'about') {
    content.innerHTML = renderAboutPage();
    return;
  }

  // Отображаем страницу Vocabulary с карточками из хранилища.
  if (activePage === 'vocabulary') {
    content.innerHTML = renderVocabularyPage();

    // Подключаем обработчики после создания HTML.
    setupAddWordModal(renderPage);

    setupDeleteCards(renderPage);

    return;
  }

  if (activePage === 'learn') {
    mountLearnPage(content, flashcardStore, () => {
      navigateTo('vocabulary');
      document
        .querySelector<HTMLButtonElement>(
          '.navigation [data-page="vocabulary"]'
        )
        ?.focus();
    });
    return;
  }

  // Раздел статистики пока не реализован.
  content.innerHTML = `<h2>${activePage}</h2>`;
}

// Выделяем кнопку текущей активной страницы.
function updateActiveButton(): void {
  // Находим все кнопки навигации.
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '.navigation .nav-button'
  );

  buttons.forEach((button) => {
    // Проверяем, соответствует ли кнопка активной странице.
    const isActive = button.dataset.page === activePage;

    // Добавляем или удаляем CSS-класс active.
    button.classList.toggle('active', isActive);
  });
}

function navigateTo(page: Page): void {
  activePage = page;
  renderPage();
  updateActiveButton();
}

// Подключаем обработчик кликов к контейнеру навигации.
export function setupNavigation(): void {
  const navigation = document.querySelector<HTMLElement>('.navigation');

  if (!navigation) {
    return;
  }

  // Используем делегирование событий.
  navigation.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    // Находим кнопку, даже если кликнули по её дочернему элементу.
    const button = target.closest<HTMLButtonElement>('.nav-button');

    if (!button || !navigation.contains(button)) {
      return;
    }

    navigateTo(resolvePage(button.dataset.page));
  });

  // Отображаем начальную страницу при запуске приложения.
  renderPage();
  // Обновляем выделение активной кнопки.
  updateActiveButton();
}
