export async function total(id) {
    try {
        const response = await fetch(`https://api.opendota.com/api/players/${id}/totals`);

        if(!response.ok) {
            return;
        }

        const result = await response.json();

        // Create a div
        const div = document.createElement('div');
        div.className = 'mt-2.5 ml-2.5 mb-8';

        div.innerHTML = `
        <h1 class="font-sans text-white text-2xl mb-5">Total Stats</h1>
        <div class="flex flex-wrap justify-between items-center mx-2.5 space-y-1">
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Last Hits</h2>
                <span class="text-lg">${result[6].sum}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Denies</h2>
                <span class="text-lg">${result[7].sum}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Kills</h2>
                <span class="text-lg">${result[0].sum}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Deaths</h2>
                <span class="text-lg">${result[1].sum}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Assists</h2>
                <span class="text-lg">${result[2].sum}</span>
            </div>
        </div>
        `;

        document.querySelector('body').append(div);

        average(id);
    }

    catch(err) {
        console.error(err);
    }
}

export async function average(id) {
    try {
        const response = await fetch(`https://api.opendota.com/api/players/${id}/matches`);

        if(!response.ok) {
            return;
        }

        const result = await response.json();

        let lastHit = 0;
        let denie = 0;
        let kill = 0;
        let death = 0;
        let assist = 0;
        let gpm = 0;
        let xpm = 0;

        let avgLastHit;
        let avgDenie;
        let avgKill;
        let avgDeath;
        let avgAssist;
        let avgGpm;
        let avgXpm;

        if(result.length < 20) {
            for(const match of result) {
                kill += match.kills;
                death += match.deaths;
                assist += match.assists;

                const matchResponse = await fetch(`https://api.opendota.com/api/matches/${match.match_id}`);

                if(!matchResponse.ok) {
                    return;
                }

                const matchResult = await matchResponse.json();

                const me = matchResult.players.find(obj => obj.player_slot == result[i].player_slot);

                lastHit += me.last_hits;
                denie += me.denies;
                gpm += me.gold_per_min;
                xpm += me.xp_per_min;
            }

            const number = result.length;
            // Calculate avearage
            avgLastHit = (lastHit / number).toFixed();
            avgDenie = (denie / number).toFixed();
            avgKill = (kill / number).toFixed();
            avgDeath = (death / number).toFixed();
            avgAssist = (assist / number).toFixed();
            avgGpm = (gpm / number).toFixed();
            avgXpm = (xpm / number).toFixed();
        }

        else {
            for(let i = 0; i < 20; i++) {
                kill += result[i].kills;
                death += result[i].deaths;
                assist += result[i].assists;

                const matchResponse = await fetch(`https://api.opendota.com/api/matches/${result[i].match_id}`);

                if(!matchResponse.ok) {
                    return;
                }

                const matchResult = await matchResponse.json();

                const me = matchResult.players.find(obj => obj.player_slot == result[i].player_slot);

                lastHit += me.last_hits;
                denie += me.denies;
                gpm += me.gold_per_min;
                xpm += me.xp_per_min;
            }

            avgLastHit = (lastHit / 20).toFixed();
            avgDenie = (denie / 20).toFixed();
            avgKill = (kill / 20).toFixed();
            avgDeath = (death / 20).toFixed();
            avgAssist = (assist / 20).toFixed();
            avgGpm = (gpm / 20).toFixed();
            avgXpm = (xpm / 20).toFixed();
        }

        // Create a div
        const div = document.createElement('div');
        div.className = 'ml-2.5 mb-8';

        div.innerHTML = `
        <h1 class="mb-5 font-sans text-2xl text-white">Average Stats</h1>
        <p class="text-blue text-lg mb-5">
            Average Stats are calculated based on last 20 games.
        </p>
        <div class="flex flex-wrap justify-between items-center mx-2.5 space-y-1">
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Last Hits</h2>
                <span class="text-lg">${avgLastHit}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Denies</h2>
                <span class="text-lg">${avgDenie}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Kills</h2>
                <span class="text-lg">${avgKill}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Deaths</h2>
                <span class="text-lg">${avgDeath}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">Assists</h2>
                <span class="text-lg">${avgAssist}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">GPM</h2>
                <span class="text-lg">${avgGpm}</span>
            </div>
            <div class="text-center basis-[140px] space-y-1 border-2 border-blue text-white font-sans">
                <h2 class="text-xl">XPM</h2>
                <span class="text-lg">${avgXpm}</span>
            </div>
        </div>;
        `;

        document.querySelector('body').append(div);
        hero(id);
    }   

    catch(err) {
        console.error(err);
    }
}

