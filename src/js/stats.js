import * as myModule from './common.js';

const menuBar = document.querySelector('#menu');
const navigationContent = document.querySelector('#navigation-content');
const searchBtns = document.querySelectorAll('.search-icon');

menuBar.addEventListener('click', function() {
    navigationContent.classList.toggle('max-h-0');
});

searchBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        // Get previous sibling value
        const id = this.previousElementSibling.value;

        if(!id) {
            return;
        }

        myModule.checkId(id);
    })
})

window.addEventListener("DOMContentLoaded", function() {
    let id = this.localStorage.getItem("DotaId");
    id = Number(id);
    myModule.writeProfile(id);
    myModule.writeStats(id);
    myModule.writeMatches(id);
})

