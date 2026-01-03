
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Read Along App');

    const audioPlayer = document.getElementById('audio-player');
    let segments = [];

    // Fetch and parse the JSON file
    fetch('output-p1.json')
        .then(response => response.json())
        .then(data => {
            console.log('Parsed JSON data:', data);
            createSegmentsFromData(data);
            segments = Array.from(document.querySelectorAll('.segment'));

            // Add timeupdate event listener after segments are loaded
            audioPlayer.addEventListener('timeupdate', updateActiveSegment);
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });

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
            return currentTime >= start && currentTime <= end;
        });

        if (activeSegment) {
            activeSegment.classList.add('active');
            // Optional: Scroll the segment into view
            // activeSegment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});

function createSegmentsFromData(data) {
    // TODO: Implement segment creation logic
    console.log('Creating segments from data:', data);

    // Example: create a simple div for each segment
    const container = document.getElementById('segments-container');
    container.innerHTML = ''; // Clear previous content

    data.segments.forEach((segment, index) => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment';
        segmentDiv.textContent = segment.text;
        segmentDiv.setAttribute('data-start', segment.start);
        segmentDiv.setAttribute('data-end', segment.end);
        // segmentDiv.textContent = `Segment ${index + 1}: ${segment.start.toFixed(2)}s - ${segment.end.toFixed(2)}s`;
        container.appendChild(segmentDiv);
    });
}