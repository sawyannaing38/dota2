import * as myModule from './common.js';

window.addEventListener('DOMContentLoaded', function() {
    // Get match id from local
    const id = this.localStorage.getItem('matchId');

    myModule.writeDetails(id);
})

