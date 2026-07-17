function showPage(page){

    const pages = ["home","pergerakan"];

    pages.forEach(function(p){

        const el = document.getElementById(p);

        if(el){
            el.style.display = "none";
        }

    });

    const target = document.getElementById(page);

    if(target){
        target.style.display = "block";
    }

}

function goHome(){

    document.getElementById("pergerakan").style.display = "none";
    document.getElementById("home").style.display = "block";

}
function pilihModul(modul){

    showPage("pergerakan");

    document.getElementById("jenisLaporan").value = modul.toUpperCase();

    const label = document.getElementById("lblKategori");

    if(modul=="pergerakan"){

        label.innerHTML="Pergerakan";

        fillDropdown("kategoriValue",masterData.pergerakan);

    }

    else if(modul=="insiden"){

        label.innerHTML="Jenis Insiden";

        fillDropdown("kategoriValue",masterData.jenisInsiden);

    }

    else if(modul=="aktiviti"){

        label.innerHTML="Jenis Aktiviti";

        fillDropdown("kategoriValue",masterData.jenisAktiviti);

    }

}

let masterData = {};

async function loadMasterData(){

    const response = await fetch('masterdata.json');
    masterData = await response.json();

    fillDropdown('nama', masterData.anggota);
    fillDropdown('syif', masterData.syif);
    fillDropdown('pos', masterData.pos);
    fillDropdown("kategoriValue", masterData.pergerakan);
}


function fillDropdown(id, items){

    const el = document.getElementById(id);

    el.innerHTML = '<option value="">-- SILA PILIH --</option>';

    items.forEach(function(x){

        let o = document.createElement('option');
        o.value = x;
        o.text = x;
        el.appendChild(o);

    });

}



async function submitLaporan(){

    navigator.geolocation.getCurrentPosition(async function(pos){


        let data = {

            jenisLaporan: document.getElementById("jenisLaporan").value,
            
            nama: document.getElementById('nama').value,

            syif: document.getElementById('syif').value,

            pos: document.getElementById('pos').value,

            pergerakan: "",

            jenisInsiden: "",

            jenisAktiviti: "",

            catatan: document.getElementById('catatan').value,

            lat: pos.coords.latitude,

            lon: pos.coords.longitude,

            gambar: ""

        };

let jenis = document.getElementById("jenisLaporan").value;


if(jenis=="PERGERAKAN"){

    data.pergerakan =
    document.getElementById("kategoriValue").value;

}


if(jenis=="INSIDEN"){

    data.jenisInsiden =
    document.getElementById("kategoriValue").value;

}


if(jenis=="AKTIVITI"){

    data.jenisAktiviti =
    document.getElementById("kategoriValue").value;

}

        const fileInput = document.getElementById("gambar");


        if(fileInput.files.length > 0){


            const file = fileInput.files[0];


            data.gambar = await new Promise(function(resolve){


                const reader = new FileReader();


                reader.onload = function(){

    let base64 = reader.result.split(",")[1];

    resolve(base64);

};


                reader.readAsDataURL(file);


            });


        }



        fetch("https://default0e0db2adc41647c788ecceac4ee767.67.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/19/workflows/07953e5af7794432b838720c743a6ca3/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=C9rK7Xu9xVIVewNZPbp5LU_mmx4qsmx3uAkXTtEIZe8",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });



        console.log(data);

        alert("Laporan berjaya dihantar.");


    });


}



loadMasterData();