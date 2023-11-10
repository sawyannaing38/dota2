export async function writeProfile(id) {
    
    const ranks = [
        ["SeasonalRank0-0.webp"],
        ["dota-2-rank-herald1.webp","dota-2-rank-herold-2.webp","dota-2-rank-herold-3.webp","dota-2-rank-herold-4.webp","dota-2-rank-herold-5.webp"],
        ["dota-2-rank-guardian-1.webp","dota-2-rank-guardian-2.webp","SeasonalRank2-3.webp","dota-2-rank-guardian-4.webp","dota-2-rank-guardian-5.webp"],
        ["dota-2-rank-crusader-1.webp","dota-2-rank-crusader-2.webp","dota-2-rank-crusader-3.webp","dota-2-rank-crusader-4.webp","dota-2-rank-crusader-5webp"],
        ["dota-2-rank-archon-1.webp","dota-2-rank-archon-2.png","dota-2-rank-archon-3.webp","dota-2-rank-archon-4.webp","dota-2-rank-archon-5.webp"],
        ["dota-2-rank-legend-1.webp","dota-2-rank-legend-2.webp","dota-2-rank-legend-3.webp","dota-2-rank-legend-4.webp","dota-2-rank-legend-5.webp"],
        ["dota-2-rank-ancient-1.webp","dota-2-rank-ancient-2.webp","dota-2-rank-ancient-3.webp","dota-2-rank-ancient-4.webp","dota-2-rank-ancient-5.webp"],
        ["dota-2-rank-divine-1.webp","dota-2-rank-divine-2.webp","dota-2-rank-divine-3.webp","dota-2-rank-divine-4.webp","dota-2-rank-divine-5.webp"],
        ["dota-2-rank-immortal-placed.webp", "dota-2-rank-immortal-top-1000.webp", "dota-2-rank-immortal-top-100.webp","dota-2-rank-immortal-top-10.webp","dota-2-rank-immortal-top-1.webp"]
    ]

    const url = `https://api.opendota.com/api/players/${id}`;

    const response = await fetch(url);

    if(!response.ok) {
        return;
    }

    const result = await response.json();

    const profile = document.querySelector('#profile');

    // Create first div
    const firstDiv = document.createElement("div");
    firstDiv.className = "flex flex-col items-center space-y-1 ml-2.5";

    // Create img
    const image = document.createElement("img");
    image.className = "w-12 h-12 object-cover border-2 border-white";

    image.src = result.profile.avatar;
    image.alt = "Profile";

    // Create a span
    const span = document.createElement("span");
    span.className = "text-white text-xl";
    span.textContent = result.profile.personaname;

    firstDiv.append(image, span);

    profile.append(firstDiv);

    const secondDiv = document.createElement('div');
    secondDiv.className = 'space-y-2.5';

    secondDiv.innerHTML = `
    <div class="space-y-1">
        <h3 class="text-lg text-white">Friend ID</h3>
        <div class="space-x-1 flex items-center">
            <span class="text-sm text-blue">${id}</span>
            <div class="relative">
                <i class="fa-brands fa-steam text-blue text-sm cursor-pointer" id="steam-icon"></i>
                <span class="absolute top-full left-0 w-[200px] bg-blue text-black text-center hidden">Go to Steam Profile</span>
            </div>
        </div>
    </div>
    <button class="text-white border-2 border-blue px-2 hover:border-white hover:text-blue" id="logout-btn">Log Out</button>            
`
    profile.append(secondDiv);

    const steam = document.querySelector('#steam-icon');

    steam.addEventListener('mouseover', function() {
        this.nextElementSibling.classList.remove('hidden');
    })

    steam.addEventListener('mouseleave', function() {
        this.nextElementSibling.classList.add('hidden');
    })

    steam.addEventListener('click', function() {
        window.location.href = 'steam.html';
    })
    
    document.querySelector('#logout-btn').addEventListener('click', function() {
        localStorage.clear('SteamId');
        localStorage.clear('DotaId');

        window.location.href = 'index.html';
    })

    const rankTier = Math.floor(result.rank_tier / 10);
    const stars = result.rank_tier % 10;

    const img = document.createElement('img');
    img.className = 'w-12 mr-2.5';

    img.src = `./images/${ranks[rankTier][stars - 1]}`;
    img.alt = "Rank";

    profile.append(img);

}

