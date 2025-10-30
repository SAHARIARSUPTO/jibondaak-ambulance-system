JibonDaak — Developer Guide

Welcome to the JibonDaak project!
This guide is for team members so everyone can code safely without breaking main or production 😅

👑 Project Maintainer

Main Owner: @Supto
👉 Only Supto can merge to main and staging.

⚙️ 1. Clone the Repository

Open your terminal or VS Code terminal and run:

git clone https://github.com/SAHARIARSUPTO/jibondaak-ambulance-system.git
cd jibondaak-ambulance-system

🔄 2. Update to Latest Code Before Working

Always make sure your repo is up-to-date before creating a branch:

git fetch --all
git checkout staging
git pull origin staging


✅ Always work from the staging branch, not main.

🌿 3. Create Your Own Branch (From Staging)

Never work on main or directly on staging.
Create a branch from the latest staging branch:

git checkout -b feature-<your-feature-name>


🧩 Examples:

feature-login-page

fix-api-bug

update-readme

🧠 4. Start Developing

Add or edit files in VS Code

Once done, save your work

💾 5. Add and Commit Changes
git add .
git commit -m "Added login page design"


✅ Use short, meaningful commit messages.
❌ Don’t use: “final update”, “done”, “fix again”, etc.

🚀 6. Push Your Branch to GitHub
git push origin <your-branch-name>


Example:

git push origin feature-login-page


If Git complains (first-time push for this branch):

git push -u origin <your-branch-name>

🧾 7. Create a Pull Request (PR)

Go to GitHub → Pull Requests → New Pull Request

Set it like this:

Base branch: staging

Compare branch: your feature branch

Add a short title (e.g., “Added login page UI”)

Assign @Supto as reviewer

Click Create Pull Request

Wait for review and approval before merging

🧪 8. Staging to Main Merge Flow
Branch	Purpose	Deployed To	Who Merges
feature-*	Development work	Temporary Vercel Preview	Developer
staging	Testing / QA	Staging Vercel Preview URL	Supto
main	Production code	Live Site (Production)	Supto

Flow Example:

feature-login  →  staging  →  main
(dev work)       (test)       (deploy)


Once all features are merged and tested on staging,

Supto merges staging → main → production site updates automatically 🚀

🚫 9. Important Rules
❗ Rule	Description
1	Never push directly to main or staging
2	Always branch from the latest staging
3	One feature per branch
4	Use clear commit messages
5	Create PR → base = staging
6	Only Supto merges to staging and main
⚡ Example Full Workflow
git fetch --all
git checkout staging
git pull origin staging
git checkout -b feature-user-auth
# --- work on files ---
git add .
git commit -m "Added user authentication system"
git push origin feature-user-auth
# then create PR → base: staging → compare: your branch

🧩 Need Help?

If anything breaks or you’re confused, ask Supto before pushing.
Better safe than sorry 😎

❤️ Made with discipline for the JibonDaak Team
