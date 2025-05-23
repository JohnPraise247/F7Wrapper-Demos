//Created: 2024-07-18
//Updated: 2024-07-18

//Install plugin from https://ds.justplayer.de/projects/f7wrapper if not done already 
app.LoadPlugin("F7Wrapper");

class App {
    constructor() {
        this.quit = 0;
        // Default to light mode, can be changed later or made configurable
        this.mode = "light"; 
    }

    onInit() {
        // Set background color based on mode
        if (this.mode === "dark") {
            f7.setBackColor("#1b1c1e");
            app.SetNavBarColor("#1b1c1e");
        } else {
            f7.setBackColor("#ffffff");
            app.SetNavBarColor("#ffffff");
        }
        
        f7.disableTextSelection();
        f7.disableDrag();
    }

    onStart() {
        // Set color theme (Blue theme)
        f7.setColorTheme("#007aff");

        // Load external styles and scripts
        f7.style("Html/css/style.css");
        f7.script("Html/js/main.js");

        // Add main page
        f7.addPage("Html/home.html", { path: "/" }, true);
    }

    onBack(path) {
        if (path !== "/") {
            f7.back();
        } else {
            if (this.quit === 0) {
                f7.toast("Press again to exit");
                this.quit++;
                setTimeout(() => { this.quit = 0 }, 2000);
            } else {
                app.Exit();
            }
        }
    }
}

// DroidScript handles class instantiation automatically for the main script file.
// So, "new App()" is not strictly needed here if this is the main app script.
// However, if this were a module, you would instantiate it.
// For clarity and consistency with common JS practices, one might include:
// const myApp = new App(); 
// But it depends on DroidScript's specific execution model for the primary .js file.
// For now, leaving it out as per DroidScript's typical pattern.
const myApp = new App();