export async function writeStats(id) {
    const response = await fetch(`https://api.opendota.com/api/players/${id}/wl`);

    if(!response.ok) {
        return;
    }

    const result = await response.json();

    const stats = document.querySelector('#stats');

    stats.innerHTML = `
    <div class="ml-2.5 box">
        <h3>Wins</h3>
        <span>${result.win}</span>
    </div>
    <div class="box">
        <h3>Loses</h3>
        <span>${result.lose}</span>
    </div>
    <div class="box">
        <h3>Win Rate</h3>
        <span>${((result.win / (result.win + result.lose)) * 100).toFixed(2)}%</span>
    </div>
    <div class="box mr-2.5">
        <h3>Total</h3>
        <span>${result.win + result.lose}</span>
    </div>
    `;
}

export async function writeMatches(id) {
    const parent = document.querySelector('#match');

    let response = await fetch(`https://api.opendota.com/api/players/${id}/recentMatches`);

    if(!response.ok) {
        return;
    }

    response = await response.json();

    const mode = ["Unknown", "All Pick", "Captain Mode", "Random Draft", "Single Draft", "All Random", "Intro", "Diretide",
                "Reversed Captain Mode", "Greeviling", "Tutorial", "Mid Only", "Least Played", "Limited Heros", "Compendium",
                "Custrom", "Captain Draft", "Balanced Draft", "Abality Draft", "Event", "Random Death Match", "1 v 1 Mid",
                "Rank All Pick", "Turbo", "Mutation", "Coach Challenges"];

    
    for(const match of response) {
        // Create div
        const div = document.createElement('div');
        div.className = 'match hidden cursor-pointer hover:shadow-lg hover:shadow-blue';

        let result;

        if(match.player_slot >=0 && match.player_slot <= 4 && match.radiant_win === true) {
            result = 'win';
        }

        else if(match.player_slot >= 128 && match.player_slot <= 132 && match.radiant_win === false) {
            result = 'win';
        }
        else {
            result = 'lose';
        }

        let hero = await fetch('js/heroes.json');
        
        if(!hero.ok) {
            return;
        }

        hero = await hero.json();

        const imagePath = hero[match.hero_id].img;

        if(result === 'win') {
            div.innerHTML = `
        <div class="ml-2.5 flex flex-col items-center space-y-1">
            <img class="w-10" src=${"https://cdn.cloudflare.steamstatic.com" + imagePath} alt="Hero">
            <span>${match.match_id}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>Mode</h3>
            <span>${mode[match.game_mode]}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>K</h3>
            <span>${match.kills}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>D</h3>
            <span>${match.deaths}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>A</h3>
            <span>${match.assists}</span>
        </div>
        <div class="mr-2.5 flex flex-col items-center space-y-1">
            <h3>Result</h3>
            <span class="text-green-400">${result}</span>
        </div>
        `;
        }

        else {
            div.innerHTML = `
        <div class="ml-2.5 flex flex-col items-center space-y-1">
            <img class="w-10" src=${"https://cdn.cloudflare.steamstatic.com" + imagePath} alt="Hero">
            <span>${match.match_id}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>Mode</h3>
            <span>${mode[match.game_mode]}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>K</h3>
            <span>${match.kills}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>D</h3>
            <span>${match.deaths}</span>
        </div>
        <div class="flex flex-col items-center space-y-1">
            <h3>A</h3>
            <span>${match.assists}</span>
        </div>
        <div class="mr-2.5 flex flex-col items-center space-y-1">
            <h3>Result</h3>
            <span class="text-red-400">${result}</span>
        </div>
        `;
        }

        parent.append(div);
    }

    // Select Match
    const matches = document.querySelectorAll('.match');

    const btns = document.querySelectorAll('.btn');

    if(response.length >= 6 && response.length <= 10) {
        console.log('2');
        for(let i = 0; i < 2; i++) {
            btns[i].classList.remove('hidden');
        }
    }

    else if(response.length >= 11 && response.length <= 15) {
        console.log('3');
        for(let i = 0; i < 3; i++) {
            btns[i].classList.remove('hidden');
        }
    }

    else if(response.length >= 16 && response.length <= 20) {
        console.log('4');
        for(let i = 0; i < 4; i++){
            btns[i].classList.remove('hidden');
        }
    }

    // For default match
    for(let i = 0; i < 5; i++) {
        matches[i].style.display = 'flex';
    }

    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const start = this.textContent * 5 - 5;
            const end = this.textContent * 5 - 1;

            for(let i = 0; i < matches.length; i++) {
                if (i >= start && i <= end) {
                    matches[i].style.display = 'flex';
                }

                else {
                    matches[i].style.display = 'none';
                }
            }
        })
    })

    // select all match
    const matchs = document.querySelectorAll('.match')

    matchs.forEach(function(match) {
        match.addEventListener('click', function() {
            // Store the match id
            localStorage.setItem('matchId', this.children[0].children[1].textContent);
            // go to match
            window.location.href = "match.html";
        })
    })


}

