// DOM Elements
const videoContainer = document.querySelector('.video-container');
const video = document.getElementById('video');
const image = document.getElementById('image');
const tabs = document.querySelectorAll('.tab');
const loadingScreen = document.getElementById('loading-screen');

// State Variables
let currentTab = 0;
let currentVideoIndex = 0;
let startX = 0, startY = 0;
let endX = 0, endY = 0;

// Media Content Data
const contentToDisplay = [
  ['newvideo.mp4', 'oldvideo.mp4', 'pertat.mp4'],  // Tab 1 content
  ['oldvideo.mp4', 'newvideo.mp4'],                // Tab 2 content
  ['pertat.mp4', 'newvideo.mp4', 'newvideo.mp4'],  // Tab 3 content
  ['image01.jpg','image02.jpg'],                   // Tab 4 images
  ['image03.jpg','image06.jpg'],                   // Tab 5 images
];

// Initialize the first content
window.addEventListener('load', function() {
  loadContent(currentTab, currentVideoIndex);
});

// Event Listeners
videoContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
videoContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
tabs.forEach((tab, index) => tab.addEventListener('click', () => switchTab(index)));

// Load Content based on current tab and content index
function loadContent(tabIndex, contentIndex) {
  const currentContent = contentToDisplay[tabIndex][contentIndex];
  const isVideo = currentContent.endsWith('.mp4');

  if (isVideo) {
    video.src = currentContent;
    video.style.display = 'block';
    image.style.display = 'none';
    video.load();
  } else {
    image.src = currentContent;
    video.style.display = 'none';
    image.style.display = 'block';
    loadingScreen.style.display = 'none';
  }

  if (isVideo) {
    video.addEventListener('canplaythrough', function() {
      loadingScreen.style.display = 'none';
      video.style.display = 'block';
    });

    // Fallback in case 'canplaythrough' event doesn't fire
    setTimeout(function() {
      loadingScreen.style.display = 'none';
      video.style.display = 'block';
    }, 10000); // 10 seconds timeout as a fallback
  } else {
    // If it's an image, show it immediately
    loadingScreen.style.display = 'none';
    image.style.display = 'block';
  }
}

// Handle Swipe Gestures
function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  endX = event.changedTouches[0].clientX;
  endY = event.changedTouches[0].clientY;
  handleSwipe();
}

// Handle Swipe Direction
function handleSwipe() {
  const deltaX = startX - endX;
  const deltaY = startY - endY;
  const threshold = 50; // Minimum distance for a swipe

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
    deltaX > 0 ? switchTab(currentTab + 1) : switchTab(currentTab - 1);
  } else if (Math.abs(deltaY) > threshold) {
    deltaY > 0 ? switchContent(currentVideoIndex + 1) : switchContent(currentVideoIndex - 1);
  }
}

// Switch Tab
function switchTab(index) {
  if (index < 0 || index >= tabs.length) return;

  currentTab = index;
  currentVideoIndex = 0; // Reset content index when switching tabs
  loadContent(currentTab, currentVideoIndex);

  tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
}

// Switch Content within the Current Tab
function switchContent(index) {
  if (index < 0 || index >= contentToDisplay[currentTab].length) return;

  currentVideoIndex = index;
  loadContent(currentTab, currentVideoIndex);
}

// Handle Infinite Scrolling within the Current Tab
video.addEventListener('ended', () => switchContent(currentVideoIndex + 1));