export async function hero(id) {
    try {
        const response = await fetch(`https://api.opendota.com/api/players/${id}/heroes`);
        const heroResponse = await fetch('./js/heroes.json');

        if(!response.ok || !heroResponse.ok) {
            return;
        }

        const result = await response.json();
        const hero = await heroResponse.json();

        // Create a grandparnet div
        const grandParent = document.createElement('div');
        grandParent.className = 'mx-2.5 mb-8';

        grandParent.innerHTML = `
        <h1 class="text-white text-2xl font-sans mb-5 lg:text-center">Hero Stats</h1>
        `;

        // Create a parent div
        const parent = document.createElement('div');
        parent.className = 'h-[100vh] overflow-y-scroll space-y-2.5';

        // loop the result
        for(const champion of result) {
            // Get hero icon
            const icon = `https://cdn.cloudflare.steamstatic.com${hero[champion.hero_id].img}`;

            // Get play stats
            const totalPlay = champion.games;
            const winPlay = champion.win;
            const winRate = ((winPlay / totalPlay) * 100).toFixed(2);

            // Get against stats
            const totalAgainst = champion.against_games;
            const winAgainst = champion.against_win;
            const againstWinRate = ((winAgainst / totalAgainst) * 100).toFixed(2);

            // Crate a child div
            const child = document.createElement('div');
            child.className = 'cursor-pointer w-[90%] ml-2.5 lg:mx-auto flex items-center justify-between space-x-8 border-2 border-white overflow-hidden game';

            child.innerHTML = `
            <img src="${icon}" alt="Hero Icon" class="w-20 ml-2.5">
            <div class="flex justify-between items-center space-x-5">
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Total</h2>
                    <span class="text-blue">${totalPlay}</span>
                </div>
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Win</h2>
                    <span class="text-radient">${winPlay}</span>
                </div>
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Lost</h2>
                    <span class="text-dire">${totalPlay - winPlay}</span>
                </div>
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Win Rate</h2>
                    <span class="text-blue">${winRate}%</span>
                </div>
            </div>
            <div class="flex items-center space-x-5 pr-2.5">
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Total Against</h2>
                    <span class="text-blue">${totalAgainst}</span>
                </div>
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Win Against</h2>
                    <span class="text-radient">${winAgainst}</span>
                </div>
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Lost Against</h2>
                    <span class="text-dire">${totalAgainst - winAgainst}</span>
                </div>
                <div class="text-center space-y-1 font-sans">
                    <h2 class="text-white">Win Rate</h2>
                    <span class="text-radient">${againstWinRate}%</span>
                </div>
            </div>
            `;

            parent.append(child);
        }

        grandParent.append(parent);
        document.querySelector('body').append(grandParent);
        peer(id);
    }

    catch(err) {
        console.error(err);
    }
}

