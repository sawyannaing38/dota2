let index = 0;

window.addEventListener('DOMContentLoaded', function() {
    let id;
    const url = this.window.location.href;

    const ref = url.split("ref=")[1];

    if(ref === 'stats') {
        id = this.localStorage.getItem('DotaId');
        writeMatches(id);
    }

    else {
        id = this.localStorage.getItem('searchId');
        writeMatches(id);
    }

    const searchBtn = this.document.querySelector('#search-btn');
    const dateInput = this.document.querySelector('#date');
    const hero = this.document.querySelector('#hero');

    searchBtn.addEventListener('click', function() {

        if(!dateInput.value && hero.value === 'all') {
            location.reload();
            return;
        }

        filterIndex = 0;


        const filterMatches = document.querySelectorAll('.filter');
        filterMatches.forEach(match => match.remove());
        
        document.querySelector('#parent').classList.add('hidden');

        // Call a function 
        showDate(dateInput, hero, id);
    })
})

async function writeMatches(id) {
    try {
        const response = await fetch(`https://api.opendota.com/api/players/${id}/matches`);
        const heroResponse = await fetch('./js/heroes.json')

        if(!response.ok || !heroResponse.ok) {
            return;
        }

        const result = await response.json();
        const heroes = await heroResponse.json();

        const length = result.length;

        // Check the lenght of the result
        if(length <= 15) {
            
            // loop all match and show
            for(let i = 0; i < length; i++) {

                addMatch(result, i, heroes)
            }
        }

        else {
            addFixedMatches(result, heroes);
        }
    }

    catch(err) {
        console.log(err);
    }
}

function addMatch(result, i, heroes) {
    // Select the parent div
    const parent = document.querySelector('#parent');

    const mode = ['Normal', 'Practice', 'Tournament', 'Tutorial', 'Coop Bots', 'Ranked Team MM', 'Ranked Solo MM', 'Ranked', '1v1 Mid', 'Battle Cup', 'Local Bots', 'Spectator', 'Event', 'Gantlet', 'New Player', 'Featured']

    const months = ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Create a div with game class
    const div = document.createElement('div');
    div.className = 'game';

    // Create the first div
    const first = document.createElement('div');
    first.className = 'flex flex-col items-center space-y-1 ml-2.5 basis-[150px]';

    // Create second div
    const second = document.createElement('div');
    second.className = 'flex items-center space-x-5 mr-2.5';

    // Calculate the date
    const date = new Date(result[i].start_time * 1000);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const playDate = `${day}/${month}/${year}`;
    
    // Getting icon
    const icon = `https://cdn.cloudflare.steamstatic.com${heroes[result[i].hero_id].img}`;

    first.innerHTML = `
    <img src="${icon}" class="w-20">
    <span class="text-blue">${playDate}</span>
    <span class="hidden">${result[i].hero_id}</span>
    `;

    second.innerHTML = `
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Match ID</h3>
        <span class="text-lg">${result[i].match_id}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Mode</h3>
        <span class="text-lg">${mode[result[i].lobby_type]}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Kill</h3>
        <span class="text-lg">${result[i].kills}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Death</h3>
        <span class="text-lg">${result[i].deaths}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Assists</h3>
        <span class="text-lg">${result[i].assists}</span>
    </div>`;

    // Calculate result
    let gameResult;

    if((result[i].player_slot >= 0 && result[i].player_slot <= 4) && result[i].radiant_win) {
        gameResult = 'Win';
    }

    else if((result[i].player_slot >= 128 && result[i].player_slot <= 132) && !result[i].radiant_win) {
        gameResult = 'Win';
    }

    else {
        gameResult = 'Lose';
    }

    // Create a div
    const child = document.createElement('div');
    child.className = 'flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0';

    if(gameResult === 'Win') {
        child.innerHTML = `
            <h3 class="text-xl">Result</h3>
            <span class="text-lg text-radient">Win</span>
        `;
    }

    else {
        child.innerHTML = `
        <h3 class="text-xl">Result</h3>
        <span class="text-lg text-dire">Lose</span>
        `;
    }

    second.append(child);
    div.append(first, second);

    div.addEventListener('click', function() {
        // Save match id in the local Storage and go to match
        const id = second.children[0].children[1].textContent;

        localStorage.setItem('matchId', id);
        window.location.href = 'match.html';
    })
    parent.append(div);
}

function addFixedMatches(result, heroes) {

    const start = index * 15;
    const end = start + 15;

    // loop first 15 matches
    for(let i = start; i < end; i++) {

        if(i >= result.length) {
            return;
        }

        addMatch(result, i, heroes);
    }

    // Adding show more button
    const div = document.querySelector('#parent');

    // Create a div
    const child = document.createElement('div');
    child.className = 'bg-white text-center font-roboto cursor-pointer py-1 text-black lg:mx-auto max-w-[1000px] hover:bg-blue hover:scale-[0.99] transition-all duration-75';
    child.innerHTML = `
    <span>Show More</span>
    `;

    div.append(child);

    child.addEventListener('click', function() {
        // remove child
        child.remove();

        // Add 1 to index
        index += 1;
        addFixedMatches(result, heroes);
    })
}

