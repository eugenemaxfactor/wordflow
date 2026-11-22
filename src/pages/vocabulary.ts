import { flashcardStore } from '../store';
import type { Flashcard } from '../types/flashcards';
import { escapeHtml } from '../utils/escape-html';

// Преобразует специальные HTML-символы в безопасные текстовые представления.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char];
  });
}

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

  if (!dialog || !openButton || !cancelButton || !form) {
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

    // Не принимаем пустые значения.
    if (!word || !translation) {
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

    // Закрываем модальное окно.
    dialog.close();

    // Обновляем страницу, чтобы показать новую карточку.
    refreshPage();
  });
}
