import * as myModule from './common.js';

const menuBar = document.querySelector('#menu');
const navigationContent = document.querySelector('#navigation-content');

menuBar.addEventListener('click', function() {
    navigationContent.classList.toggle('max-h-0');
});

window.addEventListener('DOMContentLoaded', function() {
    let id = this.localStorage.getItem("searchId");
    id = Number(id);
    myModule.writeSubProfile(id);
    myModule.writeStats(id);
    myModule.writeMatches(id);
})