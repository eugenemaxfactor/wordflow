// Формирует HTML-разметку страницы About Us.
export function renderAboutPage(): string {
  return `
    <section class="about">
      <!-- Информация о разработчиках и распределении обязанностей. -->
<div class="about-team">
  <h3>Our Team</h3>

  <div class="team-member">
    <h4>Eugene</h4>

    <p>
      Responsible for project architecture, shared flashcard state,
      LocalStorage integration, application navigation, Vocabulary and
      Statistics interfaces, automated testing, code quality tools,
      CI, deployment, and project coordination.
    </p>

    <a
      href="https://github.com/eugenemaxfactor"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub: eugenemaxfactor
    </a>
  </div>

  <div class="team-member">
    <h4>Yesset</h4>

    <p>
      Responsible for the interactive learning experience: displaying
      flashcards, revealing answers, processing "I Know" and "Again"
      actions, tracking session progress, completing learning sessions,
      and calculating vocabulary statistics.
    </p>

    <a
      href="https://github.com/YessetHumanMan"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub: YessetHumanMan
    </a>
  </div>
</div>

<!-- Описание совместной работы над проектом. -->
<div class="about-teamwork">
  <h3>Teamwork</h3>

  <p>
    Both developers collaborate through GitHub Issues, feature branches,
    Pull Requests, and mutual Code Review. They also participate in
    integration testing and prepare for individual interviews with
    live coding.
  </p>
</div>
    </section>
  `;
}
