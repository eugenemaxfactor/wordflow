import { flashcardStore } from '../store';
import type { Flashcard } from '../types/flashcards';
import { escapeHtml } from '../utils/escape-html';

// Формирует HTML-разметку страницы Vocabulary.
export function renderVocabularyPage(): string {
  const cards = flashcardStore.getCards();

  // Создаёт HTML для одной карточки.
  function renderCard(card: Flashcard): string {
    const status = card.learned ? 'learned' : 'new';

    return `
      <article class="vocabulary-card">
        <h3 class="vocabulary-card__word">${escapeHtml(card.word)}</h3>
        <p class="vocabulary-card__translation">${escapeHtml(card.translation)}</p>
        <span class="vocabulary-card__status vocabulary-card__status--${status}">
          ${status}
        </span>

        <button
          type="button"
          class="vocabulary-card__delete"
          data-card-id="${escapeHtml(card.id)}"
          aria-label="Delete ${escapeHtml(card.word)}"
          title="Delete word"
        >
          <svg
            class="vocabulary-card__delete-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 7h16" />
            <path d="M9 7V4h6v3" />
            <path d="M6 7l1 13h10l1-13" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
          </svg>
        </button>
      </article>
    `;
  }

  const cardItems = cards.map(renderCard).join('');

  return `
    <section class="vocabulary">
      <h2>Vocabulary</h2>
      <button
        type="button"
        id="open-add-word-dialog"
        class="vocabulary__add-button"
      >
        + Add Word
      </button>
      <p>Total words: ${cards.length}</p>
      ${
        cards.length > 0
          ? `<div class="vocabulary-grid">${cardItems}</div>`
          : '<p>No words yet.</p>'
      }


      <dialog id="add-word-dialog" class="add-word-dialog">
        <h2 class="add-word-dialog__title">Add New Word</h2>

        <form id="add-word-form" class="add-word-form">
          <label class="add-word-form__label" for="word-input">
            English word
          </label>
          <input
            id="word-input"
            class="add-word-form__input"
            name="word"
            type="text"
            required
          />

          <label class="add-word-form__label" for="translation-input">
            Translation
          </label>
          <input
            id="translation-input"
            class="add-word-form__input"
            name="translation"
            type="text"
            required
          />

          
          <p id="add-word-error" class="add-word-error" role="alert"></p>

          <div class="add-word-form__actions">
            <button
              type="button"
              id="cancel-add-word"
              class="add-word-form__button add-word-form__button--secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="add-word-form__button add-word-form__button--primary"
            >
              Add Word
            </button>
          </div>
        </form>
      </dialog>
    </section>
  `;
}

// Настраивает открытие и закрытие модального окна.
export function setupAddWordModal(refreshPage: () => void): void {
  // Находим модальное окно и кнопки в DOM.
  const dialog = document.querySelector<HTMLDialogElement>('#add-word-dialog');
  const openButton = document.querySelector<HTMLButtonElement>(
    '#open-add-word-dialog'
  );

  const cancelButton =
    document.querySelector<HTMLButtonElement>('#cancel-add-word');

  // Находим форму добавления нового слова.
  const form = document.querySelector<HTMLFormElement>('#add-word-form');
  // Находим элемент для отображения ошибок формы.
  const errorMessage =
    document.querySelector<HTMLParagraphElement>('#add-word-error');

  if (!dialog || !openButton || !cancelButton || !form || !errorMessage) {
    return;
  }

  // Открываем модальное окно при нажатии Add Word.
  openButton.addEventListener('click', () => {
    dialog.showModal();
  });

  // Закрываем модальное окно при нажатии Cancel.
  cancelButton.addEventListener('click', () => {
    dialog.close();
  });

  // Очищаем сообщение об ошибке при любом закрытии диалога.
  dialog.addEventListener('close', () => {
    errorMessage.textContent = '';
  });

  // Обрабатываем отправку формы.
  form.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы и перезагрузку страницы.
    event.preventDefault();

    // Получаем значения из полей ввода.
    const wordInput = form.querySelector<HTMLInputElement>('#word-input');
    const translationInput =
      form.querySelector<HTMLInputElement>('#translation-input');

    // Проверяем, что оба поля существуют.
    if (!wordInput || !translationInput) {
      return;
    }

    // Убираем лишние пробелы в начале и конце.
    const word = wordInput.value.trim();
    const translation = translationInput.value.trim();

    // Проверяем, что пользователь ввёл оба значения.
    if (!word || !translation) {
      errorMessage.textContent = 'Please enter a word and translation.';
      return;
    }

    // Проверяем, существует ли английское слово в словаре.
    const isDuplicate = flashcardStore.getCards().some((card) => {
      return card.word.toLowerCase() === word.toLowerCase();
    });

    // Показываем ошибку, если слово уже существует.
    if (isDuplicate) {
      errorMessage.textContent = 'This word already exists in your vocabulary.';
      return;
    }

    // Создаём новую карточку по интерфейсу Flashcard.
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      word: word,
      translation: translation,
      learned: false,
    };

    // Сохраняем карточку в общем хранилище.
    flashcardStore.addCard(newCard);
    // Очищаем поля формы после успешного сохранения.
    form.reset();
    errorMessage.textContent = '';

    // Закрываем модальное окно.
    dialog.close();

    // Обновляем страницу, чтобы показать новую карточку.
    refreshPage();
  });
}

// Настраивает удаление карточек через один обработчик событий.
export function setupDeleteCards(refreshPage: () => void): void {
  // Находим контейнер страницы Vocabulary.
  const vocabulary = document.querySelector<HTMLElement>('.vocabulary');

  if (!vocabulary) {
    return;
  }

  // Обрабатываем клики внутри Vocabulary.
  vocabulary.addEventListener('click', (event) => {
    // Определяем HTML-элемент, по которому нажал пользователь.
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    // Проверяем, нажал ли пользователь кнопку Delete.
    const deleteButton = target.closest<HTMLButtonElement>(
      '.vocabulary-card__delete'
    );

    if (!deleteButton) {
      return;
    }

    // Получаем ID карточки из data-card-id.
    const cardId = deleteButton.dataset.cardId;

    if (!cardId) {
      return;
    }

    // Удаляем карточку через общее хранилище.
    flashcardStore.deleteCard(cardId);

    // Обновляем страницу без перезагрузки браузера.
    refreshPage();
  });
}
