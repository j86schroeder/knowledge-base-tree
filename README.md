# Knowledge Base Tree (KMS)

Knowledge Base Tree is a modular, high-performance Knowledge Management System (KMS) designed to eliminate information silos in complex IT environments. Unlike flat documentation tools, this system uses a tri-pane hierarchical drill-down—**Process > Domain > Technology**—to provide engineers with immediate context alongside technical instructions.

## 🌟 The ServiceNow Bridge (Real-World Application)
This project was developed to solve a specific business gap: a team operating without an enterprise service desk (ServiceNow). 

I built this system as a **strategic forward-path** for process documentation. By standardizing the taxonomy and using a modular HTML/JSON structure, I ensured that all documentation was "ServiceNow Ready." When the organization eventually migrated to an enterprise platform, the content was designed for a direct "copy-paste" of the source code, eliminating the need for manual re-formatting or data clean-up.

## 🚀 Key Features
- **Hierarchical Tree Navigation:** Rapidly drill down from organizational processes to specific technology stacks.
- **Contextual Search Mode:** Toggle between global search and filtered views for specific document types (How-To, KCS Article, FAQ, What-Is).
- **"Jump to Context" Logic:** Find an article via search and instantly "jump" back into the hierarchical tree to see all related documentation in that domain.
- **ServiceNow-Ready Formatting:** Documentation templates are structured to be compatible with enterprise knowledge bases.
- **State-Driven UI:** Built with Vanilla ES6 JavaScript modules for high performance without the overhead of heavy frameworks.

## 🛠️ Technical Stack
- **Logic:** Vanilla JavaScript (ES6 Modules)
- **Architecture:** State-based UI management
- **Style:** Modular CSS3 (Component-based styling)
- **Data:** REST API simulation via `json-server`

## 📂 Architecture Overview
- `js/app.js`: Core state machine and event handling.
- `js/ui/browser.js`: Hierarchical rendering logic and "Context" jumping.
- `js/ui/viewer.js`: Dynamic template rendering for different article types.
- `data/kb_data.json`: Taxonomy and article repository.

## 💻 Installation & Setup

This project requires [Node.js](https://nodejs.org/) to run the mock database.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/j86schroeder/knowledge-base-tree.git
   ```
   ```bash
   cd knowledge-base-tree
   ```
   ```bash
   npm install
   ```
   ```bash
   npx json-server data/kb_data.json --port 3000
   ```