async function showDate(dateInput, hero, id) {
    try {
        const response = await fetch(`https://api.opendota.com/api/players/${id}/matches`);
        const heroResponse = await fetch('./js/heroes.json');

        if(!response.ok || !heroResponse.ok) {
            return;
        }

        const result = await response.json();
        const heroes = await heroResponse.json();

        // An empty array to store all matching match
        const matches = [];

        const months = ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        for(const game of result) {

            if(!dateInput.value) {
                
                // Check only hero id
                if(game.hero_id == hero.value) {
                    matches.push(game);
                }
            }

            else {
                // Calculate date
                const date = new Date(game.start_time * 1000);

                const day = date.getDate();
                const month = months[date.getMonth()];
                const year = date.getFullYear();

                const playDate = `${day}/${month}/${year}`;

                if(hero.value == 'all') {
                    // Check only date
                    if(playDate === dateInput.value) {
                        matches.push(game);
                    }
                }

                else {
                    // Check both hero id and date
                    if(playDate === dateInput.value && game.hero_id == hero.value) {
                        matches.push(game);
                    }
                }
            }
        }

        // show the match
        const length = matches.length;
        if(length === 0) {
            return;
        }

        else if(length <= 15) {
            // loop all match and show
            for(let i = 0; i < length; i++) {
                addFilterMatch(matches, i, heroes);
            }
        }

        else {
            addFixedFilterMatch(matches, heroes);
        }

    }

    catch(err) {
        console.log(err);
    }
}

function addFilterMatch(result, i, heroes) {
    const parent = document.querySelector('#filterMatch');
    
    const mode = ['Normal', 'Practice', 'Tournament', 'Tutorial', 'Coop Bots', 'Ranked Team MM', 'Ranked Solo MM', 'Ranked', '1v1 Mid', 'Battle Cup', 'Local Bots', 'Spectator', 'Event', 'Gantlet', 'New Player', 'Featured']

    const months = ['Janauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Create a div with game class
    const div = document.createElement('div');
    div.className = 'game filter';

    // Create the first div
    const first = document.createElement('div');
    first.className = 'flex flex-col items-center space-y-1 ml-2.5 basis-[150px]';

    // Create second div
    const second = document.createElement('div');
    second.className = 'flex items-center space-x-5 mr-2.5';

    // Calculate the date
    const date = new Date(result[i].start_time * 1000);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const playDate = `${day}/${month}/${year}`;
    
    // Getting icon
    const icon = `https://cdn.cloudflare.steamstatic.com${heroes[result[i].hero_id].img}`;

    first.innerHTML = `
    <img src="${icon}" class="w-20">
    <span class="text-blue">${playDate}</span>
    <span class="hidden">${result[i].hero_id}</span>
    `;

    second.innerHTML = `
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Match ID</h3>
        <span class="text-lg">${result[i].match_id}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Mode</h3>
        <span class="text-lg">${mode[result[i].lobby_type]}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Kill</h3>
        <span class="text-lg">${result[i].kills}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Death</h3>
        <span class="text-lg">${result[i].deaths}</span>
    </div>
    <div class="flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0">
        <h3 class="text-xl">Assists</h3>
        <span class="text-lg">${result[i].assists}</span>
    </div>`;

    // Calculate result
    let gameResult;

    if((result[i].player_slot >= 0 && result[i].player_slot <= 4) && result[i].radiant_win) {
        gameResult = 'Win';
    }

    else if((result[i].player_slot >= 128 && result[i].player_slot <= 132) && !result[i].radiant_win) {
        gameResult = 'Win';
    }

    else {
        gameResult = 'Lose';
    }

    // Create a div
    const child = document.createElement('div');
    child.className = 'flex flex-col space-y-1 items-center text-blue basis-[120px] shrink-0';

    if(gameResult === 'Win') {
        child.innerHTML = `
            <h3 class="text-xl">Result</h3>
            <span class="text-lg text-radient">Win</span>
        `;
    }

    else {
        child.innerHTML = `
        <h3 class="text-xl">Result</h3>
        <span class="text-lg text-dire">Lose</span>
        `;
    }

    second.append(child);
    div.append(first, second);

    div.addEventListener('click', function() {
        // Save match id in the local Storage and go to match
        const id = second.children[0].children[1].textContent;

        localStorage.setItem('matchId', id);
        window.location.href = 'match.html';
    })

    parent.append(div);
}

function addFixedFilterMatch(result, heroes) {
    const start = filterIndex * 15;
    const end = start + 15;

    // loop first 15 matches
    for(let i = start; i < end; i++) {

        if(i >= result.length) {
            return;
        }

        addFilterMatch(result, i, heroes);
    }

    // Adding show more button
    const div = document.querySelector('#filterMatch');

    // Create a div
    const child = document.createElement('div');
    child.className = 'filter bg-white text-center font-roboto cursor-pointer py-1 text-black lg:mx-auto max-w-[1000px] hover:bg-blue hover:scale-[0.99] transition-all duration-75';
    child.innerHTML = `
    <span>Show More</span>
    `;

    div.append(child);

    child.addEventListener('click', function() {
        // remove child
        child.remove();

        // Add 1 to index
        filterIndex += 1;
        addFixedFilterMatch(result, heroes);
    })
}