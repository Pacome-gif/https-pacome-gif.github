/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  // NOTE : un préfixe Tailwind racine (ex. `prefix: 'tw-'`) a été testé pour éliminer aussi les
  // collisions de noms entre utilitaires Tailwind et Bootstrap (ex. `shadow-sm`, `flex`, `mt-4`
  // existent dans les deux). Retiré : combiné à `daisyui.prefix`, il empêche daisyUI de générer
  // la moindre classe de composant (du-btn, du-input...), vérifié en build. Les utilitaires
  // Tailwind restent donc sans préfixe ; en pratique Bootstrap protège déjà ses propres
  // utilitaires via `!important`, donc l'existant ne casse pas — seul un nom d'utilitaire
  // Tailwind volontairement identique à un utilitaire Bootstrap serait sans effet (à éviter
  // au cas par cas plutôt que résolu structurellement).
  corePlugins: {
    // Bootstrap reste responsable des styles de base : on ne veut pas que le reset
    // Tailwind (Preflight) réécrive les styles d'éléments HTML natifs déjà gérés par lui.
    preflight: false,
    // Évite la collision directe avec la classe `.container` déjà définie par Bootstrap.
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    // Toutes les classes daisyUI sont préfixées `du-` pour ne jamais entrer en collision
    // avec les classes Bootstrap de même nom (.btn, .card, .table, .badge, .alert...).
    prefix: 'du-',
    themes: [
      {
        bibliotheque: {
          "primary": "#14315c",
          "primary-content": "#ffffff",
          "secondary": "#1c4587",
          "secondary-content": "#ffffff",
          "accent": "#3b5a8a",
          "accent-content": "#ffffff",
          "neutral": "#051633",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f6fa",
          "base-300": "#d7dee8",
          "base-content": "#14315c",
          "info": "#3b82c4",
          "success": "#2e7d5b",
          "warning": "#c98a1f",
          "error": "#b3404a",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1rem",
        },
      },
    ],
    darkTheme: false,
  },
}
