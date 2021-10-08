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

const translateButtonId = id => {
    return id.substring(0, id.length - 7);
}


// Footer bottom margin on distros page
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const changeDistrosMargin = () => {
    if (window.innerWidth <= 1650) {
        main.style.marginLeft = "5rem";
    } else {
        main.style.marginLeft = "0";
    }

    if (window.innerWidth <= 600) {
        main.style.marginLeft = "0";
        footer.style.marginBottom = "5rem";
    } else {
        footer.style.marginBottom = "0";
    }
}

window.onresize = changeDistrosMargin;
changeDistrosMargin();


// Hover to top on distro change
const navbarLinks = document.getElementsByClassName('navbar-link');
Array.prototype.forEach.call(navbarLinks, link => {
    link.addEventListener('click', () => window.scrollTo(0, 0));
});


// Show only requested content
const distroSections = document.getElementsByClassName('content-box');
Array.prototype.forEach.call(distroSections, el => el.style.display = "none");
var activeTextboxId = distroSections[0].id;
distroSections[0].style.display = "block";

window.addEventListener('hashchange', () => {
    var locationId = window.location.hash.substring(1);
    if (locationId === "") locationId = "arch-linux";
    document.getElementById(activeTextboxId).style.display = "none";
    activeTextboxId = locationId;
    document.getElementById(locationId).style.display = "block";
});


// Cookies
const setVoted = () => {
    const d = new Date();
    d.setTime(d.getTime() + 86400000);  // Set cookie timeout on one day (allow voting once per day)
    const expires = "expires=" + d.toUTCString();
    document.cookie = "voted=true;" + expires + ";path=/";
}

const hasVoted = () => {
    let name = "voted";
    let cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return true;
        }
    }
    return false;
}


// API requests
const getAllVotes = async () => {
    return await fetch(`https://distrohub.herokuapp.com/api/distros`);
}

const getVotes = async distro => {
    return await fetch(`https://distrohub.herokuapp.com/api/distros/${distro}`);
}

const addVote = async distro => {
    return await fetch(`https://distrohub.herokuapp.com/api/distros/${distro}`, {
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

const loadChartData = () => {
    translateVotes()
        .then(data => {
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

            document.getElementsByClassName('loader')[0].style.display = "none";
        });
}

loadChartData();


// Voting system
const buttons = document.getElementsByClassName('vote-button');
Array.prototype.forEach.call(buttons, el => {
    if (hasVoted()) el.disabled = true;
    else {
        el.onclick = () => {
            if (confirm(`Do you want to vote for ${translateDistroName(translateButtonId(el.id))}? You can only vote once per day.`)) {
                addVote(translateButtonId(el.id))
                    .then(() => {
                        setVoted();
                        Array.prototype.forEach.call(buttons, el => el.disabled = true);
                        el.disabled = true;
                        voteChart.destroy();
                        setTimeout(() => {  // TODO: improve
                            loadChartData();
                        }, 50);
                    })
                    .catch(console.log);
            }
        }
    }
});

// TODO: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite