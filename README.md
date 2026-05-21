# 🗓️ Smart Timetable & Idea Space

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, fluid full-stack workspace application designed to handle dynamic weekly planning alongside an interactive brain-dump system. Built completely using containerized components and instant state syncing.

---

## 🔓 Open Source & Contributions

This project is entirely **Open Source** and distributed under the permissive **MIT License**. 

Whether you want to tweak the timetable grid for your own college schedule, adapt the Kanban idea board layout, or contribute code back to the project, you are completely free to do so! 

*   **Forks & Pull Requests:** Contributions are welcome. If you notice a bug or have a feature idea, feel free to open an issue or submit a pull request.
*   **Commercial & Private Use:** The MIT License grants you full permission to modify, distribute, and use this application privately or commercially with zero restrictions.

---

## ✨ Core Features

*   **Interactive Timetable Grid:** A visual daily scheduler with reactive calendar view tracking blocks and event dialog overlays.
*   **Kanban Idea Board:** An integrated scratchpad to store, update, and sort project workflows next to your schedule.
*   **State Management:** Instant local-state parsing with full framework reactivity across multi-file architectures.
*   **Clean Config Slicing:** Dedicated modules for routing, interface definitions, and mock metadata profiles.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | Explicit type safety and component structure |
| **Build Tooling** | Vite | Rapid module replacement and bundle optimization |
| **Styling Engine** | Tailwind CSS v4 | Dynamic layouts and custom spacing architecture |
| **Components** | Radix UI / Lucide Icons | Accessible interaction modules and clean icons |

---

## 📁 Repository Structure

```text
├── .github/workflows/
│   └── deploy.yml           # Automated GitHub Pages deployment pipeline
├── src/
│   ├── components/
│   │   ├── EventDialog.tsx      # Modal scheduler controller
│   │   ├── IdeaBoard.tsx        # Kanban workspace panel
│   │   ├── IdeaDialog.tsx       # Content configuration overlay
│   │   └── TimetableGrid.tsx    # Primary visual calendar view
│   ├── data/
│   │   └── initialData.ts       # Structured base data arrays
│   ├── App.tsx                  # Core layout wrapper
│   ├── main.tsx                 # Client entry point
│   ├── types.ts                 # Central interface definitions
│   └── index.css                # Global style layer
├── index.html                   # HTML Entry template
├── LICENSE                      # MIT Open-Source License definitions
├── vite.config.ts               # Bundler rules config
└── tsconfig.json                # Strict compiler rules config

---

## 🤖 Built with Google AI Studio

This entire application was designed, engineered, and structured utilizing **Google AI Studio** and the **Gemini 3 Pro** backend ecosystem using "Build Mode". 

*   **Prompt Architecture:** Context windows and structural parameters were managed inside the AI Studio console to scaffold components, state logic, and the file-tree architecture cleanly.
*   **Purpose:** This repository serves as an open-source demonstration of utilizing cloud-based AI agent platforms to rapidly prototype fully functional web systems.