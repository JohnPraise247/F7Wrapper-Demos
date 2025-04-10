cfg.Portrait
app.LoadPlugin("F7Wrapper");

class App {
    onInit() {
        f7.setBackColor("#1B1C1E"); 
    }

    dialogPage = `
        <div class="page" data-name="dialogs">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="title">User Inputs</div>
                </div>
            </div>
            <div class="page-content">
                <div class="block">
                    <div class="card">
                        <div class="card-content">
                            <div class="list media-list">
                                <ul id="dialog-inputs"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    onStart() {
        f7.setColorTheme("#2196F3");
        f7.preventAutoClose(true);
        f7.addPageContent("dialogs", { content: this.dialogPage }, true);

        f7.onReady(() => {
            f7.preloader("Loading dialogs... ⏳");

            setTimeout(() => {
                f7.closeDialog();
                app.ShowPopup("Dialogs ready! 🚀");
            }, 2000);

            // Password Dialog
            f7.password("Enter your root password", "Superuser Access 🔐", 
                (a) => { 
                    app.ShowPopup("🔓 Access granted!");
                    this.addInput("Root Password", a); 
                }, 
                (a) => { 
                    app.ShowPopup("❌ Access denied! Try 'password123'.");
                    this.addInput("Root Password", "[Access Denied]");
                }
            );

            // Login Dialog
            f7.login("Authenticate", "Dev Console Login 🖥️", 
                (user, pass) => { 
                    app.ShowPopup(`✅ Welcome, ${user}!`);
                    this.addInput("Username", user);
                    this.addInput("Password", pass);
                }, 
                (user, pass) => { 
                    app.ShowPopup("🚫 Login failed!");
                    this.addInput("Username", user);
                    this.addInput("Password", "[Failed]");
                }
            );

            // Prompt Dialog
            f7.prompt("What’s your stack?", "Developer Debugger 🧐", 
                (e) => { 
                    app.ShowPopup(`🖥️ Ah, ${e}! Solid choice.`);
                    this.addInput("Tech Stack", e);
                }, 
                (e) => { 
                    app.ShowPopup("🤷 No answer? Suspicious...");
                    this.addInput("Tech Stack", "[Skipped]");
                }
            );
        });
    }

    // Function to add inputs inside the card
    addInput(label, value) {
        f7.execute(`$$('#dialog-inputs').append('<li class="item-content"><div class="item-inner"><div class="item-title"><b>${label}:</b> ${value}</div></div></li>')`);
    }

    onBack(url) {  
        if (url == "/dialogs") {
            f7.execute("$$('.modal-in').length == 0", (e) => {
                if (e) app.Exit();
            });
        }
    }
}