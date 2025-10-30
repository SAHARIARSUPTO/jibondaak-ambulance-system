# 🧭 JibonDaak — Developer Guide

Welcome to the **JibonDaak** project!  
This guide is for **team members** so everyone can code smoothly without breaking the main or production branch 😅  

---

## 👑 Project Maintainer
**Main Owner:** @Supto  
👉 Only Supto can merge to the `main` and `staging` branches.

---

## ⚙️ 1. Clone the Repository

Open your terminal or VS Code terminal and run:

```bash
git clone https://github.com/<your-username>/JibonDaak.git
Then move into the project folder:

bash
Copy code
cd JibonDaak
🔄 2. Update to Latest Code Before Working
Always make sure your repo is up-to-date before creating a branch:

bash
Copy code
git fetch --all
git checkout staging
git pull origin staging
✅ Always work from the staging branch, not main.

🌿 3. Create Your Own Branch (From Staging)
Never work on main or directly on staging.
Always create your own branch from the latest staging branch.

bash
Copy code
git checkout -b feature-<your-feature-name>
🧩 Examples
feature-login-page

fix-api-bug

update-readme

🧠 4. Start Developing
Now make your changes — add or edit files in VS Code.
Once done, save your work and commit your changes.

💾 5. Add and Commit Changes
bash
Copy code
git add .
git commit -m "Added login page design"
✅ Use short, meaningful messages.
❌ Don’t use stuff like “final update”, “done”, or “fix again”.

🚀 6. Push Your Branch to GitHub
bash
Copy code
git push origin <your-branch-name>
Example:

bash
Copy code
git push origin feature-login-page
If Git shows an error (first-time push):

bash
Copy code
git push -u origin <your-branch-name>
🧾 7. Create a Pull Request (PR)
After pushing your branch, go to GitHub → Pull Requests → New Pull Request

Set it like this:

Base branch: staging

Compare branch: your feature-<name> branch

Then:

Add a short title (example: “Added login page UI”)

Assign @Supto as reviewer

Click Create Pull Request

✅ Wait for review and approval before merging.

🧪 8. Staging to Main Merge Flow (How Deployment Works)
Branch	Purpose	Deployed To	Who Merges
feature-*	Development work	Temporary Vercel Preview	Developer
staging	Testing / QA	Staging Vercel Deploy (preview URL)	Supto
main	Production code	Live Site (Production)	Supto

Flow Example:
scss
Copy code
feature-login  →  staging  →  main
(dev work)        (test)       (deploy)
Once all features are merged and tested on staging,
Supto merges staging → main → then production site updates automatically 🚀

🚫 9. Important Rules
❗ Rule	Description
1	Never push directly to main or staging
2	Always branch from the latest staging
3	One feature per branch
4	Use clear commit messages
5	Create PR → base = staging
6	Only Supto merges to staging and main

⚡ Example Full Workflow
bash
Copy code
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
If anything breaks or you’re confused, just ask Supto before pushing.
Better safe than sorry 😎

❤️ Made with discipline for the JibonDaak Team
yaml
Copy code

---

If you give me your **actual GitHub repo link**, I’ll plug it in automatically in all the commands (so your teammates can literally copy-paste them without editing).  
Wanna do that?
