// API
const getAllTips = async () => {
    return await fetch(`${"http://127.0.0.1:3001"}/api/tips`);
}

const addTip = async (author, content) => {
    return await fetch(`${"http://127.0.0.1:3001"}/api/tips`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author: author, content: content })
    });
}

// Tips container
const tipsContainer = document.getElementsByClassName('tips-grid')[0];
const form = document.getElementsByClassName('tips-form')[0];

const appendNewTip = (author, content) => {
    let newTip =
        `<div class="tip">
            <h3>By ${author}</h3>
            <p>
                ${content}
            </p>
        </div>`
    tipsContainer.insertAdjacentHTML('beforeend', newTip);
}

form.onsubmit = (e) => {
    e.preventDefault();
    const author = form.elements["author"].value;
    const content = form.elements["content"].value;
    if (author.length > 0 && content.length >= 10) {
        appendNewTip(author, content);
        addTip(author, content)
            .then(console.log);
        form.reset();
    } else {
        alert('Invalid data lenght');
    }
}

window.onload = () => {
    getAllTips()
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(data => {
            data.forEach(tip => appendNewTip(tip.author, tip.content));
        });
}

// Twitter switch
const switchContainer = document.getElementById('switch-container');
const switchCheck = document.getElementById('switch-check');

switchContainer.onclick = () => {
    switchCheck.checked = !switchCheck.checked;
}