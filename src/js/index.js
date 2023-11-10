const steamInput = document.querySelector('#steam');
const dotaInput = document.querySelector('#dota2');

const loginBtn = document.querySelector('#login');
const errorMessage = document.querySelector('#error');


window.addEventListener("DOMContentLoaded", function() {
    const id = this.localStorage.getItem("SteamId");

    if(id) {
        this.window.location.href = "stats.html";
    }
})

steamInput.addEventListener("keyup", function() {
    checkInput(this,17);
})

dotaInput.addEventListener("keyup", function() {
    checkInput(this,10);
})

loginBtn.addEventListener("click", function() {

    // Check the length of both id
    const steamId = steamInput.value;
    const dotaId = dotaInput.value;

    if(!steamId || !dotaId) {
        errorMessage.textContent = "Fill all the box";
        return;
    }

    if(steamId.length != 17) {
        errorMessage.textContent = "Provide valid steam ID";
        return;
    }

    if(dotaId.length != 10) {
        errorMessage.textContent = "Provide valid Dota2 ID";
        return;
    }

    fetch(`https://api.opendota.com/api/players/${dotaId}`)
    .then(res => {
        if(res.ok) {
            return res.json();
        }
    }).then(result => {
        try {
            if(result.profile.steamid === steamId) {
                errorMessage.textContent = "";
                dotaInput.value = "";
                steamInput.value = "";

                localStorage.setItem("SteamId", steamId);
                localStorage.setItem("DotaId", dotaId);

                window.location.href = "stats.html";
            }
        }

        catch(err) {
            console.log(err);
            errorMessage.textContent = "Inrelated Steam Id and Dota Id";
        }
    })
    .catch(err => {
        console.log(err);
    });

})


// function
function checkInput(obj, length) {
    const id = obj.value;

    if(!id) {
        obj.style.borderColor = "white";
        return;
    }

    if(id.length === length) {
        obj.style.borderColor = "green";
    }

    else {
        obj.style.borderColor = "red";
    }
}