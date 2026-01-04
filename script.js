
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Read Along App');

    const audioPlayer = document.getElementById('audio-player');
    const sourceButtons = document.querySelectorAll('.source-btn');
    let segments = [];
    let currentSource = '';
    let currentTime = 0;

    // Function to load audio source
    function loadSource(source, jsonFile) {
        // Save current time before changing source
        currentTime = audioPlayer.currentTime;

        // Update source buttons
        sourceButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.src === source);
        });

        // Load the audio
        audioPlayer.src = source;

        // Load the corresponding JSON data
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                createSegmentsFromData(data);
                segments = Array.from(document.querySelectorAll('.segment'));

                // Restore playback position if it's the same source
                if (currentSource === source && currentTime < audioPlayer.duration) {
                    audioPlayer.currentTime = currentTime;
                } else {
                    audioPlayer.currentTime = 0;
                }

                // Play the audio if it was playing before
                const wasPlaying = !audioPlayer.paused;
                audioPlayer.load(); // Required for source change to take effect
                if (wasPlaying) {
                    audioPlayer.play().catch(e => console.error('Playback failed:', e));
                }

                currentSource = source;
            })
            .catch(error => {
                console.error(`Error loading JSON file (${jsonFile}):`, error);
            });
    }

    // Set up source buttons
    sourceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const source = button.dataset.src;
            const jsonFile = source.replace('.mp3', '.json');
            loadSource(source, jsonFile);
        });
    });

    // Initialize with the first source
    if (sourceButtons.length > 0) {
        const firstButton = sourceButtons[0];
        loadSource(firstButton.dataset.src, firstButton.dataset.src.replace('.mp3', '.json'));
    }

    // Add timeupdate event listener
    audioPlayer.addEventListener('timeupdate', updateActiveSegment);

    // Function to update the active segment based on current time
    function updateActiveSegment() {
        const currentTime = audioPlayer.currentTime;

        // Remove active class from all segments
        segments.forEach(segment => {
            segment.classList.remove('active');
        });

        // Find and highlight the current segment
        const activeSegment = segments.find(segment => {
            const start = parseFloat(segment.getAttribute('data-start'));
            const end = parseFloat(segment.getAttribute('data-end'));
            return currentTime >= start && currentTime < end;
        });

        if (activeSegment) {
            activeSegment.classList.add('active');
            // Scroll the segment into view
            activeSegment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});

function createSegmentsFromData(data) {
    // TODO: Implement segment creation logic
    console.log('Creating segments from data:', data);

    // Example: create a simple div for each segment
    const container = document.getElementById('segments-container');
    container.innerHTML = ''; // Clear previous content

    // Get the audio player element
    const audioPlayer = document.getElementById('audio-player');

    data.segments.forEach((segment, index) => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment';
        segmentDiv.textContent = segment.text;
        segmentDiv.setAttribute('data-start', segment.start);
        segmentDiv.setAttribute('data-end', segment.end);

        // Make the segment clickable
        segmentDiv.style.cursor = 'pointer';
        segmentDiv.addEventListener('click', () => {
            // Seek to the start time of the segment
            audioPlayer.currentTime = parseFloat(segment.start);

            // Optional: Play the audio if it's not already playing
            if (audioPlayer.paused) {
                audioPlayer.play();
            }

            // Add a visual feedback for the click
            segmentDiv.classList.add('clicked');
            setTimeout(() => segmentDiv.classList.remove('clicked'), 200);
        });

        container.appendChild(segmentDiv);
    });
}