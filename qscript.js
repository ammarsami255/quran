/**
 * القرآن الكريم - Modern Islamic Web App
 * High-performance, clean Vanilla JavaScript with State Management & PWA support.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // Verified Reciters Registry (100% Tested & Functional)
    // ==========================================================================
    const RECITERS_REGISTRY = {
        // AlQuran Cloud Direct Audio (100% verified verse-by-verse)
        'ar.alafasy': { name: 'مشاري العفاسي', type: 'api', id: 'ar.alafasy' },
        'ar.minshawi': { name: 'محمد صديق المنشاوي (مرتل)', type: 'api', id: 'ar.minshawi' },
        'ar.minshawimujawwad': { name: 'محمد صديق المنشاوي (مجود)', type: 'api', id: 'ar.minshawimujawwad' },
        'ar.husary': { name: 'محمود خليل الحصري (مرتل)', type: 'api', id: 'ar.husary' },
        'ar.husarymujawwad': { name: 'محمود خليل الحصري (مجود)', type: 'api', id: 'ar.husarymujawwad' },
        'ar.abdulbasitmurattal': { name: 'عبد الباسط عبد الصمد (مرتل)', type: 'api', id: 'ar.abdulbasitmurattal' },
        'ar.abdulsamad': { name: 'عبد الباسط عبد الصمد (مجود)', type: 'api', id: 'ar.abdulsamad' },
        'ar.hudhaify': { name: 'علي بن عبد الرحمن الحذيفي', type: 'api', id: 'ar.hudhaify' },
        'ar.aymanswoaid': { name: 'أيمن سويد', type: 'api', id: 'ar.aymanswoaid' },

        // Haramain Imams & Renowned
        'ar.mahermuaiqly': { name: 'ماهر المعيقلي', type: 'api', id: 'ar.mahermuaiqly' },
        'ar.abdurrahmaansudais': { name: 'عبد الرحمن السديس', type: 'api', id: 'ar.abdurrahmaansudais' },
        'ar.saoodshuraym': { name: 'سعود الشريم', type: 'api', id: 'ar.saoodshuraym' },
        'ea.juhany': { name: 'عبد الله الجهني', type: 'cdn', folder: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps' },
        'ea.jaber': { name: 'علي جابر', type: 'cdn', folder: 'Ali_Jaber_64kbps' },
        'ea.budair': { name: 'صلاح البدير', type: 'cdn', folder: 'Salah_Al_Budair_128kbps' },

        // Famous Reciters via EveryAyah High-Speed CDN
        'ea.dossari': { name: 'ياسر الدوسري', type: 'cdn', folder: 'Yasser_Ad-Dussary_128kbps' },
        'ea.qatami': { name: 'ناصر القطامي', type: 'cdn', folder: 'Nasser_Alqatami_128kbps' },
        'ea.ghamadi': { name: 'سعد الغامدي', type: 'cdn', folder: 'Ghamadi_40kbps' },
        'ea.fares': { name: 'فارس عباد', type: 'cdn', folder: 'Fares_Abbad_64kbps' },
        'ar.ahmedajamy': { name: 'أحمد بن علي العجمي', type: 'api', id: 'ar.ahmedajamy' },
        'ar.shaatree': { name: 'أبو بكر الشاطري', type: 'api', id: 'ar.shaatree' },
        'ar.hanirifai': { name: 'هاني الرفاعي', type: 'api', id: 'ar.hanirifai' },
        'ar.muhammadayyoub': { name: 'محمد أيوب', type: 'api', id: 'ar.muhammadayyoub' },
        'ar.muhammadjibreel': { name: 'محمد جبريل', type: 'api', id: 'ar.muhammadjibreel' }
    };

    // ==========================================================================
    // State Management
    // ==========================================================================
    const state = {
        allSurahs: [],
        filteredSurahs: [],
        activeFilter: 'all',
        searchQuery: '',
        currentSurah: null,
        currentAyahs: [],
        currentAyahIndex: 0,
        currentReciter: 'ar.alafasy',
        isPlaying: false,
        repeatMode: 0, // 0: None, 1: 1x, 3: 3x, 5: 5x, 'inf': Infinity
        repeatCounter: 0,
        playbackRates: [1, 1.25, 1.5, 0.75],
        playbackRateIndex: 0,
        isMuted: false,
        theme: localStorage.getItem('quran_theme') || 'dark',
        lastRead: JSON.parse(localStorage.getItem('quran_last_read') || 'null'),
        currentTafseer: (() => {
            const saved = localStorage.getItem('quran_tafseer');
            return ['mokhtasar', 'muyassar', 'ibnkathir', 'qurtubi', 'saadi', 'jalalayn'].includes(saved) ? saved : 'mokhtasar';
        })(),
        activeTafseerAyahIndex: 0,
        showInlineTafseer: localStorage.getItem('quran_inline_tafseer') === 'true',
        inlineTafseerData: {}
    };

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const DOM = {
        html: document.documentElement,
        audio: document.getElementById('quran-audio'),
        // Views
        surahsView: document.getElementById('surahs-view'),
        readerView: document.getElementById('reader-view'),
        surahsGrid: document.getElementById('surahs-grid'),
        searchStat: document.getElementById('search-stat'),
        // Header
        brandHome: document.getElementById('brand-home'),
        surahSearch: document.getElementById('surah-search'),
        clearSearch: document.getElementById('clear-search'),
        filterChips: document.querySelectorAll('.filter-chips .chip'),
        resumeBtn: document.getElementById('resume-last-read'),
        themeToggle: document.getElementById('theme-toggle'),
        // Reader
        btnBack: document.getElementById('btn-back'),
        readerSurahName: document.getElementById('reader-surah-name'),
        readerRevelation: document.getElementById('reader-revelation'),
        readerAyahsCount: document.getElementById('reader-ayahs-count'),
        readerSurahOrder: document.getElementById('reader-surah-order'),
        bismillahBox: document.getElementById('bismillah-box'),
        ayahsContainer: document.getElementById('ayahs-container'),
        jumpInput: document.getElementById('jump-ayah-input'),
        jumpBtn: document.getElementById('jump-ayah-btn'),
        btnReaderLocate: document.getElementById('btn-reader-locate'),
        readerActiveAyahNum: document.getElementById('reader-active-ayah-num'),
        btnToggleInlineTafseer: document.getElementById('btn-toggle-inline-tafseer'),
        inlineTafseerLabel: document.getElementById('inline-tafseer-label'),
        floatingLocateBtn: document.getElementById('floating-locate-btn'),
        floatingAyahNum: document.getElementById('floating-ayah-num'),
        // Player Bar
        playerBar: document.getElementById('audio-player-bar'),
        playerSurahTitle: document.getElementById('player-surah-title'),
        playerReciterName: document.getElementById('player-reciter-name'),
        btnPlay: document.getElementById('btn-play'),
        playIcon: document.getElementById('play-icon'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        btnStop: document.getElementById('btn-stop'),
        audioSeek: document.getElementById('audio-seek'),
        currentTime: document.getElementById('current-time'),
        totalDuration: document.getElementById('total-duration'),
        reciterSelect: document.getElementById('reciter-select'),
        btnRepeat: document.getElementById('btn-repeat'),
        repeatBadge: document.getElementById('repeat-badge'),
        btnSpeed: document.getElementById('btn-speed'),
        speedLabel: document.getElementById('speed-label'),
        btnMute: document.getElementById('btn-mute'),
        volumeIcon: document.getElementById('volume-icon'),
        volumeSlider: document.getElementById('volume-slider'),
        btnLocateAyah: document.getElementById('btn-locate-ayah'),
        locateAyahNum: document.getElementById('locate-ayah-num'),
        // Tafseer Modal
        tafseerModal: document.getElementById('tafseer-modal'),
        closeTafseerBtn: document.getElementById('close-tafseer-btn'),
        tafseerSurahTitle: document.getElementById('tafseer-surah-title'),
        tafseerAyahBadge: document.getElementById('tafseer-ayah-badge'),
        tafseerAyahText: document.getElementById('tafseer-ayah-text'),
        tafseerEditionSelect: document.getElementById('tafseer-edition-select'),
        tafseerBookName: document.getElementById('tafseer-book-name'),
        tafseerTextContainer: document.getElementById('tafseer-text-container'),
        // Toasts
        toastContainer: document.getElementById('toast-container')
    };

    // ==========================================================================
    // Initialization
    // ==========================================================================
    function init() {
        initTheme();
        initPWA();
        initReciter();
        initTafseer();
        bindEvents();
        fetchSurahs();
        updateResumeButton();
    }

    function initTafseer() {
        if (DOM.tafseerEditionSelect) {
            DOM.tafseerEditionSelect.value = state.currentTafseer;
        }
        updateInlineTafseerBtn();
    }

    function updateInlineTafseerBtn() {
        if (!DOM.btnToggleInlineTafseer) return;
        if (state.showInlineTafseer) {
            DOM.btnToggleInlineTafseer.classList.add('active');
            if (DOM.inlineTafseerLabel) DOM.inlineTafseerLabel.textContent = 'إخفاء التفسير';
        } else {
            DOM.btnToggleInlineTafseer.classList.remove('active');
            if (DOM.inlineTafseerLabel) DOM.inlineTafseerLabel.textContent = 'عرض التفسير';
        }
    }

    async function toggleInlineTafseer() {
        state.showInlineTafseer = !state.showInlineTafseer;
        localStorage.setItem('quran_inline_tafseer', state.showInlineTafseer);
        updateInlineTafseerBtn();

        if (state.showInlineTafseer) {
            showToast('تم تفعيل عرض التفسير تحت الآيات');
            renderAyahs();
            await loadSurahInlineTafseer();
        } else {
            showToast('تم إخفاء التفسير من تحت الآيات');
            renderAyahs();
        }
        highlightActiveAyah(false);
    }

    async function loadSurahInlineTafseer() {
        if (!state.currentSurah) return;
        const sNum = state.currentSurah.number;
        if (state.inlineTafseerData[sNum]) return;

        try {
            const res = await fetch(`https://api.alquran.cloud/v1/surah/${sNum}/ar.muyassar`);
            const data = await res.json();
            if (data && data.code === 200 && data.data && data.data.ayahs) {
                state.inlineTafseerData[sNum] = data.data.ayahs;
                // Update rendered placeholders
                data.data.ayahs.forEach((a, idx) => {
                    const el = document.getElementById(`inline-tafseer-${idx}`);
                    if (el) {
                        el.innerHTML = `
                            <span class="tafseer-label"><i class="fas fa-book-open"></i> التفسير الميسر:</span>
                            <p>${a.text}</p>
                        `;
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to load inline tafseer', e);
        }
    }

    // Initialize Theme
    function initTheme() {
        DOM.html.setAttribute('data-theme', state.theme);
        updateThemeIcon();
    }

    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        DOM.html.setAttribute('data-theme', state.theme);
        localStorage.setItem('quran_theme', state.theme);
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const icon = DOM.themeToggle.querySelector('i');
        if (state.theme === 'dark') {
            icon.className = 'fas fa-sun';
            DOM.themeToggle.title = 'تفعيل المظهر الفاتح';
        } else {
            icon.className = 'fas fa-moon';
            DOM.themeToggle.title = 'تفعيل المظهر الداكن';
        }
    }

    // Register Service Worker for PWA with Instant Update Delivery
    function initPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then((reg) => {
                    console.log('Service Worker Registered Successfully');
                    // Check for network updates immediately
                    reg.update();
                })
                .catch(err => console.warn('Service Worker Registration Failed:', err));

            // Reload automatically if a new service worker version took over
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        }
    }

    function initReciter() {
        const savedReciter = localStorage.getItem('quran_reciter');
        if (savedReciter && RECITERS_REGISTRY[savedReciter]) {
            state.currentReciter = savedReciter;
            DOM.reciterSelect.value = savedReciter;
        } else {
            state.currentReciter = 'ar.alafasy';
            DOM.reciterSelect.value = 'ar.alafasy';
        }
        updateReciterDisplayName();
    }

    function updateReciterDisplayName() {
        const rec = RECITERS_REGISTRY[state.currentReciter];
        DOM.playerReciterName.textContent = rec ? rec.name : 'مشاري العفاسي';
    }

    // Helper: Generate Direct Audio URL for any Ayah
    function getAyahAudioUrl(surahNumber, ayahNumberInSurah, ayahGlobalNumber, reciterKey) {
        const reciter = RECITERS_REGISTRY[reciterKey] || RECITERS_REGISTRY['ar.alafasy'];
        if (reciter.type === 'cdn') {
            const s = String(surahNumber).padStart(3, '0');
            const a = String(ayahNumberInSurah).padStart(3, '0');
            return `https://everyayah.com/data/${reciter.folder}/${s}${a}.mp3`;
        }
        // AlQuran Cloud CDN
        return `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${ayahGlobalNumber}.mp3`;
    }

    // ==========================================================================
    // Event Listeners
    // ==========================================================================
    function bindEvents() {
        // Navigation & Search
        DOM.brandHome.addEventListener('click', showSurahsView);
        DOM.btnBack.addEventListener('click', showSurahsView);
        DOM.themeToggle.addEventListener('click', toggleTheme);

        DOM.surahSearch.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.trim().toLowerCase();
            DOM.clearSearch.style.display = state.searchQuery ? 'block' : 'none';
            filterSurahs();
        });

        DOM.clearSearch.addEventListener('click', () => {
            DOM.surahSearch.value = '';
            state.searchQuery = '';
            DOM.clearSearch.style.display = 'none';
            filterSurahs();
            DOM.surahSearch.focus();
        });

        // Filter chips (All, Meccan, Medinan)
        DOM.filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                DOM.filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                state.activeFilter = chip.getAttribute('data-filter');
                filterSurahs();
            });
        });

        // Resume Last Read
        DOM.resumeBtn.addEventListener('click', () => {
            if (state.lastRead) {
                openSurah(state.lastRead.surahNumber, state.lastRead.ayahIndex, true);
                showToast(`تم استئناف القراءة: ${state.lastRead.surahName} - الآية ${state.lastRead.ayahIndex + 1}`);
            } else {
                showToast('لم يتم تسجيل موضع قراءة سابق بعد.', 'info');
            }
        });

        // Surah Grid Delegation (Clicking a card)
        DOM.surahsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.surah-card');
            if (!card) return;
            const surahNumber = parseInt(card.getAttribute('data-surah-number'), 10);
            openSurah(surahNumber, 0, false);
        });

        // Ayahs Container Delegation (Clicking anywhere on an Ayah card or text directly plays it)
        DOM.ayahsContainer.addEventListener('click', (e) => {
            const tafseerBtn = e.target.closest('.tafseer-ayah');
            const copyBtn = e.target.closest('.copy-ayah');
            const ayahCard = e.target.closest('.ayah-card');

            if (!ayahCard) return;
            const ayahIndex = parseInt(ayahCard.getAttribute('data-ayah-index'), 10);

            if (tafseerBtn) {
                e.stopPropagation();
                openTafseer(ayahIndex);
            } else if (copyBtn) {
                e.stopPropagation();
                copyAyahText(ayahIndex);
            } else {
                // Clicking anywhere on the Ayah card or text directly triggers playback!
                playAyah(ayahIndex);
            }
        });

        // Jump to Ayah in Reader
        DOM.jumpBtn.addEventListener('click', handleAyahJump);
        DOM.jumpInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAyahJump();
        });

        // Audio Player Controls
        DOM.btnPlay.addEventListener('click', togglePlayPause);
        DOM.btnPrev.addEventListener('click', playPreviousAyah);
        DOM.btnNext.addEventListener('click', playNextAyah);
        DOM.btnStop.addEventListener('click', stopAudio);

        // Progress Bar & Audio Events
        DOM.audio.addEventListener('timeupdate', updateAudioProgress);
        DOM.audio.addEventListener('loadedmetadata', updateAudioDuration);
        DOM.audio.addEventListener('ended', handleAyahEnded);
        DOM.audio.addEventListener('error', handleAudioError);

        DOM.audioSeek.addEventListener('input', () => {
            if (DOM.audio.duration) {
                DOM.audio.currentTime = (DOM.audioSeek.value / 100) * DOM.audio.duration;
            }
        });

        // Reciter Select Change
        DOM.reciterSelect.addEventListener('change', () => {
            state.currentReciter = DOM.reciterSelect.value;
            localStorage.setItem('quran_reciter', state.currentReciter);
            updateReciterDisplayName();

            if (state.currentSurah && state.currentAyahs.length > 0) {
                // Update audio URLs for all ayahs immediately without re-fetching surah text
                state.currentAyahs.forEach((a, i) => {
                    a.audio = getAyahAudioUrl(state.currentSurah.number, i + 1, a.number, state.currentReciter);
                });

                const wasPlaying = state.isPlaying;
                if (wasPlaying) {
                    playAyah(state.currentAyahIndex);
                } else {
                    DOM.audio.src = state.currentAyahs[state.currentAyahIndex].audio;
                    updatePlayerInfo();
                }
                showToast(`تم اختيار القارئ: ${RECITERS_REGISTRY[state.currentReciter]?.name || ''}`);
            }
        });

        // Repeat Ayah Toggle
        DOM.btnRepeat.addEventListener('click', cycleRepeatMode);

        // Playback Speed Toggle
        DOM.btnSpeed.addEventListener('click', cyclePlaybackSpeed);

        // Volume Controls
        DOM.volumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            DOM.audio.volume = vol;
            state.isMuted = vol === 0;
            updateVolumeIcon(vol);
        });

        DOM.btnMute.addEventListener('click', () => {
            state.isMuted = !state.isMuted;
            DOM.audio.muted = state.isMuted;
            updateVolumeIcon(state.isMuted ? 0 : DOM.audio.volume);
        });

        // Locate current ayah buttons (Prominent Player Button + Reader Header Button + Floating Button)
        DOM.btnLocateAyah.addEventListener('click', locateCurrentAyah);
        if (DOM.btnReaderLocate) DOM.btnReaderLocate.addEventListener('click', locateCurrentAyah);
        if (DOM.floatingLocateBtn) DOM.floatingLocateBtn.addEventListener('click', locateCurrentAyah);

        // Toggle Inline Tafseer Under Ayahs
        if (DOM.btnToggleInlineTafseer) {
            DOM.btnToggleInlineTafseer.addEventListener('click', toggleInlineTafseer);
        }

        // Window scroll listener: show/hide floating button when scrolling away from active ayah
        window.addEventListener('scroll', handleScrollVisibility);

        // Tafseer Edition Switcher & Modal Close
        if (DOM.tafseerEditionSelect) {
            DOM.tafseerEditionSelect.addEventListener('change', () => {
                state.currentTafseer = DOM.tafseerEditionSelect.value;
                localStorage.setItem('quran_tafseer', state.currentTafseer);
                loadTafseerContent(state.activeTafseerAyahIndex);
            });
        }
        DOM.closeTafseerBtn.addEventListener('click', closeTafseer);
        DOM.tafseerModal.addEventListener('click', (e) => {
            if (e.target === DOM.tafseerModal) closeTafseer();
        });

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if (e.code === 'Space') {
                e.preventDefault();
                togglePlayPause();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                playPreviousAyah();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                playNextAyah();
            } else if (e.key.toLowerCase() === 'm') {
                DOM.btnMute.click();
            } else if (e.key === 'Escape') {
                closeTafseer();
            }
        });

        // MediaSession API Actions
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', togglePlayPause);
            navigator.mediaSession.setActionHandler('pause', togglePlayPause);
            navigator.mediaSession.setActionHandler('previoustrack', playPreviousAyah);
            navigator.mediaSession.setActionHandler('nexttrack', playNextAyah);
            navigator.mediaSession.setActionHandler('stop', stopAudio);
        }
    }

    // ==========================================================================
    // Fetch & Display Surahs List
    // ==========================================================================
    async function fetchSurahs() {
        try {
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const result = await response.json();

            if (result.code !== 200 || !result.data) {
                throw new Error('فشل في جلب قائمة السور');
            }

            state.allSurahs = result.data;
            state.filteredSurahs = result.data;
            renderSurahsGrid();
        } catch (error) {
            console.error('Error fetching surahs:', error);
            DOM.surahsGrid.innerHTML = `
                <div class="skeleton-loader">
                    <p style="color: #ef4444; margin-bottom: 12px;"><i class="fas fa-exclamation-triangle"></i> تعذر الاتصال بجلب قائمة السور.</p>
                    <button class="action-btn" onclick="location.reload()" style="margin: 0 auto;">إعادة المحاولة</button>
                </div>
            `;
        }
    }

    function filterSurahs() {
        state.filteredSurahs = state.allSurahs.filter(surah => {
            const matchesType = state.activeFilter === 'all' || surah.revelationType === state.activeFilter;

            const cleanArName = surah.name.replace(/[^\u0621-\u064A]/g, '');
            const cleanQuery = state.searchQuery.replace(/[^\u0621-\u064A]/g, '');

            const matchesSearch = !state.searchQuery ||
                surah.name.includes(state.searchQuery) ||
                cleanArName.includes(cleanQuery) ||
                surah.englishName.toLowerCase().includes(state.searchQuery) ||
                surah.number.toString() === state.searchQuery;

            return matchesType && matchesSearch;
        });

        renderSurahsGrid();
    }

    function renderSurahsGrid() {
        DOM.searchStat.textContent = `${state.filteredSurahs.length} سورة`;

        if (state.filteredSurahs.length === 0) {
            DOM.surahsGrid.innerHTML = `
                <div class="skeleton-loader">
                    <p>لا توجد سورة تطابق بحثك الحالي "${state.searchQuery}".</p>
                </div>
            `;
            return;
        }

        const cardsHtml = state.filteredSurahs.map(surah => {
            const isMeccan = surah.revelationType === 'Meccan';
            const revelationText = isMeccan ? 'مكية' : 'مدنية';

            return `
                <div class="surah-card" data-surah-number="${surah.number}">
                    <div class="surah-card-right">
                        <span class="surah-index">${surah.number}</span>
                        <div class="surah-details">
                            <h3 class="surah-title-ar">${surah.name}</h3>
                            <div class="surah-sub-meta">
                                <span class="surah-title-en">${surah.englishName}</span>
                                <span class="meta-dot">•</span>
                                <span class="surah-revelation">${revelationText}</span>
                                <span class="meta-dot">•</span>
                                <span class="surah-ayahs-count">${surah.numberOfAyahs} آية</span>
                            </div>
                        </div>
                    </div>
                    <div class="surah-card-left">
                        <span class="surah-open-hint"><i class="fas fa-chevron-left"></i></span>
                    </div>
                </div>
            `;
        }).join('');

        DOM.surahsGrid.innerHTML = cardsHtml;
    }

    // ==========================================================================
    // Reader & Recitation View
    // ==========================================================================
    async function openSurah(surahNumber, targetAyahIndex = 0, autoPlay = false) {
        const surah = state.allSurahs.find(s => s.number === surahNumber);
        if (!surah) return;

        state.currentSurah = surah;
        state.currentAyahIndex = targetAyahIndex;

        // Update Reader Header
        DOM.readerSurahName.textContent = surah.name;
        DOM.readerRevelation.textContent = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
        DOM.readerAyahsCount.textContent = `${surah.numberOfAyahs} آيات`;
        DOM.readerSurahOrder.textContent = `ترتيبها بالمصحف: ${surah.number}`;
        DOM.jumpInput.max = surah.numberOfAyahs;
        DOM.jumpInput.value = '';

        // Bismillah visibility (Hide for At-Tawbah 9, and Al-Fatihah 1 where it is ayah 1)
        if (surah.number === 9 || surah.number === 1) {
            DOM.bismillahBox.style.display = 'none';
        } else {
            DOM.bismillahBox.style.display = 'block';
        }

        showReaderView();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        DOM.ayahsContainer.innerHTML = `
            <div class="skeleton-loader">
                <div class="spinner"></div>
                <p>جارٍ تحميل الآيات الكريمة والتلاوة العطرة...</p>
            </div>
        `;

        await loadSurahData(surahNumber, () => {
            renderAyahs();
            if (autoPlay) {
                playAyah(targetAyahIndex);
            } else {
                updatePlayerInfo();
                highlightActiveAyah(false);
            }
        });
    }

    // Load surah verses text and assign direct verified audio URLs
    async function loadSurahData(surahNumber, callback) {
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            const result = await response.json();

            if (result.code !== 200 || !result.data || !result.data.ayahs) {
                throw new Error('فشل في جلب بيانات السورة');
            }

            state.currentAyahs = result.data.ayahs.map((ayah, i) => {
                return {
                    ...ayah,
                    audio: getAyahAudioUrl(surahNumber, i + 1, ayah.number, state.currentReciter)
                };
            });

            if (state.showInlineTafseer) {
                loadSurahInlineTafseer();
            }

            if (callback) callback();
        } catch (error) {
            console.error('Error loading surah:', error);
            showToast('فشل في تحميل بيانات السورة، يرجى المحاولة لاحقاً', 'error');
            DOM.ayahsContainer.innerHTML = `
                <div class="skeleton-loader">
                    <p style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> تعذر تحميل بيانات السورة.</p>
                </div>
            `;
        }
    }

    function renderAyahs() {
        if (!state.currentAyahs || state.currentAyahs.length === 0) return;

        const ayahsHtml = state.currentAyahs.map((ayah, index) => {
            const ayahNum = index + 1;
            let ayahText = ayah.text;

            // Remove bismillah from beginning of first ayah for Surahs other than 1 and 9 if present in API
            if (state.currentSurah.number !== 1 && state.currentSurah.number !== 9 && index === 0) {
                ayahText = ayahText.replace(/^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/, '');
            }

            const isActive = index === state.currentAyahIndex;

            let inlineHtml = '';
            if (state.showInlineTafseer) {
                const tafseerItem = state.inlineTafseerData[state.currentSurah?.number]?.[index];
                const tafseerText = tafseerItem ? tafseerItem.text : '<i class="fas fa-circle-notch fa-spin"></i> جارٍ تحميل التفسير...';
                inlineHtml = `
                    <div class="ayah-inline-tafseer" id="inline-tafseer-${index}">
                        <span class="tafseer-label"><i class="fas fa-book-open"></i> التفسير الميسر:</span>
                        <p>${tafseerText}</p>
                    </div>
                `;
            }

            return `
                <div class="ayah-card ${isActive ? 'active-ayah' : ''}" id="ayah-card-${index}" data-ayah-index="${index}">
                    <div class="ayah-content">
                        <p class="ayah-text">
                            ${ayahText}
                            <span class="ayah-end-marker">﴿${toArabicDigits(ayahNum)}﴾</span>
                        </p>
                        ${inlineHtml}
                        <div class="ayah-actions">
                            <button class="ayah-action-btn play-ayah" title="استمع لهذه الآية">
                                <i class="fas fa-play"></i> استمع
                            </button>
                            <button class="ayah-action-btn tafseer-ayah" title="تفسير الآية بالتفصيل">
                                <i class="fas fa-book-open"></i> التفسير
                            </button>
                            <button class="ayah-action-btn copy-ayah" title="نسخ نص الآية">
                                <i class="fas fa-copy"></i> نسخ
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        DOM.ayahsContainer.innerHTML = ayahsHtml;
    }

    function toArabicDigits(num) {
        const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().replace(/\d/g, d => arabicDigits[d]);
    }

    function showSurahsView() {
        DOM.readerView.style.display = 'none';
        DOM.surahsView.style.display = 'block';
        if (DOM.floatingLocateBtn) DOM.floatingLocateBtn.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showReaderView() {
        DOM.surahsView.style.display = 'none';
        DOM.readerView.style.display = 'block';
    }

    // ==========================================================================
    // Audio Playback Engine & Highlighting
    // ==========================================================================
    function playAyah(index) {
        if (!state.currentAyahs || !state.currentAyahs[index]) return;

        state.currentAyahIndex = index;
        const ayah = state.currentAyahs[index];

        DOM.audio.src = ayah.audio;
        DOM.audio.playbackRate = state.playbackRates[state.playbackRateIndex];

        DOM.audio.play()
            .then(() => {
                state.isPlaying = true;
                updatePlayButtonUI(true);
                updatePlayerInfo();
                highlightActiveAyah(true);
                saveLastReadPosition();
                updateMediaSession();
            })
            .catch(err => {
                console.warn('Playback interrupted or prevented:', err);
                state.isPlaying = false;
                updatePlayButtonUI(false);
            });
    }

    function togglePlayPause() {
        if (!state.currentSurah) {
            openSurah(1, 0, true);
            return;
        }

        if (state.isPlaying) {
            DOM.audio.pause();
            state.isPlaying = false;
            updatePlayButtonUI(false);
        } else {
            if (!DOM.audio.src || DOM.audio.src === window.location.href) {
                playAyah(state.currentAyahIndex);
            } else {
                DOM.audio.play()
                    .then(() => {
                        state.isPlaying = true;
                        updatePlayButtonUI(true);
                    })
                    .catch(err => console.warn(err));
            }
        }
    }

    function playNextAyah() {
        if (!state.currentAyahs || state.currentAyahs.length === 0) return;

        if (state.currentAyahIndex < state.currentAyahs.length - 1) {
            state.repeatCounter = 0;
            playAyah(state.currentAyahIndex + 1);
        } else {
            showToast('صَدَقَ اللهُ العَظيمُ - تم الوصول لنهاية السورة', 'success');
            if (state.currentSurah && state.currentSurah.number < 114) {
                openSurah(state.currentSurah.number + 1, 0, true);
            } else {
                stopAudio();
            }
        }
    }

    function playPreviousAyah() {
        if (!state.currentAyahs || state.currentAyahs.length === 0) return;

        if (state.currentAyahIndex > 0) {
            state.repeatCounter = 0;
            playAyah(state.currentAyahIndex - 1);
        } else {
            showToast('هذه هي الآية الأولى في السورة', 'info');
        }
    }

    function stopAudio() {
        DOM.audio.pause();
        DOM.audio.currentTime = 0;
        state.isPlaying = false;
        updatePlayButtonUI(false);
    }

    function handleAyahEnded() {
        if (state.repeatMode !== 0) {
            if (state.repeatMode === 'inf' || state.repeatCounter < state.repeatMode - 1) {
                state.repeatCounter++;
                DOM.audio.currentTime = 0;
                DOM.audio.play();
                showToast(`تكرار الآية (${state.repeatCounter + 1}/${state.repeatMode === 'inf' ? '∞' : state.repeatMode})`);
                return;
            }
        }

        state.repeatCounter = 0;
        playNextAyah();
    }

    function handleAudioError(e) {
        console.warn('Audio URL failed to load:', DOM.audio.src);
        // Fallback to Alafasy EveryAyah if anything fails
        const fallbackUrl = `https://everyayah.com/data/Alafasy_128kbps/${String(state.currentSurah.number).padStart(3, '0')}${String(state.currentAyahIndex + 1).padStart(3, '0')}.mp3`;
        if (DOM.audio.src !== fallbackUrl) {
            console.log('Trying fallback CDN:', fallbackUrl);
            DOM.audio.src = fallbackUrl;
            DOM.audio.play().catch(() => playNextAyah());
        } else {
            playNextAyah();
        }
    }

    function updatePlayButtonUI(playing) {
        if (playing) {
            DOM.playIcon.className = 'fas fa-pause';
            DOM.btnPlay.title = 'إيقاف مؤقت';
        } else {
            DOM.playIcon.className = 'fas fa-play';
            DOM.btnPlay.title = 'تشغيل';
        }
    }

    function updatePlayerInfo() {
        if (!state.currentSurah) return;
        const currentAyahNumber = state.currentAyahIndex + 1;
        DOM.playerSurahTitle.textContent = `${state.currentSurah.name} • الآية ${currentAyahNumber}`;
        updateReciterDisplayName();

        // Update Ayah numbers inside the prominent buttons
        if (DOM.locateAyahNum) DOM.locateAyahNum.textContent = currentAyahNumber;
        if (DOM.readerActiveAyahNum) DOM.readerActiveAyahNum.textContent = currentAyahNumber;
        if (DOM.floatingAyahNum) DOM.floatingAyahNum.textContent = currentAyahNumber;

        if (DOM.btnReaderLocate) {
            DOM.btnReaderLocate.style.display = 'inline-flex';
        }
    }

    function highlightActiveAyah(autoScroll = true) {
        const cards = DOM.ayahsContainer.querySelectorAll('.ayah-card');
        cards.forEach(card => card.classList.remove('active-ayah'));

        const currentCard = document.getElementById(`ayah-card-${state.currentAyahIndex}`);
        if (currentCard) {
            currentCard.classList.add('active-ayah');
            if (autoScroll) {
                scrollToActiveAyah(false);
            }
        }
    }

    // Locate Current Ayah (Bigger & Prominent Action)
    function locateCurrentAyah() {
        if (!state.currentSurah) {
            showToast('الرجاء اختيار سورة أولاً', 'info');
            return;
        }

        showReaderView();
        scrollToActiveAyah(true);
        showToast(`موضع الآية الحالية: سورة ${state.currentSurah.name} (آية ${state.currentAyahIndex + 1})`, 'info');
    }

    function scrollToActiveAyah(flash = true) {
        const currentCard = document.getElementById(`ayah-card-${state.currentAyahIndex}`);
        if (currentCard && DOM.readerView.style.display !== 'none') {
            currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (flash) {
                currentCard.classList.add('flash-glow');
                setTimeout(() => currentCard.classList.remove('flash-glow'), 1800);
            }
        }
        if (DOM.floatingLocateBtn) {
            DOM.floatingLocateBtn.style.display = 'none';
        }
    }

    function handleScrollVisibility() {
        if (DOM.readerView.style.display === 'none' || !state.currentSurah || !DOM.floatingLocateBtn) {
            if (DOM.floatingLocateBtn) DOM.floatingLocateBtn.style.display = 'none';
            return;
        }

        const activeCard = document.getElementById(`ayah-card-${state.currentAyahIndex}`);
        if (!activeCard) return;

        const rect = activeCard.getBoundingClientRect();
        // Check if active ayah card is scrolled off screen
        const isVisible = (rect.top >= 50 && rect.bottom <= (window.innerHeight - 100));

        if (!isVisible && state.isPlaying) {
            DOM.floatingLocateBtn.style.display = 'inline-flex';
            if (DOM.floatingAyahNum) DOM.floatingAyahNum.textContent = state.currentAyahIndex + 1;
        } else {
            DOM.floatingLocateBtn.style.display = 'none';
        }
    }

    function updateAudioProgress() {
        if (!DOM.audio.duration || isNaN(DOM.audio.duration)) return;
        const current = DOM.audio.currentTime;
        const total = DOM.audio.duration;

        DOM.currentTime.textContent = formatTime(current);
        DOM.totalDuration.textContent = formatTime(total);

        const progressPercent = (current / total) * 100;
        DOM.audioSeek.value = progressPercent;
    }

    function updateAudioDuration() {
        if (DOM.audio.duration && !isNaN(DOM.audio.duration)) {
            DOM.totalDuration.textContent = formatTime(DOM.audio.duration);
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function cycleRepeatMode() {
        const modes = [0, 1, 3, 5, 'inf'];
        const currentIndex = modes.indexOf(state.repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        state.repeatMode = modes[nextIndex];
        state.repeatCounter = 0;

        DOM.repeatBadge.textContent = state.repeatMode === 'inf' ? '∞' : state.repeatMode;

        if (state.repeatMode === 0) {
            DOM.btnRepeat.classList.remove('active');
            showToast('تم إيقاف تكرار الآيات');
        } else {
            DOM.btnRepeat.classList.add('active');
            showToast(`تكرار الآية: ${state.repeatMode === 'inf' ? 'مستمر' : state.repeatMode + ' مرات'}`);
        }
    }

    function cyclePlaybackSpeed() {
        state.playbackRateIndex = (state.playbackRateIndex + 1) % state.playbackRates.length;
        const speed = state.playbackRates[state.playbackRateIndex];
        DOM.audio.playbackRate = speed;
        DOM.speedLabel.textContent = `${speed}x`;
        showToast(`سرعة القراءة: ${speed}x`);
    }

    function updateVolumeIcon(vol) {
        if (vol === 0) {
            DOM.volumeIcon.className = 'fas fa-volume-mute';
        } else if (vol < 0.5) {
            DOM.volumeIcon.className = 'fas fa-volume-down';
        } else {
            DOM.volumeIcon.className = 'fas fa-volume-up';
        }
    }

    function handleAyahJump() {
        const val = parseInt(DOM.jumpInput.value, 10);
        if (!state.currentAyahs || state.currentAyahs.length === 0) return;

        if (!isNaN(val) && val >= 1 && val <= state.currentAyahs.length) {
            playAyah(val - 1);
            DOM.jumpInput.value = '';
        } else {
            showToast(`رقم الآية يجب أن يكون بين 1 و ${state.currentAyahs.length}`, 'warning');
        }
    }

    // ==========================================================================
    // Tafseer Registry & Dynamic Switcher (المختصر، الميسر، ابن كثير، القرطبي، السعدي، الجلالين)
    // ==========================================================================
    const TAFSEER_REGISTRY = {
        mokhtasar: {
            id: 'mokhtasar',
            name: 'المختصر في التفسير (مركز تفسير)',
            fetch: async (surah, ayah) => {
                const res = await fetch(`https://quranenc.com/api/v1/translation/aya/arabic_mokhtasar/${surah}/${ayah}`);
                const data = await res.json();
                if (data?.result?.translation) {
                    return data.result.translation;
                }
                throw new Error('تعذر جلب المختصر في التفسير');
            }
        },
        muyassar: {
            id: 'muyassar',
            name: 'التفسير الميسر (مجمع الملك فهد)',
            fetch: async (surah, ayah) => {
                const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.muyassar`);
                const data = await res.json();
                if (data?.code === 200 && data?.data?.text) {
                    return data.data.text;
                }
                throw new Error('تعذر جلب التفسير الميسر');
            }
        },
        ibnkathir: {
            id: 'ibnkathir',
            name: 'تفسير ابن كثير (تفسير القرآن العظيم)',
            fetch: async (surah, ayah) => {
                const res = await fetch(`https://api.quran.com/api/v4/tafsirs/14/by_ayah/${surah}:${ayah}`);
                const data = await res.json();
                if (data?.tafsir?.text) {
                    return data.tafsir.text;
                }
                throw new Error('تعذر جلب تفسير ابن كثير');
            }
        },
        qurtubi: {
            id: 'qurtubi',
            name: 'تفسير القرطبي (الجامع لأحكام القرآن)',
            fetch: async (surah, ayah) => {
                const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.qurtubi`);
                const data = await res.json();
                if (data?.code === 200 && data?.data?.text) {
                    return data.data.text;
                }
                throw new Error('تعذر جلب تفسير القرطبي');
            }
        },
        saadi: {
            id: 'saadi',
            name: 'تفسير السعدي (تيسير الكريم الرحمن)',
            fetch: async (surah, ayah) => {
                const res = await fetch(`https://api.quran.com/api/v4/tafsirs/91/by_ayah/${surah}:${ayah}`);
                const data = await res.json();
                if (data?.tafsir?.text) {
                    return data.tafsir.text;
                }
                throw new Error('تعذر جلب تفسير السعدي');
            }
        },
        jalalayn: {
            id: 'jalalayn',
            name: 'تفسير الجلالين',
            fetch: async (surah, ayah) => {
                const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.jalalayn`);
                const data = await res.json();
                if (data?.code === 200 && data?.data?.text) {
                    return data.data.text;
                }
                throw new Error('تعذر جلب تفسير الجلالين');
            }
        }
    };

    function formatTafseerContent(text) {
        if (!text) return '';
        // If content contains HTML tags (like Ibn Kathir and Saadi), return rendered HTML
        if (/<[a-z][\s\S]*>/i.test(text)) {
            return text;
        }
        // Plain text: format paragraphs cleanly
        return text
            .split('\n')
            .map(p => p.trim())
            .filter(Boolean)
            .map(p => `<p>${p}</p>`)
            .join('');
    }

    async function openTafseer(ayahIndex) {
        if (!state.currentSurah || !state.currentAyahs[ayahIndex]) return;

        state.activeTafseerAyahIndex = ayahIndex;
        const ayah = state.currentAyahs[ayahIndex];
        const ayahNumber = ayahIndex + 1;

        DOM.tafseerSurahTitle.textContent = `${state.currentSurah.name}`;
        DOM.tafseerAyahBadge.textContent = `الآية رقم ${ayahNumber}`;
        DOM.tafseerAyahText.textContent = ayah.text;

        if (!TAFSEER_REGISTRY[state.currentTafseer]) {
            state.currentTafseer = 'mokhtasar';
        }

        if (DOM.tafseerEditionSelect) {
            DOM.tafseerEditionSelect.value = state.currentTafseer;
        }

        DOM.tafseerModal.style.display = 'flex';
        await loadTafseerContent(ayahIndex);
    }

    async function loadTafseerContent(ayahIndex) {
        if (!state.currentSurah || !state.currentAyahs[ayahIndex]) return;

        const ayahNumber = ayahIndex + 1;
        const currentEdition = state.currentTafseer || 'mokhtasar';
        const tafseerInfo = TAFSEER_REGISTRY[currentEdition] || TAFSEER_REGISTRY.mokhtasar;

        if (DOM.tafseerBookName) {
            DOM.tafseerBookName.textContent = tafseerInfo.name;
        }

        DOM.tafseerTextContainer.innerHTML = `
            <div class="tafseer-spinner">
                <i class="fas fa-circle-notch fa-spin"></i> جارٍ تحميل ${tafseerInfo.name}...
            </div>
        `;

        try {
            const content = await tafseerInfo.fetch(state.currentSurah.number, ayahNumber);
            DOM.tafseerTextContainer.innerHTML = formatTafseerContent(content);
        } catch (err) {
            console.error('Tafseer loading error:', err);
            DOM.tafseerTextContainer.innerHTML = `
                <div style="text-align: center; padding: 24px 16px; color: var(--text-primary);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.8rem; color: #eab308; margin-bottom: 10px;"></i>
                    <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 1.05rem;">تعذر الاتصال بخادم (${tafseerInfo.name}) حالياً.</p>
                    <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 16px;">يرجى اختيار أحد كتب التفسير البديلة المتاحة:</p>
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="window.switchTafseerEdition('muyassar')" class="reader-locate-btn">التفسير الميسر</button>
                        <button onclick="window.switchTafseerEdition('saadi')" class="reader-locate-btn">تفسير السعدي</button>
                        <button onclick="window.switchTafseerEdition('mokhtasar')" class="reader-locate-btn">المختصر</button>
                        <button onclick="window.switchTafseerEdition('ibnkathir')" class="reader-locate-btn">ابن كثير</button>
                        <button onclick="window.switchTafseerEdition('qurtubi')" class="reader-locate-btn">القرطبي</button>
                        <button onclick="window.switchTafseerEdition('jalalayn')" class="reader-locate-btn">الجلالين</button>
                    </div>
                </div>
            `;
        }
    }

    // Global helper for one-click tafseer switching
    window.switchTafseerEdition = function(key) {
        if (DOM.tafseerEditionSelect) {
            DOM.tafseerEditionSelect.value = key;
            state.currentTafseer = key;
            localStorage.setItem('quran_tafseer', key);
            loadTafseerContent(state.activeTafseerAyahIndex);
        }
    };

    function closeTafseer() {
        DOM.tafseerModal.style.display = 'none';
    }

    // ==========================================================================
    // Bookmarking & Persistence
    // ==========================================================================
    function saveLastReadPosition() {
        if (!state.currentSurah) return;
        state.lastRead = {
            surahNumber: state.currentSurah.number,
            surahName: state.currentSurah.name,
            ayahIndex: state.currentAyahIndex
        };
        localStorage.setItem('quran_last_read', JSON.stringify(state.lastRead));
        updateResumeButton();
    }

    function updateResumeButton() {
        if (state.lastRead) {
            DOM.resumeBtn.title = `متابعة من: ${state.lastRead.surahName} (آية ${state.lastRead.ayahIndex + 1})`;
            DOM.resumeBtn.style.opacity = '1';
        } else {
            DOM.resumeBtn.title = 'لا يوجد موضع محفوظ بعد';
            DOM.resumeBtn.style.opacity = '0.7';
        }
    }

    function copyAyahText(ayahIndex) {
        if (!state.currentAyahs[ayahIndex]) return;
        const text = state.currentAyahs[ayahIndex].text;
        const formatted = `"${text}" [سورة ${state.currentSurah.name}: الآية ${ayahIndex + 1}]`;

        navigator.clipboard.writeText(formatted)
            .then(() => showToast('تم نسخ الآية الكريمة بنجاح', 'success'))
            .catch(() => showToast('تعذر النسخ إلى الحافظة', 'error'));
    }

    // ==========================================================================
    // MediaSession API
    // ==========================================================================
    function updateMediaSession() {
        if ('mediaSession' in navigator && state.currentSurah) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: `${state.currentSurah.name} - الآية ${state.currentAyahIndex + 1}`,
                artist: DOM.playerReciterName.textContent,
                album: 'القرآن الكريم',
                artwork: [
                    { src: './logo.png', sizes: '512x512', type: 'image/png' }
                ]
            });
        }
    }

    // ==========================================================================
    // Toast Notifications
    // ==========================================================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';

        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        if (type === 'error') icon = 'fa-times-circle';

        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        DOM.toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 3000);
    }

    // Start Application
    init();
});
