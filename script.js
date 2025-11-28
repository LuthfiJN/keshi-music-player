const audio = new Audio();
let currentIndex = 0;

// DATA LAGU
const songs = [
  {
    key: "less_of_you",
    src: "songs/less_of_you.mp3",
    cover: "https://t2.genius.com/unsafe/430x430/https://images.genius.com/dcb25abe0006dc118895eb4bd9e35048.758x758x1.jpg",
    title: "Less of You"
  },
  {
    key: "get_it",
    src: "songs/get_it.mp3",
    cover: "https://t2.genius.com/unsafe/430x430/https://images.genius.com/be47acaddfb8ec3ac2bd730d3bca3107.758x758x1.png",
    title: "GET IT"
  },
  {
    key: "bodies",
    src: "songs/bodies.mp3",
    cover: "https://t2.genius.com/unsafe/430x430/https://images.genius.com/77b0d1b460d9ba4d1388aad0722a8188.1000x1000x1.png",
    title: "Bodies"
  },
  {
    key: "soft_spot",
    src: "songs/soft_spot.mp3",
    cover: "https://t2.genius.com/unsafe/430x430/https%3A%2F%2Fimages.genius.com%2F1dbec992d75e6a0e421cd4cd7f16f0f0.1000x1000x1.png",
    title: "Soft Spot"
  },
  {
    key: "angostura",
    src: "songs/angostura.mp3",
    cover: "https://images.genius.com/f32ac1593580fec02b66588395f9b3b1.1000x1000x1.png",
    title: "ANGOSTURA"
  }
];

// INISIALISASI ELEMEN DOM
const progressBar = document.getElementById("progressBar");
const playPauseBtn = document.getElementById("playPauseButton");
const volumeSlider = document.getElementById("volumeSlider");

const songSelectorDisplay = document.getElementById("songSelectorDisplay");
const songSelectorList = document.getElementById("songSelectorList");
const lyricSelectorDisplay = document.getElementById("lyricSelectorDisplay");
const lyricSelectorList = document.getElementById("lyricSelectorList");


// Mencari index lagu
function findSongIndex(key) {
  return songs.findIndex(s => s.key === key);
}

// Formatting waktu MM:SS
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// FUNGSI LIRIK 
function showLyricsFor(key) {
    const lyricsContainer = document.getElementById("displayedLyrics");
    
    if (!key) {
        lyricsContainer.innerHTML = '<p>Pilih lagu di atas untuk menampilkan lirik dan memutar.</p>';
        if (lyricSelectorDisplay) lyricSelectorDisplay.textContent = "Select a Song for Lyrics"; 
        return;
    }

    const lyricsTemplate = document.getElementById("template-lyrics");
    if (!lyricsTemplate) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = lyricsTemplate.innerHTML;
    
    const selectedLyricElement = tempDiv.querySelector("#lyrics-" + key);
    
    if (selectedLyricElement) {
        lyricsContainer.innerHTML = selectedLyricElement.innerHTML;
        
        const selectedSong = songs.find(s => s.key === key);
        if (lyricSelectorDisplay && selectedSong) {
            lyricSelectorDisplay.textContent = selectedSong.title;
        }
        
        lyricsContainer.scrollTop = 0; // Reset scroll lirik
    } else {
        lyricsContainer.innerHTML = '<p>Lirik untuk lagu ini tidak ditemukan.</p>';
        if (lyricSelectorDisplay) lyricSelectorDisplay.textContent = "Select a Song for Lyrics";
    }
}


// KONTROL PLAYER & SINKRONISASI DROPDOWN 
function updateControlStatus(isPlaying) {
    if (playPauseBtn) {
        playPauseBtn.innerHTML = isPlaying ? "⏸️" : "▶️";
    }
}

function updateDropdownStatus(key) {
    const selectedSong = songs.find(s => s.key === key);
    if (!selectedSong) return;

    const title = selectedSong.title;

    if (songSelectorDisplay) songSelectorDisplay.textContent = title;
    if (lyricSelectorDisplay) lyricSelectorDisplay.textContent = title;

    // Update status 'active' pada list item
    [songSelectorList, lyricSelectorList].forEach(list => {
        if (list) {
            list.querySelectorAll('li').forEach(item => {
                item.classList.remove('active');
            });
            const activeItem = list.querySelector(`li[data-key="${key}"]`);
            if (activeItem) activeItem.classList.add('active');
        }
    });
}