export async function peer(id) {
    try {
        const response = await fetch(`https://api.opendota.com/api/players/${id}/peers`);

        if(!response.ok) {
            return;
        }

        const result = await response.json();
        console.log(result);

        // Create a grandparent div
        const grandParent = document.createElement('div');
        grandParent.className = 'mx-2.5 mb-8';

        grandParent.innerHTML = `
        <h1 class="text-white text-2xl font-sans mb-5 lg:text-center">Peers</h1>
        `;

        // Create a parnet div
        const parent = document.createElement('div');
        parent.className = 'h-[100vh] overflow-y-scroll space-y-2.5';

        const months = ["Janaury", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // loop the result
        for(const player of result) {
            // Get name and icon
            const name = player.personaname;
            const icon = player.avatarfull;

            // Get last play date,total, win lose winRate
            const date = new Date(player.last_played * 1000);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const lastPlay = `${day}/${month}/${year}`;

            const totalPlay = player.games;
            const winPlay = player.win;
            const winRate = ((winPlay / totalPlay) * 100).toFixed(2);

            // Get against stats
            const totalAgainst = player.against_games;
            const winAgainst = player.against_win;
            const againstWinRate = ((winAgainst / totalAgainst) * 100).toFixed(2);

            // Create a div
            const child = document.createElement('div');
            child.className = 'cursor-pointer overflow-x-hidden w-[90%] lg:mx-auto ml-2.5 bg-black flex justify-between align-center space-x-5 border-2 border-white py-1 game';

            child.innerHTML = `
            <div class="flex flex-col space-y-1 items-center ml-2.5 basis-[200px]">
                <img src="${icon}" alt="Profile" class="w-20 border-2 border-white">
                <span class="text-white font-sans text-lg">${name}</span>
            </div>
            <div class="flex items-center space-x-5">
                <div class="flex flex-col space-y-1 items-center basis-[150px] shrink-0">
                    <h2 class="text-white font-sans">LastPlayed</h2>
                    <span class="text-blue text-center">${lastPlay}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">PlayWith</h2>
                    <span class="text-blue">${totalPlay}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">winWith</h2>
                    <span class="text-radient">${winPlay}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">loseWith</h2>
                    <span class="text-dire">${totalPlay - winPlay}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">Win Rate</h2>
                    <span class="text-radient">${winRate}%</span>
                </div>
            </div>
            <div class="flex items-center space-x-5 pr-2.5">
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">Total Against</h2>
                    <span class="text-blue">${totalAgainst}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">Win Against</h2>
                    <span class="text-radient">${winAgainst}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">Lose Against</h2>
                    <span class="text-dire">${totalAgainst - winAgainst}</span>
                </div>
                <div class="flex flex-col space-y-1 items-center">
                    <h2 class="text-white font-sans">Win Rate</h2>
                    <span class="text-radient">${againstWinRate}%</span>
                </div>
            </div>  
            `;

            parent.append(child);
        }

        grandParent.append(parent);
        document.querySelector('body').append(grandParent);

        const scrollContainers = document.querySelectorAll('.game');

        let isScroll = false;
        let initialX;
        let intialScroll;

        scrollContainers.forEach(scrollContainer => {
            scrollContainer.addEventListener('mousedown', function(e) {
                e.preventDefault();
                // Notice the scroll is ready 
                isScroll = true;
            
                // Get the current position of cursor inside scrollContainer
                initialX = e.pageX;
            
                // Get the current position of the scrollContainer
                intialScroll = this.scrollLeft;
                console.log('mouse Down');
            })
        })

        scrollContainers.forEach(scrollContainer => {
            scrollContainer.addEventListener('mouseup', function() {
                // Notice that scoll is undone
                isScroll = false;
                console.log('Mouse Up');
            })
        })

        scrollContainers.forEach(scrollContainer => {
            scrollContainer.addEventListener('mousemove', function(e) {
                if (!isScroll) {
                    return;
                }
            
                // Get the current Position of mouse cursor
                const currentX = e.pageX;
            
                // Get the distance the mosue move
                const move = currentX - initialX;
            
                // Move the content along with it
                this.scrollLeft = intialScroll - move;
                console.log('Mouse Move');
            })
        })
 
    }

    catch(err) {
        console.error(err);
    }
}