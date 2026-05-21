# 🗓️ Smart Timetable & Idea Space

A modern, fluid full-stack workspace application designed to handle dynamic weekly planning alongside an interactive brain-dump system. Built completely using containerized components and instant state syncing.

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
| **Styling Engine** | Tailwind CSS | Dynamic layouts and custom spacing architecture |
| **Components** | Radix UI / Lucide Icons | Accessible interaction modules and clean icons |

---

## 📁 Repository Structure

```text
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
├── vite.config.ts               # Bundler rules config
└── tsconfig.json                # Strict compiler rules config