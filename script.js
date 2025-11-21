const audio = new Audio();
let currentSong = "";

function playSong(src) {
  currentSong = src;
  audio.src = src;
  audio.play();

  const display = document.getElementById("nowPlaying");
  display.textContent = "Now Playing: " + src.split("/").pop();
}

function playAudio() {
  if (currentSong === "") return;
  audio.play();
}

function pauseAudio() {
  audio.pause();
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
}

// Ambil lagu dari URL
const urlParams = new URLSearchParams(window.location.search);
const songParam = urlParams.get("song");

// Data lagu
const songs = {
  "less_of_you": {
    src: "songs/less_of_you.mp3",
    title: "Less of You",
    cover: "https://i.scdn.co/image/ab67616d0000b273617997bc09bb7fa23624eff5"
  },
  "get_it": {
    src: "songs/get_it.mp3",
    title: "GET IT",
    cover: "https://i.scdn.co/image/ab67616d0000b273617997bc09bb7fa23624eff5"
  },
  "bodies": {
    src: "songs/bodies.mp3",
    title: "Bodies",
    cover: "https://i.scdn.co/image/ab67616d0000b273617997bc09bb7fa23624eff5"
  }
};

// Jika halaman player dibuka dengan ?song=
if (songParam && songs[songParam]) {
  const song = songs[songParam];
  audio.src = song.src;

  document.getElementById("nowPlaying").textContent = "Now Playing: " + song.title;

  document.querySelector(".player-cover").src = song.cover;
}