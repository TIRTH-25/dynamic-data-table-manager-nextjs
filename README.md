🚀 Dynamic Data Table Manager

Next.js 14 + Redux Toolkit + Material UI + TypeScript + CSV Import/Export

A fully dynamic data table where users can:

✅ Manage columns (add/hide/show)
✅ Search across all fields
✅ Sort by columns
✅ Client-side pagination
✅ Import CSV (PapaParse)
✅ Export current view to CSV
✅ Persist data & UI via redux-persist

🧠 Tech Stack
Layer	Tech
Framework	Next.js 14 (App Router)
UI	Material UI v5
State	Redux Toolkit + redux-persist
Forms	React Hook Form
CSV	PapaParse
Language	TypeScript
📦 Install
git clone <your-repo-url>
cd dynamic-data-table-manager
npm install
npm run dev


Open: http://localhost:3000

🛠 Commands
Command	Action
npm run dev	Dev mode
npm run build	Build app
npm run start	Start production server
📁 Folder Structure
src/
 ├─ app/            → Next App Router pages
 ├─ components/     → Table + Modals + Providers
 ├─ store/          → Redux Toolkit + Persist
 ├─ utils/          → CSV parser/export
 ├─ types/          → TypeScript models
 └─ globals.css

📥 CSV Import Format

Required columns:

name	email	age	role

Example:

name,email,age,role
John Doe,john@example.com,28,Developer

📤 CSV Export

Exports only visible columns, preserving header labels.

🧠 Roadmap

 Row editing

 Row delete

 MongoDB persistence

 Role-based UI filters

 Multiple tables dashboard

 Dark theme

🛑 Known Limitations

CSV import expects headers

Data stored in browser (localStorage)

☁️ Deployment (Vercel)
npm run build


Then push to GitHub and deploy via Vercel dashboard or CLI:

vercel


✅ SSR-safe
✅ Client-side persistence
✅ Ready for production

🤝 Contributions

Pull requests welcome!

📄 License

MIT License

🌟 Author

Tirth Patel
Dynamic Data Table Manager — 2025