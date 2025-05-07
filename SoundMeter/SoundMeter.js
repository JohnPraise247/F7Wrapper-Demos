cfg.Portrait;
app.LoadPlugin("F7Wrapper");

class App {
    onInit() {
        f7.setBackColor("#1B1C1E");
        f7.disableTextSelection();
    }

    onStart() {
        // Load styles and scripts
        f7.style("app.css");
        f7.script("libs/gsap.min.js");
        f7.script("libs/CustomEase.min.js");
        f7.script("app.js");

        // Add page
        f7.addPageContent("home", { content: this.page });
    }

    page = `
        <div class="page" data-name="home">
            <svg>
                <g>
                    <line id="line" x1="0" x2="100%" />
                    <polyline id="wave" />
                </g>
            </svg>
            <h1>Sound meter</h1>
            <h2><span id="db">0.00</span>dB</h2>
        </div>
    `;

    onBack() {
        app.Exit();
    }
}