export async function writeDetails(id) {
    const body = document.querySelector('body');
    const response = await fetch(`https://api.opendota.com/api/matches/${id}`);

    if(!response.ok) {
        return;
    }

    const result = await response.json();

    // calculate duration
    const duration = result.duration;

    // Convert duration into minutes
    const minutes = (duration / 60).toFixed();
    const seconds = duration % 60;
    
    // Create header
    const header = document.createElement('header');

    header.className = 'my-2.5';

    header.innerHTML = `
    <div class="flex justify-center items-center space-x-5">
        <div class="flex flex-col items-center space-y-2.5 text-radient">
            <h1 class="font-ribeye text-2xl">Radient</h1>
            <span class="font-sans">${result.radiant_score}</span>
        </div>
        <div class="flex flex-col items-center space-y-2.5 text-dire">
            <h1 class="font-ribeye text-2xl">Dire</h1>
            <span class="font-sans">${result.dire_score}</span>
        </div>
    </div>
    <div class="flex flex-col items-center mt-5">
        <h2 class="font-ribeye text-blue text-2xl">Duration</h2>
        <span class="font-sans text-white">${minutes} : ${seconds}</span>
    </div>
    `;

    body.append(header);

    writeRadient(result);
    writeDire(result);
}

export async function writeRadient(obj) {
    const body = document.querySelector('body');
    const main = document.createElement('main');
    // Create a div
    const parent = document.createElement('div');

    // Create a first children div
    const childOne = document.createElement('div');
    childOne.className = 'flex space-x-5 items-center mb-5 lg:justify-center lg:mt-10';

    if(obj.radiant_win) {
        childOne.innerHTML = `
            <h2 class="font-ribeye text-radient text-xl">Radient</h2>
            <div class="bg-black p-2 rounded-sm">
                <span class="text-blue font-roboto text-sm">Victory</span>
            </div>
        `;
    }

    else {
        childOne.innerHTML = `
            <h2 class="font-ribeye text-radient text-xl">Radient</h2>
        `;
    }

    parent.append(childOne);

    // Create second child
    const childTwo = document.createElement('div');
    childTwo.className = 'pb-4 space-y-5 shadow-md shadow-radient';

    // for hero icon
    const heroResponse = await fetch('./js/heroes.json');

    if(!heroResponse.ok) {
        return;
    }

    const hero = await heroResponse.json();

    // for item id
    const itemIdResponse = await fetch('./js/item_ids.json');

    if(!itemIdResponse.ok) {
        return;
    }

    const itemId = await itemIdResponse.json();

    // for item icon
    const itemResponse = await fetch('./js/items.json');

    if(!itemResponse.ok) {
        return;
    }

    const item = await itemResponse.json();
    
    for(let i = 0; i < 5; i++) {
        // Create a div
        const div = document.createElement('div');
        div.className = 'bg-black mx-2 flex items-center space-x-4 justify-between';

        // for items image
        const items = [obj.players[i].item_0, obj.players[i].item_1, obj.players[i].item_2, obj.players[i].item_3, obj.players[i].item_4, obj.players[i].item_5];

        const itemsUrl = [];
        // loop item
        for (const build of items) {
            if(build == 0) {
                itemsUrl.push("./images/empty.jpg");
   
            }

            else {

                itemsUrl.push(`https://cdn.cloudflare.steamstatic.com/${item[itemId[build]].img}`);
            }
        }


        div.innerHTML = `
        <img src="https://cdn.cloudflare.steamstatic.com${hero[obj.players[i].hero_id].img}" alt="hero" class="w-10 ml-2">
        <div class="w-5/6 space-y-5 lg:flex lg:justify-between lg:space-x-2.5 lg:items-center">
            <div class="flex justify-between items-center border-b-2 border-b-blue pb-2.5 lg:w-1/2 lg:border-none">
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">Name</h3>
                    <span class="text-sm text-blue">${obj.players[i].personaname? obj.players[i].personaname : "Anynimous"}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">K</h3>
                    <span class="text-sm text-blue">${obj.players[i].kills}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">D</h3>
                    <span class="text-sm text-blue">${obj.players[i].deaths}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">A</h3>
                    <span class="text-sm text-blue">${obj.players[i].assists}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">GPM</h3>
                    <span class="text-sm text-blue">${obj.players[i].gold_per_min}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">XPM</h3>
                    <span class="text-sm text-blue">${obj.players[i].xp_per_min}</span>
                </div>
            </div>
            <div class="flex justify-center space-x-5 lg:w-1/2">
                <div>
                    <img src="${itemsUrl[0]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[1]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[2]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[3]}" alt="" class="w-10">
                    
                </div>
                <div>
                    <img src="${itemsUrl[4]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[5]}" alt="" class="w-10">
                </div>
            </div>
        </div>
        `;

        childTwo.append(div);
    }

    parent.append(childTwo);
    main.append(parent);
    body.append(main);
}

