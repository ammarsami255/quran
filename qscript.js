let audio = document.querySelector('.quranPlayer'),
    surahsContainer = document.querySelector('.surahs'),
    ayah = document.querySelector('.ayah'),
    next = document.querySelector('.next'),
    prev = document.querySelector('.prev'),
    play = document.querySelector('.play');

    document.addEventListener("DOMContentLoaded", function() {
        var body = document.body;
        var button = document.querySelector(".quran_view_pdf");

        button.addEventListener("mouseover", function() {
            body.style.backgroundColor = "#1e1e1e";
        });

        button.addEventListener("mouseout", function() {
            body.style.backgroundColor = "#ffffff";
        });
    });

getSurahs();
function gotoview(){
    window.location.href="https://ammarsami255.github.io/quran_view/";

}

function getSurahs() {
    fetch('https://quran-endpoint.vercel.app/quran')
        .then(response => response.json())
        .then(data => {
            for (let surah in data.data) {
                surahsContainer.innerHTML += 
                `
                <div>
                    <p>${data.data[surah].asma.ar.long}</p>
                    <p>${data.data[surah].asma.en.long}</p>
                </div>
                `;
            }

            let allSurahs = document.querySelectorAll('.surahs div'),
                AyahsAudios,
                AyahsText;

            for (let index = 0; index < allSurahs.length; index++) {
                allSurahs[index].addEventListener('click', () => {
                    fetch(`https://quran-endpoint.vercel.app/quran/${index + 1}`)
                        .then(response => response.json())
                        .then(data => {
                            let verses = data.data.ayahs;
                            AyahsAudios = [];
                            AyahsText = [];
                            for (let i = 0; i < verses.length; i++) {
                                AyahsAudios.push(verses[i].audio);
                                AyahsText.push(verses[i].text.ar);
                            }

                            next.addEventListener('click',()=>
                            {
                                ayahindex < AyahsAudios.length-1 ? ayahindex++ : 0
                                change_Ayah(ayahindex);

                            })
                            prev.addEventListener('click',()=>
                            {
                                ayahindex < AyahsAudios.length-1 ? ayahindex-- : 0
                                change_Ayah(ayahindex);

                            })

                            let ayahindex = 0;
                            change_Ayah(ayahindex);
                            audio.addEventListener('ended',()=>
                            {
                                ayahindex++;
                                if(ayahindex < AyahsAudios.length){
                                change_Ayah(ayahindex);
                                console.log(ayahindex);
                                }else{
                                    ayahindex=0;
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
                            }
                            )
                            function change_Ayah(ayahindex) {
                                audio.src = AyahsAudios[ayahindex].url;
                                ayah.innerHTML = AyahsText[ayahindex];
                                audio.play();

                            }
                        });
                });
            }
        });
}
