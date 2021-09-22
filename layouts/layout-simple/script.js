function convertTimer(timer) {
    if (timer.toString().length === 1) {
        return '0' + timer;
    }
    return timer;
}

PB.on('statusChange', newStatus => {
});

PB.on('newState', newState => {
    console.log(newState);
    const state = newState.state;
    const config = state.config.frontend;

    let activeTeam = 'blue';
    if (state.redTeam.isActive) {
        activeTeam = 'red';
    }

    // Update timers
    if (activeTeam === 'blue' || activeTeam === 'red') {
        document.getElementById('timer').innerText = ':' + convertTimer(state.timer);
    }


    // Update team names
    document.getElementById('blue_name').innerText = config.blueTeam.name;
    document.getElementById('red_name').innerText = config.redTeam.name;

    // Update score
    document.getElementById('blue_score').innerText = config.blueTeam.score;
    document.getElementById('red_score').innerText = config.redTeam.score;
    
    // Update phase
    document.getElementById('phase').innerText = state.state;
    // Patch
    document.getElementById('patch').innerText = 'PATCH ' + config.patch;

    // Update picks
    const updatePicks = team => {
        const teamData = team === 'blue' ? state.blueTeam : state.redTeam;
        console.log(teamData);

        teamData.picks.forEach((pick, index) => {
            const splash = document.getElementById(`picks_${team}_splash_${index}`);
            const text = document.getElementById(`picks_${team}_text_${index}`);
            const champ = document.getElementById(`picks_${team}_champ_${index}`)
            const bg = document.getElementById(`picks_fig_${team}_${index}`)
            const pick_animation = document.getElementById(`pick_${team}_${index}`)
            //const pick_item = document.getElementById(`picks_item_${team}_${index}`)

            if (pick.champion.id === 0) {
                // Not picked yet, hide
                splash.classList.add('hidden');
            } else {
                // We have a pick to show
                splash.src = PB.toAbsoluteUrl(pick.champion.splashCenteredImg);
                splash.classList.remove('hidden');
                champ.innerText = pick.champion.name
                bg.classList.add('dark_bg')
            }

            // Animation when ban/pick phase starts
            if(document.getElementById('phase').textContent === 'BAN PHASE 1' || 'PICK PHASE 1') {
                // Picks
                document.getElementById('picks_blue').classList.remove('picks__hidden')
                document.getElementById('picks_red').classList.remove('picks__hidden')
                //document.getElementById(`picks_item_${team}_${index}`).classList.add(`pick_item_${index}`)
                //* Show all the picks when champion select starts
                document.getElementById(`picks_item_blue_0`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_blue_1`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_blue_2`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_blue_3`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_blue_4`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_red_0`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_red_1`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_red_2`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_red_3`).classList.remove('pick__hidden')
                document.getElementById(`picks_item_red_4`).classList.remove('pick__hidden')
                // Bans
                document.getElementById('footer').firstElementChild.classList.remove('bans__hidden')
                document.getElementById('footer').lastElementChild.classList.remove('bans__hidden')

                // Header
                document.getElementById('header__container').classList.add('header--bg-color')
                document.getElementById('header__blue').classList.remove('header__blue--hidden')
                document.getElementById('header__timer').classList.remove('header__timer--hidden')
                document.getElementById('header__red').classList.remove('header__red--hidden')
            }

            text.innerText = pick.displayName;

            // Animation when is picking
            if(pick.isActive && team === 'blue') {
                pick_animation.classList.add('picks-blue--active')
                console.log(`Pick ${team} b team ${index}`)
            } else {
                pick_animation.classList.remove('picks-blue--active')
                console.log(`Pick ${team} b team ${index}`)
            }
            
            if(pick.isActive && team === 'red') {
                pick_animation.classList.add('picks-red--active')
                console.log(`Pick ${team} b team ${index}`)
            } else {
                pick_animation.classList.remove('picks-red--active')
                console.log(`Pick ${team} b team ${index}`)
            }
        });

        teamData.bans.forEach((ban, index) => {
            const splash = document.getElementById(`bans_${team}_splash_${index}`);
            const border = document.getElementById(`bans_${team}_item_${index}`)
            const ban_animation = document.getElementById(`ban_${team}_${index}`)

            if (ban.champion.id === 0) {
                // Not banned yet, hide
                //splash.classList.add('bans__hidden');
                border.classList.add('bans__hidden-border');
            } else {
                // We have a ban to show
                splash.src = PB.toAbsoluteUrl(ban.champion.squareImg);
                //splash.classList.remove('bans__hidden');
                border.classList.remove('bans__hidden-border');
            }

            // Animation when is banning
            if(ban.isActive && team === 'blue') {
                ban_animation.classList.add('bans-blue--active')
            } else {
                ban_animation.classList.remove('bans-blue--active')
            }
            
            if(ban.isActive && team === 'red') {
                ban_animation.classList.add('bans-red--active')
            } else {
                ban_animation.classList.remove('bans-red--active')
            }
        });
    };
    updatePicks('blue');
    updatePicks('red');
});

PB.on('heartbeat', newHb => {
    Window.CONFIG = newHb.config;
});

PB.on('champSelectStarted', () => {
});
PB.on('champSelectEnded', () => {
});

PB.start();

function parseHTML(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}

// dynamically inject picks
function inject(team) {
    const pickTemplate = `

    <li class="picks__item picks_item_%id% pick__hidden" id="picks_item_${team}_%id%">
        <figure class="picks__fig" id="picks_fig_${team}_%id%">
            <img src="" id="picks_${team}_splash_%id%" class="picks__img">
            <figcaption class="picks__cap">
                <span class="picks__champion-name" id="picks_${team}_champ_%id%"></span>
                <span class="picks__summoner-name" id="picks_${team}_text_%id%"></span>
            </figcaption>
            <div class="border"></div>
        </figure>
        <div class="picks__bg" id="pick_${team}_%id%"></div>
    </li>
`;

    const banTemplate = `
    
    <li class="bans__item bans__hidden-border" id="bans_${team}_item_%id%">
        <div class="bans__stick"></div>
        <img src="" id="bans_${team}_splash_%id%" class="hidden bans__img">
        <div class="bans__bg" id="ban_${team}_%id%"></div>
    </li>
`;

    for (let i = 0; i < 5; i++) {
        const adaptedPickTemplate = pickTemplate.replace(/%id%/g, i);
        document.getElementById('picks_' + team).appendChild(parseHTML(adaptedPickTemplate));

        const adaptedBanTemplate = banTemplate.replace(/%id%/g, i);
        document.getElementById('bans_' + team).appendChild(parseHTML(adaptedBanTemplate));
    }
}
inject('blue');
inject('red');

/*
 * Jinx
 * Maokai
 * Poppy
 * Taliyah
 * Taric
 * Trynda
 * Vladimir
 * Zed
 * Zoe
 */

/*
* Akshan
Anivia 
AO
Fiddle
Fiora - O
Maokai - O
Orianna - O
Poppy - O
Rammus
Sivir
Taliyah - O
WW
Xayah - O
Zoe - O?
*/