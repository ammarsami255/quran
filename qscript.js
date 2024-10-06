document.addEventListener("DOMContentLoaded", function () {
    const audio = document.querySelector('.quranPlayer'),
        surahsContainer = document.querySelector('.surahs'),
        ayah = document.querySelector('.ayah'),
        next = document.querySelector('.next'),
        prev = document.querySelector('.prev'),
        stopBtn = document.querySelector('.stop'), 
        reciterSelect = document.querySelector('.reciter-select');

    let AyahsAudios = [],
        AyahsText = [],
        ayahindex = 0,
        currentReciter = reciterSelect.value,
        currentSurah = null;

    reciterSelect.addEventListener('change', () => {
        currentReciter = reciterSelect.value;
        if (currentSurah) {
            loadSurah(currentSurah.number, currentReciter);
        }
    });

    getSurahs();

    function getSurahs() {
        fetch('https://api.alquran.cloud/v1/surah')
            .then(response => response.json())
            .then(data => {
                if (data.code !== 200) throw new Error("فشل في جلب السور");

                data.data.forEach(surah => {
                    surahsContainer.innerHTML += `
                        <div data-number="${surah.number}">
                            <span class="english-name">${surah.englishName}</span>
                            <span class="arabic-name">${surah.name}</span>
                        </div>
                    `;
                });

                const allSurahs = document.querySelectorAll('.surahs div');

                allSurahs.forEach(surahDiv => {
                    surahDiv.addEventListener('click', () => {
                        const surahNumber = surahDiv.getAttribute('data-number');
                        currentSurah = { number: surahNumber };
                        loadSurah(surahNumber, currentReciter);
                    });
                });
            })
            .catch(error => {
                console.error("خطأ في جلب السور:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'فشل في تحميل السور. حاول مرة أخرى لاحقًا.',
                });
            });
    }

    function loadSurah(surahNumber, reciter) {
        console.log(`جاري جلب السورة رقم ${surahNumber} من القارئ ${reciter}`);
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciter}`)
            .then(response => response.json())
            .then(data => {
                if (data.code !== 200) throw new Error("فشل في جلب تفاصيل السورة");

                const ayahs = data.data.ayahs;
                AyahsAudios = ayahs.map(ayah => ayah.audio);
                AyahsText = ayahs.map(ayah => ayah.text);
                ayahindex = 0;
                change_Ayah(ayahindex);
            })
            .catch(error => {
                console.error("خطأ في جلب تفاصيل السورة:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'فشل في تحميل تفاصيل السورة. حاول مرة أخرى لاحقًا.',
                });
            });
    }

    next.addEventListener('click', () => {
        if (ayahindex < AyahsAudios.length - 1) {
            ayahindex++;
            change_Ayah(ayahindex);
        } else {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "لقد وصلت إلى نهاية السورة.",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

    prev.addEventListener('click', () => {
        if (ayahindex > 0) {
            ayahindex--;
            change_Ayah(ayahindex);
        } else {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "هذه هي الآية الأولى.",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

    stopBtn.addEventListener('click', () => {
        audio.pause(); 
        Swal.fire({
            position: "center",
            icon: "success",
            title: "تم إيقاف التلاوة.",
            showConfirmButton: false,
            timer: 1500
        });
    });
    audio.addEventListener('ended', () => {
        ayahindex++;
        if (ayahindex < AyahsAudios.length) {
            change_Ayah(ayahindex);
        } else {
            ayahindex = 0;
            change_Ayah(ayahindex);
            audio.pause();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "صَدَقَ اللهُ العَظيمُ",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

    function change_Ayah(index) {
        if (AyahsAudios[index]) {
            console.log(`تشغيل الآية رقم ${index + 1}: ${AyahsAudios[index]}`);
            audio.src = AyahsAudios[index];
            ayah.innerHTML = AyahsText[index];
            audio.play().catch(error => {
                console.error("خطأ في تشغيل الصوت:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'فشل في تشغيل الصوت. حاول مرة أخرى.',
                });
            });
        } else {
            console.warn(`لم يتم العثور على رابط الصوت للآية رقم ${index + 1}`);
        }
    }
});
