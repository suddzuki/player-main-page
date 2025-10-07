const audio = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn i');
const redoBtn = document.querySelector('.redo-btn i');
const titleEl = document.querySelector('.title');
const authorEl = document.querySelector('.author');
const progressFill = document.querySelector('.progress-fill')
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const progressBar = document.querySelector('.progress-bar');
const volumeBtn = document.querySelector('.volume-btn i');
const volumeLevel = document.querySelector('.volume-level');
const volumeTrack = document.querySelector('.volume-track');



audio.src = currentTrack.src;
titleEl.textContent = currentTrack.title;
authorEl.textContent = currentTrack.author;

audio.addEventListener('loadedmetadata', () => {
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60);
    totalTimeEl.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
});


playBtn.parentElement.addEventListener('click', () => {
    if (audio.paused) {
        console.log("sosi bibu");
        audio.play();
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
    } else {
        console.log("sosi sisu");
        audio.pause();
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
    }
});


audio.addEventListener('timeupdate', () => {
    if (audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;

        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60);
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    }
});


progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

volumeBtn.parentElement.addEventListener('click', () => {
    if (audio.muted) {
        audio.muted = false;
        volumeBtn.className = 'fas fa-volume-high';
        volumeLevel.style.width = `${audio.volume * 100}%`;
    } else {
        audio.muted = true;
        volumeBtn.className = 'fas fa-volume-mute';
        volumeLevel.style.width = '0%';
    }
});


volumeTrack.addEventListener('click', (e) => {
    const width = volumeTrack.clientWidth;
    const clickX = e.offsetX;
    const volume = (clickX / width);

    audio.volume = volume;
    audio.muted = false;
    volumeBtn.className = 'fas fa-volume-high';
    volumeLevel.style.width = `${volume * 100}%`;
})

redoBtn.parentElement.addEventListener('click', (e) => {
    audio.currentTime = 0
    audio.play();
})