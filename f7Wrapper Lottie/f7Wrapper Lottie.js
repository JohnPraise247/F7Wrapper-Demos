app.LoadPlugin("F7Wrapper");

class App {
    onInit() {
        f7.setBackColor("#1B1C1E"); 
    }

    onStart() {
        // Load Lottie
        f7.script("lottie.min.js")
     
        // Add animation page
        f7.addPageContent("lottie", {
            content: this.lottiePage
        }, true);
    }

    lottiePage = `
        <div class="page" data-name="lottie">
            <div class="navbar">
                <div class="navbar-bg"></div>
                <div class="navbar-inner">
                    <div class="title">Lottie Animation</div>
                </div>
            </div>
            <div class="page-content">
                <div class="block">
                    <p>Enjoy this cool Lottie animation! 🎉</p>
                    <div id="lottie-container" style="width: 100%; height: 300px;"></div>
                    <button class="button button-fill" onclick="playLottie()">Play Animation</button>
                </div>
            </div>
        </div>`;

    onBack(url) {
        app.Exit();
    }
}

f7.onReady(() => {
    f7.execute(`
        function playLottie() {
            if (!window.lottie) {
                alert("❌ Lottie.js not loaded yet!");
                return;
            }

            var animContainer = document.getElementById("lottie-container");
            animContainer.innerHTML = ""; // Clear previous animation

            var animation = lottie.loadAnimation({
                container: animContainer,
                renderer: "svg",
                loop: true,
                autoplay: true,
                path: "/storage/emulated/0/Android/data/com.smartphoneremote.androidscriptfree/files/DroidScript/f7Wrapper Lottie/anim.json" // Sample animation URL
            });

            console.log("▶️ Lottie Animation Started");
        }
        window.playLottie=playLottie
    `);
});