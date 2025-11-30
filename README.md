# Trello-Clone

🚀 Trello Clone (Kanban Board Application)
The Trello Clone is a full-stack web application designed to help users manage tasks using a Kanban board system. Users can create boards, organize tasks into custom lists, and utilize drag-and-drop functionality to manage their workflow efficiently.

✨ Key Features
User Authentication: Secure Sign Up and Log In functionality using JWT.

Board Management: Ability to create, view, edit, and delete personal Kanban boards.

Drag-and-Drop Interface: Seamlessly move Tasks (Cards) between lists and reorder them within a single list.

List Operations: Comprehensive add, edit, and delete functionality for lists within any board.

Task/Card Details: A modal view to edit descriptions and details for any task.

State Synchronization: Real-time data refresh and state management using React Context API and Axios.

🛠️ Tech StackFrontend 
(Client)TechnologyDescriptionReactCore UI library for building the interface.
Tailwind CSSUtility-first CSS framework for rapid styling.
React Router DOMHandles client-side navigation and routing.
React Beautiful DNDProvides the smooth drag-and-drop experience.
AxiosHTTP client for API requests.

Backend
(Server)TechnologyDescriptionNode.js /
Express.jsBackend runtime and RESTful API framework. Postgresql /
Postgresql and sequalize ORM.
JWTJSON Web Tokens for secure authentication.

⚙️ Setup Instructions
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (v18+)

postgresql server Instance (Local) and check .env file to stepup database 


Start Backend
cd backend
npm install
npm run dev

Start frontend
cd trelloclone-main
npm install 
npm run dev
