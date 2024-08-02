function changeTheme() {
    let currentTheme = document.querySelector('html').getAttribute('data-theme');
    if (currentTheme == 'dim') {
        document.querySelector('html').setAttribute('data-theme', 'winter');
        localStorage.setItem('data-theme', 'winter');
        document.getElementById("theme").setAttribute('src', "/img/brightness-high.svg");
    } else {
        document.querySelector('html').setAttribute('data-theme', 'dim');
        localStorage.setItem('data-theme', 'dim');
        document.getElementById("theme").setAttribute('src', "/img/moon-stars-fill.svg");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem('data-theme')) {
        localStorage.setItem('data-theme', 'winter');
    }
    let theme = localStorage.getItem('data-theme');
    document.querySelector('html').setAttribute('data-theme', theme);
    if (theme == 'dim') {
        document.getElementById("theme").setAttribute('src', "/img/moon-stars-fill.svg");
    } else {
        document.getElementById("theme").setAttribute('src', "/img/brightness-high.svg");
    }

});