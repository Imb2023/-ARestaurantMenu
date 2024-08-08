const videoContainer = document.querySelector('.video-container');
const video = document.getElementById('video');
const tabs = document.querySelectorAll('.tab');
let currentTab = 0;
let currentVideoIndex = 0;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// Sample video data for each tab (replace with actual video sources)
const videoData = [
  ['newvideo.mp4', 'oldvideo.mp4', 'pertat.mp4'],   // Tab 1 videos
  ['oldvideo.mp4', 'newvideo.mp4'],           // Tab 2 videos
  ['pertat.mp4', 'newvideo.mp4', 'newvideo.mp4']  // Tab 3 videos
];

function loadVideo(tabIndex, videoIndex) {
  video.src = videoData[tabIndex][videoIndex];
  video.load();
}

loadVideo(currentTab, currentVideoIndex);

// Event listeners for swipe gestures
videoContainer.addEventListener('touchstart', (event) => {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

videoContainer.addEventListener('touchend', (event) => {
  endX = event.changedTouches[0].clientX;
  endY = event.changedTouches[0].clientY;
  handleSwipe();
});

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    switchTab(index);
  });
});

function handleSwipe() {
  const deltaX = startX - endX;
  const deltaY = startY - endY;
  const threshold = 50; // Minimum distance for a swipe

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      // Swipe left detected
      switchTab(currentTab + 1);
    } else {
      // Swipe right detected
      switchTab(currentTab - 1);
    }
  } else if (Math.abs(deltaY) > threshold) {
    if (deltaY > 0) {
      // Swipe up detected
      switchVideo(currentVideoIndex + 1);
    }
  }
}

function switchTab(index) {
  if (index < 0 || index >= tabs.length) return;
  
  currentTab = index;
  currentVideoIndex = 0; // Reset video index when switching tabs
  loadVideo(currentTab, currentVideoIndex);

  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

function switchVideo(index) {
  if (index < 0 || index >= videoData[currentTab].length) return;

  currentVideoIndex = index;
  loadVideo(currentTab, currentVideoIndex);
}

// Infinite scrolling within the current tab
video.addEventListener('ended', () => {
  switchVideo(currentVideoIndex + 1);
});
