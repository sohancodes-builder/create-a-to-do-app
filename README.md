# TaskFlow — Modern Productivity & To-Do Application

TaskFlow is a fast, responsive, and full-featured task and productivity management application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

![TaskFlow Preview](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/check-check.svg)

---

## ✨ Features

### 📋 Versatile Productivity Views
- **List View**: Group tasks by Category, Priority, or Status. Sort by Due Date, Priority, Created Time, or Title. Includes inline quick-entry.
- **Kanban Board**: Drag-and-drop or status columns for **To Do**, **In Progress**, and **Completed**.
- **Eisenhower Matrix**: Prioritize tasks across four classic productivity quadrants:
  - *Do First* (Urgent & Important)
  - *Schedule* (Important, Not Urgent)
  - *Delegate / Quick* (Urgent, Not Important)
  - *Eliminate* (Low Priority / Low Urgency)
- **Interactive Calendar**: Monthly schedule grid with per-day task indicators. Click any date to view and schedule tasks.
- **Productivity Dashboard & Analytics**: Real-time velocity tracking, completion rate metrics, overdue alerts, category distribution meters, and Pomodoro focus logs.

### ⏱️ Integrated Pomodoro Focus Timer
- 25-minute Deep Work, 5-minute Short Break, and 15-minute Long Break timers.
- Attach any specific task to a focus session.
- Automatic focus time logging and session count tracking.
- Web Audio API bell chime on session completion.

### 🎯 Task Management
- **Rich Task Details**: Title, description notes, priority (Urgent, High, Medium, Low), custom tags (`#tag`), due dates & times, category/project grouping.
- **Subtasks & Checklists**: Interactive subtask checklist with progress percentages. Check subtasks off directly from the task card.
- **Favorites & Starred**: Quickly bookmark critical items.
- **Celebration Effects**: Confetti bursts upon task completion and audio chimes (Web Audio API synthesizers, zero external audio asset dependencies).

### 🔍 Search & Filtering
- Instant live search across task titles, notes, and tags (`Ctrl + K` or `/`).
- Smart sidebar filters: All, Today, Upcoming, Starred, Completed.
- Filter by custom categories with custom colors.
- Filter by tags.

### ⌨️ Power-User Keyboard Shortcuts
| Shortcut | Action |
| --- | --- |
| `N` | Create new task |
| `Ctrl + K` or `/` | Focus search bar |
| `P` | Open Pomodoro Focus Timer |
| `1` | Switch to List View |
| `2` | Switch to Kanban Board View |
| `3` | Switch to Eisenhower Matrix View |
| `4` | Switch to Calendar View |
| `5` | Switch to Analytics View |
| `D` | Toggle Dark / Light Theme |
| `M` | Mute / Unmute Sound Effects |
| `?` | View all Keyboard Shortcuts |
| `Esc` | Close open modals |

### 💾 Data Persistence & Portability
- Automatic persistence in browser `localStorage`.
- **Export Backup**: Download all tasks, subtasks, and categories as `.json` or copy to clipboard.
- **Restore Backup**: Upload a JSON backup file to restore your entire workspace.
- **Sample Data**: One-click restore to sample demo tasks to explore features immediately.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (native browser audio synthesis)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 📁 Project Structure

```
create-a-to-do-app/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                    # Root application component & global shortcuts
    ├── main.tsx                   # App bootstrap & Context providers
    ├── index.css                  # Tailwind styles and custom utilities
    ├── types/
    │   └── index.ts               # Core TypeScript interfaces & types
    ├── context/
    │   ├── TaskContext.tsx        # Tasks, filters, categories & pomodoro state
    │   └── ThemeContext.tsx       # Dark/light theme mode provider
    ├── utils/
    │   ├── date.ts                # Date formatting and overdue calculations
    │   ├── sound.ts               # Web Audio API sound synthesis
    │   ├── confetti.ts            # Confetti particle bursts
    │   └── initialData.ts         # Sample pre-populated tasks & categories
    └── components/
        ├── Navbar.tsx             # Header navigation, search, timer badge, theme toggle
        ├── Sidebar.tsx            # Today's goal meter, filters, categories & tags
        ├── TaskCard.tsx           # Interactive task item with checklist & actions
        ├── TaskQuickAdd.tsx       # Inline rapid task creation bar
        ├── TaskModal.tsx          # Full task creator / editor modal
        ├── PomodoroModal.tsx      # Pomodoro focus timer drawer
        ├── ShortcutsModal.tsx     # Keyboard shortcuts modal
        ├── ImportExportModal.tsx  # JSON backup / restore modal
        └── views/
            ├── ListView.tsx       # List view with grouping & sorting
            ├── KanbanView.tsx     # Drag-and-drop Kanban workflow
            ├── EisenhowerMatrixView.tsx # 4-quadrant urgency/importance matrix
            ├── CalendarView.tsx   # Interactive monthly calendar
            └── AnalyticsView.tsx  # Productivity charts & insights
```