export async function writeDire(obj) {
    const body = document.querySelector('body');
    const main = document.createElement('main');
    // Create a div
    const parent = document.createElement('div');

    // Create a first children div
    const childOne = document.createElement('div');
    childOne.className = 'flex space-x-5 items-center mb-5 lg:justify-center lg:mt-10';

    if(obj.radiant_win) {
        childOne.innerHTML = `
            <h2 class="font-ribeye text-dire text-xl">Dire</h2>
        `;
    }

    else {
        childOne.innerHTML = `
        <h2 class="font-ribeye text-dire text-xl">Dire</h2>
        <div class="bg-black p-2 rounded-sm">
            <span class="text-blue font-roboto text-sm">Victory</span>
        </div>
        `;
    }

    parent.append(childOne);

    // Create second child
    const childTwo = document.createElement('div');
    childTwo.className = 'pb-4 space-y-5 shadow-md shadow-radient';

    // for hero icon
    const heroResponse = await fetch('./js/heroes.json');

    if(!heroResponse.ok) {
        return;
    }

    const hero = await heroResponse.json();

    // for item id
    const itemIdResponse = await fetch('./js/item_ids.json');

    if(!itemIdResponse.ok) {
        return;
    }

    const itemId = await itemIdResponse.json();

    // for item icon
    const itemResponse = await fetch('./js/items.json');

    if(!itemResponse.ok) {
        return;
    }

    const item = await itemResponse.json();
    
    for(let i = 5; i < 10; i++) {
        // Create a div
        const div = document.createElement('div');
        div.className = 'bg-black mx-2 flex items-center space-x-4 justify-between';

        // for items image
        const items = [obj.players[i].item_0, obj.players[i].item_1, obj.players[i].item_2, obj.players[i].item_3, obj.players[i].item_4, obj.players[i].item_5];

        const itemsUrl = [];
        // loop item
        for (const build of items) {
            if(build == 0) {
                itemsUrl.push("./images/empty.jpg");

            }

            else {

                itemsUrl.push(`https://cdn.cloudflare.steamstatic.com/${item[itemId[build]].img}`);
            }
        }


        div.innerHTML = `
        <img src="https://cdn.cloudflare.steamstatic.com${hero[obj.players[i].hero_id].img}" alt="hero" class="w-10 ml-2">
        <div class="w-5/6 space-y-5 lg:flex lg:justify-between lg:space-x-2.5 lg:items-center">
            <div class="flex justify-between items-center border-b-2 border-b-blue pb-2.5 lg:w-1/2 lg:border-none">
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">Name</h3>
                    <span class="text-sm text-blue">${obj.players[i].personaname? obj.players[i].personaname : "Anynimous"}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">K</h3>
                    <span class="text-sm text-blue">${obj.players[i].kills}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">D</h3>
                    <span class="text-sm text-blue">${obj.players[i].deaths}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">A</h3>
                    <span class="text-sm text-blue">${obj.players[i].assists}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">GPM</h3>
                    <span class="text-sm text-blue">${obj.players[i].gold_per_min}</span>
                </div>
                <div class="flex flex-col items-center space-y-1">
                    <h3 class="text-lg text-white">XPM</h3>
                    <span class="text-sm text-blue">${obj.players[i].xp_per_min}</span>
                </div>
            </div>
            <div class="flex justify-center space-x-5 lg:w-1/2">
                <div>
                    <img src="${itemsUrl[0]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[1]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[2]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[3]}" alt="" class="w-10">
                    
                </div>
                <div>
                    <img src="${itemsUrl[4]}" alt="" class="w-10">
                </div>
                <div>
                    <img src="${itemsUrl[5]}" alt="" class="w-10">
                </div>
            </div>
        </div>
        `;

        childTwo.append(div);
    }

    parent.append(childTwo);
    main.append(parent);
    body.append(main);
}

