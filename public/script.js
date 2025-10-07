
const player = {
    audio: null,
    playBtn: null,
    redoBtn: null,
    titleEl: null,
    authorEl: null,
    progressFill: null,
    currentTimeEl: null,
    totalTimeEl: null,
    progressBar: null,
    volumeBtn: null,
    volumeLevel: null,
    volumeTrack: null,


    currentTrack: {
        title: "BIG FAIL",
        author: "dmtboy",
        src: "content/tracks/track1.mp3"
    },

    play: function () {
        this.audio.play();
        this.updatePlayIcon();
    },

    pause: function () {
        this.audio.pause();
        this.updatePlayIcon();
    },

    mute: function () {
        this.audio.muted = true;
        this.updateVolIcon();
    },


    unmute: function () {
        this.audio.muted = false;
        this.updateVolIcon();
    },

    TotalTime: function () {
        const totalMinutes = Math.floor(this.audio.duration / 60);
        const totalSeconds = Math.floor(this.audio.duration % 60);
        this.totalTimeEl.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
    },

    CurrentTime: function () {
        const currentMinutes = Math.floor(this.audio.currentTime / 60);
        const currentSeconds = Math.floor(this.audio.currentTime % 60);
        this.currentTimeEl.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    },

    displayTrackInfo: function () {
        this.audio.addEventListener('loadedmetadata', () => {
            this.TotalTime();
        });
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.duration > 0) {
                this.updateProgress();
            }
        })
    },


    ToggleVol: function () {
        if (!this.audio.muted) {
            this.mute();
        } else {
            this.unmute();
        }
    },

    updateVolIcon: function () {
        if (!this.audio.muted) {
            this.volumeBtn.className = 'fas fa-volume-high';
            this.volumeLevel.style.width = `${this.audio.volume * 100}%`;
        } else {
            this.volumeBtn.className = 'fas fa-volume-mute';
            this.volumeLevel.style.width = '0%';
        }
    },


    updatePlayIcon: function () {
        if (!this.audio.paused) {
            this.playBtn.classList.remove('fa-play');
            this.playBtn.classList.add('fa-pause');
        } else {
            this.playBtn.classList.remove('fa-pause');
            this.playBtn.classList.add('fa-play');
        }

    },




    togglePlay: function () {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    },



    updateProgress: function () {
        if (this.audio.duration > 0) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${percent}%`;
            const currentMinutes = Math.floor(this.audio.currentTime / 60);
            const currentSeconds = Math.floor(this.audio.currentTime % 60);
            this.currentTimeEl.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
        }

    },


    ClickOnBar: function (e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    },


    replay: function () {
        this.audio.currentTime = 0
        this.play();
    },

    setVolume: function (e) {
        const width = this.volumeTrack.clientWidth;
        const clickX = e.offsetX;
        const volume = (clickX / width);
        this.audio.muted = false;
        this.audio.volume = volume;
        this.updateVolIcon();
        this.volumeLevel.style.width = `${volume * 100}%`;

    },
    init: function () {
        this.audio = document.getElementById('audio-player');
        this.playBtn = document.querySelector('.play-btn i');
        this.redoBtn = document.querySelector('.redo-btn i');
        this.titleEl = document.querySelector('.title');
        this.authorEl = document.querySelector('.author');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
        this.progressBar = document.querySelector('.progress-bar');
        this.volumeBtn = document.querySelector('.volume-btn i');
        this.volumeLevel = document.querySelector('.volume-level');
        this.volumeTrack = document.querySelector('.volume-track');

        this.audio.src = this.currentTrack.src;
        this.titleEl.textContent = this.currentTrack.title;
        this.authorEl.textContent = this.currentTrack.author;

        this.displayTrackInfo();

        this.playBtn.parentElement.addEventListener('click', () => {
            this.togglePlay();
        });


        this.progressBar.addEventListener('click', (e) => {
            this.ClickOnBar(e);
        });

        this.volumeBtn.parentElement.addEventListener('click', () => {
            this.ToggleVol();
        });


        this.volumeTrack.addEventListener('click', (e) => {
            this.setVolume(e);
        })

        this.redoBtn.parentElement.addEventListener('click', () => {
            this.replay();
        })
    }
}


