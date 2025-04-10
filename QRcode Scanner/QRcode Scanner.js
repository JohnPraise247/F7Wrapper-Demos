cfg.Portrait;
_AddPermissions("Camera");
app.LoadPlugin("F7Wrapper");

class App {
    onInit() {
        f7.setBackColor("#1b1c1e");
        f7.disableTextSelection();
        f7.disableDrag()
    }

    onStart() {
        f7.setTouchOptions({ tapHold: true });
        f7.setDialogOptions({ closeByBackdropClick: true });

        // Set color theme
        f7.setColorTheme("#caddac");

        // Load external styles and scripts
        f7.script("libs/html5-qrcode.min.js")
        f7.style("css/app.css");
        f7.script("js/app.js");

        //add pages
        f7.addPage("pages/home.html", {}, true);
        f7.addPage("pages/scan.html");
    }

    onBack(path) {
        if(path === "/home") {
            app.Exit();
        } else {
            f7.back();
        }
    }
}