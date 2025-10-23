const tabManager = {
    navList: null,
    tabsContainer: null,
    tabLinks: null,
    tabPanes: null,

    init: function () {
        this.navList = document.querySelector('.nav-ul');
        this.tabsContainer = document.querySelector('.tabs');

        this.tabLinks = this.navList.querySelectorAll('a');
        this.tabPanes = this.tabsContainer.querySelectorAll('.tab-pane');

        this.navList.addEventListener('click', (event) => {
            this.switchTab(event);
        });
    },

    switchTab: function (event) {
        const clickedLink = event.target.closest('a');
        if (!clickedLink) return
        event.preventDefault();

        let targetId = null;
        for (const cls of clickedLink.classList) {
            if (document.getElementById(cls)) {
                targetId = cls;
                break;
            }
        }
        if (!targetId) return;

        this.tabLinks.forEach(link => link.classList.remove('active'));
        this.tabPanes.forEach(pane => pane.classList.remove('active'));

        clickedLink.classList.add('active');
        this.tabsContainer.querySelector(`#${targetId}`).classList.add('active');

    }
}

const ui = {
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


    nextBtn:null,
    prevBtn:null,


    updateTrackDisplay: function (track) {
        this.titleEl.textContent = track.title;
        this.authorEl.textContent = track.author;
    },

    updateVolIcon: function (isMuted, currentVolume) {
        if (!isMuted) {
            this.volumeBtn.className = 'fas fa-volume-high';
            this.volumeLevel.style.width = `${currentVolume * 100}%`;
        } else {
            this.volumeBtn.className = 'fas fa-volume-mute';
            this.volumeLevel.style.width = '0%';
        }
    },
    updatePlayIcon: function (isPaused) {
        if (!isPaused) {
            this.playBtn.classList.remove('fa-play');
            this.playBtn.classList.add('fa-pause');
        } else {
            this.playBtn.classList.remove('fa-pause');
            this.playBtn.classList.add('fa-play');
        }

    },

    updateProgress: function (currentTime, duration) {
        if (duration > 0) {
            const percent = (currentTime / duration) * 100;
            this.progressFill.style.width = `${percent}%`;
            this.updateTimeDisplay(currentTime, duration);
        }

    },


    updateTimeDisplay: function (currentTime, duration) {
        const formatTime = (timeInSeconds) => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        this.currentTimeEl.textContent = formatTime(currentTime);
        if (duration) {
            this.totalTimeEl.textContent = formatTime(duration);
        }
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

    init: function (playerObject) {
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
        this.prevBtn = document.querySelector('.prev-track-btn i');
        this.nextBtn = document.querySelector('.next-track-btn i');

        playerObject.audio.addEventListener('play', () => this.updatePlayIcon(false));
        playerObject.audio.addEventListener('pause', () => this.updatePlayIcon(true));
        playerObject.audio.addEventListener('timeupdate', () => {
            this.updateProgress(playerObject.audio.currentTime, playerObject.audio.duration);
        });
        playerObject.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay(playerObject.audio.currentTime, playerObject.audio.duration);
            this.updateTrackDisplay(playerObject.currentTrack);
            this.updateVolIcon(player.audio.muted, playerObject.audio.volume);
        });

        this.playBtn.parentElement.addEventListener('click', () => {
            playerObject.togglePlay();
        });

        this.progressBar.addEventListener('click', (e) => {
            playerObject.ClickOnBar(e, this.progressBar.clientWidth);
        });

        this.volumeBtn.parentElement.addEventListener('click', () => {
            playerObject.ToggleVol();
        });

        playerObject.audio.addEventListener('volumechange', () => {
            this.updateVolIcon(player.audio.muted, playerObject.audio.volume);
        })

        this.volumeTrack.addEventListener('click', (e) => {
            const barWidht = this.volumeTrack.clientWidth;
            const clickX = e.offsetX;
            const newVolume = clickX / barWidht;
            playerObject.setVolume(newVolume);
        })

        this.redoBtn.parentElement.addEventListener('click', () => {
            playerObject.replay();
        })

        this.nextBtn.parentElement.addEventListener('click', () => {
            playerObject.nextTrack();
        })

        this.prevBtn.parentElement.addEventListener('click', () => {
            playerObject.prevTrack();
        })
    }

}

