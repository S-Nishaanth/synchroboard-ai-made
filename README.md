# 🗓️ Smart Timetable & Idea Space

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 🗓️ Smart Timetable & Idea Space

A fluid, containerized full‑stack workspace for dynamic weekly planning and a lightweight brain‑dump / Kanban area. Built with modular components, instant state syncing, and developer-friendly structure.

---

## 🔓 Open Source

This project is released under the MIT License — free to use, modify, and redistribute for personal or commercial purposes.

- Forks & PRs welcome. Open issues for bugs or feature requests.
- Commercial and private use allowed per the MIT terms in LICENSE.

---

## ✨ Core Features

- Interactive timetable grid with event dialogs and reactive updates  
- Kanban-style idea board for quick notes and task organization  
- Instant local-state parsing with framework-wide reactivity  
- Modular config slices for routing, types, and mock data

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend | React 18 + TypeScript | Strong types, composable components |
| Build | Vite | Fast dev server & efficient builds |
| Styling | Tailwind CSS v4 | Utility-first responsive styling |
| UI | Radix UI, Lucide Icons | Accessible primitives & icons |
| Containerization | Docker | Reproducible local/dev environments |

---

## 📁 Repository Structure

```text
├── .github/workflows/
│   └── deploy.yml           # CI/CD / GitHub Pages pipeline
├── src/
│   ├── components/
│   │   ├── EventDialog.tsx
│   │   ├── IdeaBoard.tsx
│   │   ├── IdeaDialog.tsx
│   │   └── TimetableGrid.tsx
│   ├── data/
│   │   └── initialData.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css
├── index.html
├── LICENSE
├── vite.config.ts
└── tsconfig.json
```

---

## 🤖 Built with AI Studio

Scaffolded and structured using Google AI Studio (Gemini 3 Pro) to accelerate prototyping and component design. This repo demonstrates practical AI-assisted engineering workflows.

---