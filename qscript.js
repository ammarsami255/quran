document.addEventListener("DOMContentLoaded", function () {
    const audio = document.querySelector('.quranPlayer'),
        surahsContainer = document.querySelector('.surahs'),
        ayah = document.querySelector('.ayah'),
        next = document.querySelector('.next'),
        prev = document.querySelector('.prev'),
        stopBtn = document.querySelector('.stop'),
        reciterSelect = document.querySelector('.reciter-select'),
        searchAyahBtn = document.getElementById('search-ayah-btn'),
        ayahInput = document.getElementById('ayah-input');

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

    searchAyahBtn.addEventListener('click', () => {
        let inputAyahNumber = parseInt(ayahInput.value);
        if (!isNaN(inputAyahNumber) && inputAyahNumber >= 0 && inputAyahNumber < AyahsAudios.length) {
            ayahindex = inputAyahNumber;
            change_Ayah(ayahindex);
            ayahInput.value = ''; 

        } else {
            Swal.fire({
                icon: 'warning',
                title: 'خطأ',
                text: 'رقم الآية غير صحيح. حاول إدخال رقم ضمن نطاق السورة.',
            });
            ayahInput.value = '';
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
                    surahDiv.addEventListener('click', (e) => {
                        let target = e.target;
                        if (target.classList.contains('english-name') || target.classList.contains('arabic-name')) {
                            target = target.parentElement;
                        }
                        const surahNumber = target.getAttribute('data-number');
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
        Swal.fire({
            title: 'جارٍ التحميل...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciter}`)
            .then(response => response.json())
            .then(data => {
                Swal.close();
                if (data.code !== 200) throw new Error("فشل في جلب الآيات");

                AyahsAudios = data.data.ayahs.map(a => a.audio);
                AyahsText = data.data.ayahs.map(a => a.text);
                ayahindex = 0;

                change_Ayah(ayahindex);
            })
            .catch(error => {
                Swal.close();
                console.error("خطأ في جلب الآيات:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'فشل في تحميل الآيات. حاول مرة أخرى لاحقًا.',
                });
            });
    }

    function change_Ayah(index) {
        if (AyahsAudios[index]) {
            audio.src = AyahsAudios[index];
            if(index!=0)
            ayah.innerHTML = index+"\t"+AyahsText[index] + "\t"+(index+1);
        else
        ayah.innerHTML = AyahsText[index] + "   "+(index+1);
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
        if (ayahindex < AyahsAudios.length - 1) {
            ayahindex++;
            change_Ayah(ayahindex);
        } else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "صَدَقَ اللهُ العَظيمُ",
                showConfirmButton: false,
                timer: 1500
            });
            ayahindex = 0;
            change_Ayah(ayahindex);
        }
    });
});
