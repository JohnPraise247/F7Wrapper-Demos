gsap.registerPlugin(CustomEase);

var recorder;
var interval;
var points = [];

function startListening() {
    recorder = app.CreateAudioRecorder();
    recorder.Start();

    // Check sound level every 100ms
    interval = setInterval(function() {
        var rms = recorder.GetRMS();
        var normalizedLevel = 0;
        if (rms > 0) {
            // Step 1: Calculate raw dB from RMS
            var rawDB = 20 * Math.log10(rms);
            
            // Step 2: Log raw dB for calibration (temporary)
            console.log("Raw dB:", rawDB.toFixed(2));

            // Step 3: Apply a calibration factor to amplify sensitivity
            var calibrationFactor = 1.1; // Adjust this based on observed raw dB values
            var adjustedDB = rawDB * calibrationFactor;

            // Step 4: Define a more realistic dB range for normalization
            var minDB = -90; // Adjusted to capture lower raw dB values
            var maxDB = -10; // Adjusted to reflect loud sounds
            normalizedLevel = Math.max(0, Math.min(100, ((adjustedDB - minDB) / (maxDB - minDB)) * 100));
            
            // Step 5: Display the normalized level
            $$("#db").text(normalizedLevel.toFixed(2));
        } else {
            $$("#db").text("0.00");
        }
        updateWaveform(normalizedLevel);
        updateWaveformColor(normalizedLevel);
    }, 100);
}

function updateWaveform(level) {
    var baseAmplitude = 5; // Minimum amplitude for quiet environments
    var maxAmplitude = 250; // Max amplitude for loud sounds
    var amplitude = baseAmplitude + (level / 100) * (maxAmplitude - baseAmplitude);
    var width = app.GetDisplayWidth() / 2;
    var segments = 1000;
    var interval = width / segments;
    var time = Date.now() * 0.002;

    for (var i = 0; i <= segments; i++) {
        var norm = i / segments; // Normalized position (0 to 1)
        var x = i * interval;
        // Apply a Hann window: amplitude starts at 0, peaks in the middle, ends at 0
        var window = 0.5 * (1 - Math.cos(2 * Math.PI * norm)); // Hann window function
        var modulatedAmplitude = amplitude * window;
        // Higher frequency sine wave with more divisions (30 cycles across screen)
        var y = Math.sin(norm * Math.PI * 30 - time * 2) * modulatedAmplitude;
        points[i].x = x;
        points[i].y = y;
    }
}

function updateWaveformColor(level) {
    var wave = document.querySelector("#wave");
    var startHue = 171; 
    var endHue = 227; 
    var hue = startHue + (level / 100) * (endHue - startHue);
    var color = `hsl(${hue}, 80%, 50%)`;
    gsap.to(wave, { duration: 0.1, stroke: color });
}

$$(document).on("page:mounted", '.page[data-name="home"]', () => {
    var svg = document.querySelector("svg");
    var wave = document.querySelector("#wave");
    
    // Clear existing points
    points = [];
    wave.points.clear();

    var width = app.GetDisplayWidth() / 2;
    var segments = 1000;
    var interval = width / segments;

    // Initialize polyline points
    for (var i = 0; i <= segments; i++) {
        var point = wave.points.appendItem(svg.createSVGPoint());
        point.x = i * interval;
        point.y = 0;
        points.push(point);
    }

    // Center waveform vertically
    gsap.set("g", {
        y: window.innerHeight / 2
    });

    wave.style.stroke = "hsl(171, 80%, 50%)";
    startListening();
});
