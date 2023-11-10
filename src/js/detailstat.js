import * as myModule from './common1.js';

window.addEventListener('DOMContentLoaded', function() {
    const url = this.window.location.href;
    const ref = url.split("?ref=")[1];

    if(ref === 'stats') {
        const id = this.localStorage.getItem('DotaId');
        myModule.total(id);
    }

    else {
        const id = this.localStorage.getItem('searchId');
        myModule.total(id);
    }
})