const player = {
    audio: null,
    tracks: [],
    currentTrackIndex: 0,
    currentTrack: null,
    audioCtx: null, 
    analyser: null,
    source: null,   

    setupAudioContext: function() {
        if (this.audioCtx) return; 
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.source = this.audioCtx.createMediaElementSource(this.audio);
        this.analyser = this.audioCtx.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        visualizer.init(this.analyser);
    },

    nextTrack: function() {
        this.setupAudioContext();
        if (this.currentTrackIndex < this.tracks.length - 1) {
            this.currentTrackIndex++;
        } else {
            this.currentTrackIndex = 0;
        }
        this.loadTrack(this.currentTrackIndex);
        this.play();
    },

    prevTrack: function() {
        this.setupAudioContext(); 
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
        } else {
            this.currentTrackIndex = this.tracks.length - 1;
        }
        this.loadTrack(this.currentTrackIndex);
        this.play();
    },

    setVolume: function (newVolume) {
        if (newVolume < 0) newVolume = 0;
        if (newVolume > 1) newVolume = 1;
        if(this.audio) {
            this.audio.muted = false;
            this.audio.volume = newVolume;
        }
    },

    loadTracks: async function () {
        try {
            const response = await fetch('/api/songs');
            if (!response.ok) {
                throw new Error(`err: ${response.status}`);
            }
            
            const tracksPaths = await response.json();
            this.tracks = tracksPaths.map(path => {
                const filename = path.split('/').pop().replace('.mp3', '');
                const parts = filename.split(' - ');
                let author, title;

                if (parts.length > 1) {
                    author = parts[0].trim();
                    title = parts[1].trim();
                } else {
                    author = "Unknown artist";
                    title = filename;
                }

                return {
                    src: path,
                    title: title,
                    author: author
                };
            });

            if (this.tracks && this.tracks.length > 0){
                this.loadTrack(0);
            } else {
                this.currentTrack = { title: "треки не найдены", author: "сервер", src: ""};
            }
        } 
         catch (error) {
            this.currentTrack = { title: "ошибка загрузки", author: "проверьте консоль", src: ""};
        }   
    },

    loadTrack: function(index){
        if (index >= 0 && index < this.tracks.length){
            this.currentTrackIndex = index;
            this.currentTrack = this.tracks[this.currentTrackIndex];
            this.audio.src = this.currentTrack.src;
        }
    },

    play: function () {
        this.audio.play();
    },

    pause: function () {
        this.audio.pause();
    },

    mute: function () {
        this.audio.muted = true;
    },

    unmute: function () {
        this.audio.muted = false;
    },

    ToggleVol: function () {
        if (!this.audio.muted) {
            this.mute();
        } else {
            this.unmute();
        }
    },

    togglePlay: function () {
        this.setupAudioContext();
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    },

    ClickOnBar: function (e, barWidht) {
        const clickX = e.offsetX;
        this.audio.currentTime = (clickX / barWidht) * this.audio.duration;
    },

    replay: function () {
        this.setupAudioContext();
        this.audio.currentTime = 0
        this.play();
    },

    init: function () {
        this.audio = document.getElementById('audio-player');
        this.audio.crossOrigin = "anonymous";
    }
}

const visualizer = {
    analyser: null,
    dataArray: null,
    bufferLength: 0,

    playerContentEl: null,
    backgroundEl: null,

    BEAT_THRESHOLD: 220,
    LAST_BEAT_TRIGGER: 0,
    COOLDOWN : 150,
    ANALYSER_FFT_SIZE : 2048,

    init: function(playerAnalyser) {
        this.analyser = playerAnalyser;
        this.playerContentEl = document.querySelector('.player-content');
        this.backgroundEl = document.querySelector('.background-fx');

        this.analyser.fftSize = ANALYSER_FFT_SIZE;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.playerContentEl.addEventListener('animationend', () => {
            this.playerContentEl.classList.remove('shake');
        });

        this.draw();
    },

    updateBackground: function() {
        if (!this.dataArray || !this.backgroundEl) return;
        const bassValue = (this.dataArray[0] + this.dataArray[1] + this.dataArray[2]) / 3;

        if (bassValue > this.beatThreshold - 20) {
            this.backgroundEl.style.opacity = '0.8';
        } else {
            this.backgroundEl.style.opacity = '0.5';
        }

        const midValue = this.dataArray[Math.floor(this.bufferLength / 4)];
        const maxBlur = 10;
        const blurAmount = Math.max(0, maxBlur - (midValue / 255) * maxBlur);
        this.backgroundEl.style.filter = `blur(${blurAmount}px)`;
    },

    checkForBeat: function() {
        if (!this.dataArray || !this.playerContentEl) return;
        const now = Date.now();
        if (now - this.lastBeatTime < this.beatCooldown) {
            return;
        }
        const bassValue = (this.dataArray[0] + this.dataArray[1] + this.dataArray[2]) / 3;
        if (bassValue > this.beatThreshold) {
            this.playerContentEl.classList.add('shake');
            this.lastBeatTime = now;
        }
    },

    draw: function() {
        requestAnimationFrame(() => this.draw());

        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(this.dataArray);
        
        this.checkForBeat();
        this.updateBackground();
    }
};


document.addEventListener('DOMContentLoaded',  async function () {
    tabManager.init();
    player.init();
    await player.loadTracks();
    ui.init(player);
});





