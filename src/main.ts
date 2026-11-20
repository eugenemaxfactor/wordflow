import './style.css';
import { createApp, setupNavigation } from './app';

// Находим корневой HTML-элемент приложения.
const app = document.querySelector<HTMLDivElement>('#app');

// Проверяем, что элемент существует.
if (!app) {
  throw new Error('App root element not found');
}

// Создаём HTML-разметку и вставляем её в корневой элемент.
app.innerHTML = createApp();

// Подключаем обработчики навигации.
setupNavigation();