function playSongByIndex(index) {
    const song = songs[index];
    currentIndex = index;

    audio.src = song.src;
    audio.play();

    document.querySelector(".player-cover").src = song.cover;
    document.getElementById("nowPlaying").textContent = "Now Playing: " + song.title;

    updateDropdownStatus(song.key);
    updateControlStatus(true);
    showLyricsFor(song.key);
}

function playSong(key) {
    const index = findSongIndex(key);
    if (index !== -1) playSongByIndex(index);
}

function togglePlayPause() {
    if (audio.paused || audio.ended) {
        if (!audio.src || audio.currentTime === 0) {
            playSongByIndex(currentIndex);
        } else {
            audio.play();
            updateControlStatus(true);
        }
    } else {
        audio.pause();
        updateControlStatus(false);
    }
}

function stopAudio() { 
    audio.pause(); 
    audio.currentTime = 0; 
    updateControlStatus(false); 
    
    const currentTimeDisplay = document.getElementById("currentTime");
    if (currentTimeDisplay) currentTimeDisplay.textContent = "0:00";
}

function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    playSongByIndex(currentIndex);
}

function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSongByIndex(currentIndex);
}

audio.addEventListener("ended", nextSong);


// PROGRESS BAR, WAKTU & VOLUME 

audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    if (progressBar) progressBar.value = percent || 0;

    const currentTimeDisplay = document.getElementById("currentTime");
    const durationTimeDisplay = document.getElementById("durationTime");

    if (currentTimeDisplay && durationTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        if (audio.duration) {
            durationTimeDisplay.textContent = formatTime(audio.duration);
        }
    }
});

audio.addEventListener('loadedmetadata', () => {
    const durationTimeDisplay = document.getElementById("durationTime");
    if (durationTimeDisplay) {
        durationTimeDisplay.textContent = formatTime(audio.duration);
    }
});

if (progressBar) {
    progressBar.addEventListener("input", () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });
}

if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
    });
    audio.volume = volumeSlider.value; 
}


// INJEKSI CUSTOM DROPDOWN LIST ITEM 

function createDropdownList(listElement, displayElement, clickHandler) {
    if (!listElement || !displayElement) return;

    listElement.innerHTML = '';
    
    songs.forEach(song => {
        const listItem = document.createElement('li');
        listItem.textContent = song.title;
        listItem.dataset.key = song.key;
        
        listItem.addEventListener('click', () => {
            clickHandler(song.key);
            listElement.classList.remove('open');
            updateDropdownStatus(song.key); 
        });
        listElement.appendChild(listItem);
    });

    // Toggle dropdown saat display diklik
    displayElement.addEventListener('click', () => {
        listElement.classList.toggle('open');
    });
}

function initializeDropdowns() {
    // Dropdown Lagu (memutar lagu)
    createDropdownList(songSelectorList, songSelectorDisplay, playSong);

    // Dropdown Lirik (hanya menampilkan lirik)
    createDropdownList(lyricSelectorList, lyricSelectorDisplay, showLyricsFor);
}

// Global Listener untuk menutup dropdown saat klik di luar 
document.addEventListener('click', (event) => {
    // Mendapatkan container terdekat untuk lagu dan lirik
    const songContainer = event.target.closest('.custom-dropdown-container');
    
    if (songSelectorList && songSelectorList.classList.contains('open') && songContainer?.querySelector('#songSelectorList') !== songSelectorList) {
        songSelectorList.classList.remove('open');
    }
    if (lyricSelectorList && lyricSelectorList.classList.contains('open') && songContainer?.querySelector('#lyricSelectorList') !== lyricSelectorList) {
        lyricSelectorList.classList.remove('open');
    }
});


// INISIALISASI UTAMA 
function initializePlayer() {
    initializeDropdowns();
    
    const params = new URLSearchParams(window.location.search);
    const songParam = params.get("song");

    if (songParam) {
        const index = findSongIndex(songParam);
        if (index !== -1) {
            playSongByIndex(index);
        }
    } else if (songs.length > 0) {
        // Set lagu pertama sebagai default
        currentIndex = 0;
        updateDropdownStatus(songs[0].key);
        showLyricsFor(songs[0].key);
    }
}

document.addEventListener('DOMContentLoaded', initializePlayer);
