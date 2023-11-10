window.addEventListener('DOMContentLoaded', function() {
    const id = this.localStorage.getItem('SteamId');
    writePage(id);
})

async function writePage(id) {
    try {
        const myKey = '5572C2B87666609EBCACB5B99D66C0B1';

        const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${myKey}&steamids=${id}`);
        const countriesResponse = await fetch('./js/countries.json');

        if(!response.ok || !countriesResponse.ok) {
            return;
        }

        const result = await response.json();
        const countries = await countriesResponse.json();

        const months = ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const player = result.response.players[0];

        // Calculate created time
        const date = new Date(1000 * player.timecreated);

        const day1 = date.getDate();
        const month1 = months[date.getMonth()];
        const year1 = date.getFullYear();

        const createdDate = `${day1}/${month1}/${year1}`;

        // Get image icon
        const icon = player.avatarfull;

        // Get peronsname
        const name = player.personaname;

        // Get last login time
        const date1 = new Date(1000 * player.lastlogoff);

        const day2 = date1.getDate();
        const month2 = months[date1.getMonth()];
        const year2 = date1.getFullYear();

        const lastLoginDate = `${day2}/${month2}/${year2}`;

        // Get Country
        const country = countries[player.loccountrycode].name;

        // Get city
        const city = countries[player.loccountrycode].states[player.locstatecode].cities[player.loccityid].name;

        // Selecting prfile
        const profile = document.querySelector('#profile');

        profile.innerHTML = `
        <div class="mx-auto flex flex-col space-y-5 items-center md:flex-row md:space-x-5 lg:mx-0">
            <div class="flex flex-col space-y-1 items-center">
                <img src="${icon}" alt="Profile" class="w-20 border-2 border-black shadow-imageBox">
                <span class="text-2xl text-blue drop-shadow-textShadow">${name}</span>
            </div>
            <div class="flex justify-between space-x-5 border-t-2 border-t-blue pt-2.5 md:flex-col md:space-y-5 md:items-center md:space-x-0 md:border-t-0 md:border-l-2 md:border-l-blue md:pl-2.5">
                <div class="flex flex-col items-center space-y-1">
                    <h2 class="text-white text-2xl font-sans">Country</h2>
                    <span class="font-sans text-lg text-blue">${country}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h2 class="text-white text-2xl font-sans">City</h2>
                    <span class="font-sans text-lg text-blue">${city}</span>
                </div>
            </div>
        </div>
        <div class="mx-2.5 flex justify-between items-center lg:space-x-8">
            <div class="flex flex-col space-y-1 items-center">
                <h2 class="text-white font-sans text-2xl">Time Created</h2>
                <span class="text-blue text-lg font-sans">${createdDate}</span>
            </div>
            <div class="flex flex-col space-y-1 items-center">
                <h2 class="text-white font-sans text-2xl">Last Login</h2>
                <span class="text-blue text-lg font-sans">${lastLoginDate}</span>
            </div>
        </div>
        `;

        try {
            const response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${myKey}&steamid=${id}&relationship=friend`);

            if(!response.ok) {
                return;
            }

            const result = await response.json();

            // Write Friends
            writeFriends(result, countries, id);
        }

        catch(err) {
            console.log(err);
        }
        
    }

    catch(err) {
        console.log(err);
    }
}

async function writeFriends(result, countries, id) {
    const myKey = '5572C2B87666609EBCACB5B99D66C0B1';
    const months = ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const friends = result.friendslist.friends;
    
    // Select friend
    const parent = document.querySelector('#friends')

    for(const friend of friends) {

        // Calculate date become frineds
        const date = new Date(1000 * friend.friend_since);

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        const friendDate = `${day}/${month}/${year}`;

        try {
            const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${myKey}&steamids=${friend.steamid}`);

            if(!response.ok) {
                return;
            }

            const result = await response.json();
            const player = result.response.players[0];

            // Get Profile url 
            const icon = player.avatarfull;

            // Get name
            const name = player.personaname;

            // Get country
            let country;

            try {
                country = countries[player.loccountrycode].name;
            }

            catch(err) {
                country = "Unavailable";
            }
            

            // Create a div
            const div = document.createElement('div');
            div.className = 'info border-blue shadow-profileBox';

            div.innerHTML = `
            <div class="flex flex-col space-y-1 items-center py-2.5 ml-2.5 basis-[150px]">
                <img src="${icon}" alt="Profile" class="w-14 shadow-profileBox">
                <span class="text-lg text-radient drop-shadow-greenShadow text-center">${name}</span>
            </div>
            <div class="flex space-x-8 items-center mr-2.5 basis-[300px]">
                <div class="flex flex-col space-y-1 items-center basis-[100px]">
                    <h2 class="text-xl text-white font-sans">Country</h2>
                    <span class="text-radient text-lg drop-shadow-greenShadow">${country}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center basis-[100px]">
                    <h2 class="text-xl text-white font-sans">Friend Since</h2>
                    <span class="text-radient text-lg drop-shadow-greenShadow">${friendDate}</span>
                </div>
            </div>
            `;

            parent.append(div);
        }

        catch(err) {
            console.log(err);
        }
    }

    writeGame(id);
}


async function writeGame(id) {
    const myKey = '5572C2B87666609EBCACB5B99D66C0B1';

    const parent = document.querySelector('#games');

    try {
        const response = await fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${myKey}&steamid=${id}&format=json`);

        if(!response.ok) {
            return;
        }

        const result = await response.json();
        
        if(Object.entries(result).length === 0) {
            parent.innerHTML = '<p class="text-center text-white font-sans text-2xl">Nothing Here</p>';
            return;
        }

        // loop
        for(const game of result.response.games) {

            const hours = Math.floor(game.playtime_forever / 60);
            const minutes = game.playtime_forever % 60;

            const totalPlayTime = `${hours}hrs/${minutes}mins`;
            console.log(minutes);
            

            // Calculate last 2 weeks played hours
            const lastHours = Math.floor(game.playtime_2weeks / 60);
            const lastMinutes = game.playtime_2weeks % 60;

            const last2WeekPlayTime = `${lastHours}hrs/${lastMinutes}mins`;

            // Get name
            const name = game.name;

            // Get image
            const icon = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

            // Create a div
            const div = document.createElement('div');
            div.className = 'info border-radient shadow-imageBox';

            div.innerHTML = `
            <div class="ml-2.5 flex flex-col space-y-1 items-center">
                <h2 class="text-white font-sans text-xl">Game</h2>
                <img src="${icon}" alt="game" class="w-10">
            </div>
            <div class="flex flex-col space-y-1 items-center">
                <h2 class="text-white font-sans text-xl">Total Hours</h2>
                <span class="text-blue text-lg">${totalPlayTime}</span>
            </div>
            <div class="mr-2.5 flex flex-col space-y-1 items-center">
                <h2 class="text-white font-sans text-xl">Last 2 Weeks</h2>
                <span class="text-blue text-lg">${last2WeekPlayTime}</span>
            </div>
            `;

            parent.append(div);
        }
    }

    catch(err) {
        console.log(err);
    }
}