export function writeHeader() {
    const body = document.querySelector('body');

    const header = document.createElement('header');
    header.className = 'bg-black flex justify-between items-center relative py-2.5';

    header.innerHTML = `
    <div class="flex space-x-2.5 items-center cursor-pointer">
        <img src="./images/logo.png" alt="Logo" class="w-[50px]">
        <h1 class="text-white text-4xl">Dota2 Stats</h1>
    </div>
    <nav class="max-h-0 navigation-main lg:max-h-[200px] mr-10" id="navigation-content">
        <ul class="flex flex-col items-center space-y-2.5 py-2.5 lg:flex-row lg:space-x-2.5 lg:items-center lg:space-y-0">
            <li><a class="text-white hover:text-blue transition-color duration-100" href="">Stats</a></li>
            <li><a class="text-white hover:text-blue transition-color duration-100" href="">Matches</a></li>
        </ul>
    </nav>
    `;

    body.append(header);
}

export async function checkId(id) {
    let user = await fetch(`https://api.opendota.com/api/players/${id}`);

    if(!user.ok) {
        // Call about match
        try {
            let match = await fetch(`https://api.opendota.com/api/matches/${id}`);

            if(!match.ok) {
                alert('Invalid Id or Private Profile');
                return;
            }

            localStorage.setItem('matchId', id);
            window.location.href = 'match.html';
        }

        catch {
            alert('Invalid Id or Private Profile');
            return;
        }
    }

    else {
        user = await user.json();

        if(!user.profile) {
            // Call about match
            try {
                let match = await fetch(`https://api.opendota.com/api/matches/${id}`);
    
                if(!match.ok) {
                    alert('Invalid Id or Private Profile');
                    return;
                }
    
                localStorage.setItem('matchId', id);
                window.location.href = 'match.html';
            }
    
            catch {
                alert('Invalid Id or Private Profile');
                return;
            }
        }

        else {
            // Sotre in local
            localStorage.setItem('searchId', id);

            window.location.href = 'subProfile.html';
        }
    }
    
}

