// Imports


// General
const translateDistroName = id => {
    switch (id) {
        case 'arch-linux':
            return 'Arch Linux';
        case 'debian':
            return 'Debian';
        case 'fedora':
            return 'Fedora';
        case 'gentoo':
            return 'Gentoo';
        case 'kali-linux':
            return 'Kali Linux';
        case 'manjaro':
            return 'Manjaro';
        case 'linux-mint':
            return 'Linux Mint';
        case 'opensuse':
            return 'OpenSUSE';
        case 'raspbian':
            return 'Raspbian';
        case 'ubuntu':
            return 'Ubuntu';
    }
}


// Show only requested content
const distroSections = document.getElementsByClassName('content-box');
const showAllCheck = document.getElementById('show-all-check');
Array.prototype.forEach.call(distroSections, el => el.style.display = "none");
var activeTextboxId = distroSections[0].id;
distroSections[0].style.display = "block";

window.addEventListener('hashchange', () => {
    if (!showAllCheck.checked) {
        var locationId = window.location.hash.substring(1);
        if (locationId === "") locationId = "linux";
        document.getElementById(activeTextboxId).style.display = "none";
        activeTextboxId = locationId;
        document.getElementById(locationId).style.display = "block";
    }
});


// Theme and display toggles
const showAllContainer = document.getElementById('switch-container');
const triggerShowAllChange = () => {
    if (showAllCheck.checked) {
        Array.prototype.forEach.call(distroSections, el => el.style.display = "block");
    } else {
        Array.prototype.forEach.call(distroSections, el => el.style.display = "none");
        var locationId = window.location.hash.substring(1);
        if (locationId === "") locationId = "linux";
        document.getElementById(locationId).style.display = "block";
    }
}

showAllContainer.onclick = () => {
    showAllCheck.checked = !showAllCheck.checked;
    triggerShowAllChange();
}

showAllCheck.onchange = () => {
    triggerShowAllChange();
}


const themeButton = document.getElementById('theme-button');
const aboutIcon = document.getElementById('about-icon');
const body = document.body;
var isDark = true;

themeButton.onclick = () => {
    isDark
        ? body.classList.replace('dark', 'light')
        : body.classList.replace('light', 'dark');

    themeButton.innerHTML = isDark
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moon-stars" width="32" height="32" 
            viewBox="0 0 24 24" stroke-width="1.5" stroke="#2e3440" fill="none" stroke-linecap="round" 
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
            <path d="M19 11h2m-1 -1v2" />
            </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sun" width="32" height="32"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="#eceff4" fill="none" stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="4" />
            <path
            d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
            </svg>`

    aboutIcon.src = isDark
        ? "icons/512_about_black.png"
        : "icons/512_about_white.png";

    isDark = !isDark;
    
    showHeaderOnScroll();
}


// Scroll effects
const header = document.getElementById('header');

var showHeaderOnScroll = () => {
    var y = window.scrollY;
    if (y >= 100) {
        isDark
            ? header.style.backgroundColor = "#4c566a"
            : header.style.backgroundColor = "#fff";
    } else {
        header.style.backgroundColor = "transparent";
    }
};

window.addEventListener("scroll", showHeaderOnScroll);


// Cookies
const setVoted = () => {
    const d = new Date();
    d.setTime(d.getTime() + 86400000);  // Set cookie timeout on one day (allow voting once per day)
    const expires = "expires=" + d.toUTCString();
    document.cookie = "voted=true;" + expires + ";path=/";
}

const hasVoted = () => {
    let hasVoted = getCookie("voted");
    return hasVoted != "";
}


// API requests
const getAllVotes = async () => {
    return await fetch(`${"http://127.0.0.1:3001"}/api/distros`);
}

const getVotes = async distro => {
    return await fetch(`${"http://127.0.0.1:3001"}/api/distros/${distro}`);
}

const addVote = async distro => {
    fetch(`${"http://127.0.0.1:3001"}/api/distros/${distro}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}


// Data visualization
const translateVotes = async () => {
    const data = getAllVotes()
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(data => {
            let dataArr = new Array(2);
            dataArr[0] = new Array(data.length);
            dataArr[1] = new Array(data.length);

            for (let i = 0; i < data.length; i++) {
                dataArr[0][i] = translateDistroName(data[i].name);
                dataArr[1][i] = data[i].votes;
            }

            return dataArr;
        }).catch(err => {
            console.warn('Something went wrong.', err);
        });

    return data;
}

var voteChart = null;
translateVotes().then(data => {
    var ctx = document.getElementById('vote-chart');
    voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data[0],
            datasets: [{
                label: 'Number of votes',
                data: data[1],
                backgroundColor: [
                    'rgba(191, 97, 106, 0.2)',
                    'rgba(129, 161, 193, 0.2)',
                    'rgba(235, 203, 139, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(180, 142, 173, 0.2)',
                    'rgba(163, 190, 140, 0.2)'
                ],
                borderColor: [
                    'rgba(191, 97, 106, 1)',
                    'rgba(129, 161, 193, 1)',
                    'rgba(235, 203, 139, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(180, 142, 173, 1)',
                    'rgba(163, 190, 140, 1)'
                ],
                hoverBackgroundColor: [
                    'rgba(191, 97, 106, 0.8)',
                    'rgba(129, 161, 193, 0.8)',
                    'rgba(235, 203, 139, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(180, 142, 173, 0.8)',
                    'rgba(163, 190, 140, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    onClick: (e) => e.stopPropagation()
                }
            }
        }
    });
});