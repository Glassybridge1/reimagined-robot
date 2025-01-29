// script.js
let audioContext, analyser, frequencyData;
let terrainMesh, scene, camera, renderer;
let youtubePlayer;

function initVisualization() {
    console.log("Initializing visualization...");

    // Set up the 3D scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("visualization").appendChild(renderer.domElement);

    console.log("Audio context initialized.");

    // Set up audio context and analyser
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Frequency resolution (can be adjusted)
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // Create a terrain mesh (flat plane geometry for now)
    let geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.rotation.x = -Math.PI / 2;  // Rotate the plane to be horizontal
    terrainMesh.position.y = -50; // Start position of terrain
    scene.add(terrainMesh);

    camera.position.z = 100;

    console.log("Visualization initialized.");
}

function updateVisualization() {
    analyser.getByteFrequencyData(frequencyData);

    // Log the frequency data for debugging
    console.log("Frequency data: ", frequencyData);

    // Update terrain vertices based on frequency data
    for (let i = 0; i < terrainMesh.geometry.attributes.position.array.length; i += 3) {
        let zIndex = i + 2;
        terrainMesh.geometry.attributes.position.array[zIndex] = frequencyData[i % frequencyData.length] * 0.1; // Scale frequency
    }

    terrainMesh.geometry.attributes.position.needsUpdate = true; // Ensure the geometry updates
    renderer.render(scene, camera);

    // Call this function repeatedly to animate
    requestAnimationFrame(updateVisualization);
}

function loadAudio() {
    let fileInput = document.getElementById("audio-file");
    let videoUrl = document.getElementById("video-url").value;

    console.log("Load Audio triggered...");

    // If a file is selected
    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        let url = URL.createObjectURL(file);
        let audioElement = document.createElement("audio");
        audioElement.src = url;
        audioElement.play();

        // Connect the audio element to the Web Audio API
        audioContext.resume().then(() => {
            console.log("AudioContext resumed.");

            let source = audioContext.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            // Initialize and start visualizing
            initVisualization();
            updateVisualization();
        }).catch((e) => {
            console.error("AudioContext resume failed: ", e);
        });

    } else if (videoUrl) {
        // Extract YouTube Video ID from the URL
        let videoId = getYouTubeVideoId(videoUrl);
        if (videoId) {
            console.log("YouTube video ID: ", videoId);

            // Embed the YouTube video
            embedYouTubeVideo(videoId);

            // Connect the YouTube audio to the Web Audio API
            audioContext.resume().then(() => {
                let source = audioContext.createMediaElementSource(youtubePlayer);
                source.connect(analyser);
                analyser.connect(audioContext.destination);

                // Initialize and start visualizing
                initVisualization();
                updateVisualization();
            }).catch((e) => {
                console.error("AudioContext resume failed for YouTube video: ", e);
            });
        } else {
            alert("Invalid YouTube URL.");
        }
    }
}

// Get YouTube video ID from URL
function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+[\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Embed YouTube video in an iframe
function embedYouTubeVideo(videoId) {
    console.log("Embedding YouTube video...");

    // Create the YouTube iframe player
    youtubePlayer = new YT.Player('visualization', {
        height: '390',
        width: '640',
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0
        },
        events: {
            'onReady': function(event) {
                event.target.playVideo();
                console.log("YouTube video is playing.");
            },
            'onStateChange': function(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    console.log("YouTube video is playing.");
                }
            }
        }
    });

    // Hide the iframe as we only need the audio
    document.querySelector("iframe").style.display = "none";
}

// Initialize everything when the page loads
window.onload = () => {
    console.log("Page loaded...");

    // Ensure the AudioContext starts properly
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume().then(() => {
        console.log("AudioContext is resumed and ready.");
    }).catch((e) => {
        console.error("AudioContext resume failed: ", e);
    });
};

// Debugging: Check the page load and audio context status
console.log("Script loaded.");