export async function writeSubProfile(id) {
    const ranks = [
        ["SeasonalRank0-0.webp"],
        ["dota-2-rank-herald1.webp","dota-2-rank-herold-2.webp","dota-2-rank-herold-3.webp","dota-2-rank-herold-4.webp","dota-2-rank-herold-5.webp"],
        ["dota-2-rank-guardian-1.webp","dota-2-rank-guardian-2.webp","SeasonalRank2-3.webp","dota-2-rank-guardian-4.webp","dota-2-rank-guardian-5.webp"],
        ["dota-2-rank-crusader-1.webp","dota-2-rank-crusader-2.webp","dota-2-rank-crusader-3.webp","dota-2-rank-crusader-4.webp","dota-2-rank-crusader-5webp"],
        ["dota-2-rank-archon-1.webp","dota-2-rank-archon-2.png","dota-2-rank-archon-3.webp","dota-2-rank-archon-4.webp","dota-2-rank-archon-5.webp"],
        ["dota-2-rank-legend-1.webp","dota-2-rank-legend-2.webp","dota-2-rank-legend-3.webp","dota-2-rank-legend-4.webp","dota-2-rank-legend-5.webp"],
        ["dota-2-rank-ancient-1.webp","dota-2-rank-ancient-2.webp","dota-2-rank-ancient-3.webp","dota-2-rank-ancient-4.webp","dota-2-rank-ancient-5.webp"],
        ["dota-2-rank-divine-1.webp","dota-2-rank-divine-2.webp","dota-2-rank-divine-3.webp","dota-2-rank-divine-4.webp","dota-2-rank-divine-5.webp"],
        ["dota-2-rank-immortal-placed.webp", "dota-2-rank-immortal-top-1000.webp", "dota-2-rank-immortal-top-100.webp","dota-2-rank-immortal-top-10.webp","dota-2-rank-immortal-top-1.webp"]
    ]

    const url = `https://api.opendota.com/api/players/${id}`;

    const response = await fetch(url);

    if(!response.ok) {
        return;
    }

    const result = await response.json();

    const profile = document.querySelector('#profile');

    // Create first div
    const firstDiv = document.createElement("div");
    firstDiv.className = "flex flex-col items-center space-y-1 ml-2.5";

    // Create img
    const image = document.createElement("img");
    image.className = "w-12 h-12 object-cover border-2 border-white";

    image.src = result.profile.avatar;
    image.alt = "Profile";

    // Create a span
    const span = document.createElement("span");
    span.className = "text-white text-xl";
    span.textContent = result.profile.personaname;

    firstDiv.append(image, span);

    profile.append(firstDiv);

    const secondDiv = document.createElement('div');
    secondDiv.className = 'space-y-2.5';

    secondDiv.innerHTML = `
    <div class="space-y-1">
        <h3 class="text-lg text-white">Friend ID</h3>
        <div class="space-x-1 flex items-center">
            <span class="text-sm text-blue">${id}</span>
            <div class="relative">
                <i class="fa-brands fa-steam text-blue text-sm cursor-pointer" id="steam-icon"></i>
                <span class="absolute top-full left-0 w-[200px] bg-blue text-black text-center hidden">Go to Steam Profile</span>
            </div>
        </div>
    </div>
               
`
    profile.append(secondDiv);

    const steam = document.querySelector('#steam-icon');

    steam.addEventListener('mouseover', function() {
        this.nextElementSibling.classList.remove('hidden');
    })

    steam.addEventListener('mouseleave', function() {
        this.nextElementSibling.classList.add('hidden');
    })

    

    const rankTier = Math.floor(result.rank_tier / 10);
    const stars = result.rank_tier % 10;

    const img = document.createElement('img');
    img.className = 'w-12 mr-2.5';

    img.src = `./images/${ranks[rankTier][stars - 1]}`;
    img.alt = "Rank";

    profile.append(img);

}