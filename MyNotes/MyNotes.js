//Created: 04-03-25
//Updated:10-04-25

//Install plugin from https://ds.justplayer.de/projects/f7wrapper if not done already 
app.LoadPlugin("F7Wrapper");


class App {
    constructor() {
        // Load mode from storage or set default to "dark"
        this.mode = app.LoadText("mode", "dark", "fileMN");
        this.quit = 0;
    }

    onInit() {
        // Set background color based on mode
       // f7.setOptions("usebasicinput"). --> Check app.CreateWebView for all the available options
       this.clr = this.mode === "dark" ? "#1b1c1e" : "#ffffff";
        f7.setBackColor(this.clr);
        app.SetNavBarColor( this.clr )
         f7.disableTextSelection();
        f7.disableDrag()
    }

    onStart() {
        // Enable touch options
        f7.setTouchOptions({ tapHold: true }); 
        
         f7.setPanelOptions({ swipe: false });//Set to true, if you want the Panel to be swipe enabled

        // Set color theme
        f7.setColorTheme("#2196F3");

        // Load external styles and scripts
        f7.style("Html/css/style.css");
        f7.script("Html/js/main.js");

        // Add panels 
        f7.addPanel("Html/panel.html");

        //add pages
        f7.addPage("Html/splash.html", { path:"/" }, true);
        f7.addPage("Html/home.html");
        f7.addPage("Html/edit.html", { path: "/edit/:id/" });
    }

    onBack(path) {
        if (path !== "/") {
            if (path === "/home"){
                if (this.quit === 0) {
                       f7.toast("Press again to exit");
		  	          this.quit++;
                } else {
                    app.Exit();
                }
                setTimeout(() => { this.quit = 0 }, 2000);
            } else {
                f7.back();
            }
        }
    }
}