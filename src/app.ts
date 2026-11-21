import type { Page } from './types/navigation';
import { renderAboutPage } from './pages/about';

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

  // Для остальных страниц пока показываем название раздела.
  content.innerHTML = `<h2>${activePage}</h2>`;
}

// Выделяем кнопку текущей активной страницы.
function updateActiveButton(): void {
  // Находим все кнопки навигации.
  const buttons = document.querySelectorAll<HTMLButtonElement>('.nav-button');

  buttons.forEach((button) => {
    // Проверяем, соответствует ли кнопка активной странице.
    const isActive = button.dataset.page === activePage;

    // Добавляем или удаляем CSS-класс active.
    button.classList.toggle('active', isActive);
  });
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

    // Получаем идентификатор страницы из HTML-атрибута.
    const page = button.dataset.page;

    // Проверяем страницу. Если она неизвестна — выбираем About Us.
    activePage = resolvePage(page);

    // Обновляем содержимое страницы.
    renderPage();

    // Обновляем выделение активной кнопки.
    updateActiveButton();
  });

  // Отображаем начальную страницу при запуске приложения.
  renderPage();
  // Обновляем выделение активной кнопки.
  updateActiveButton();
}
