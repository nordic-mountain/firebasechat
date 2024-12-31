
localStorage.clear();

let username_user;

let guilds = {
    orion:"space",
    test:""
}

function hasLetters(str) {
    return /[a-zA-Z]/.test(str);
}

function btnEnter() {

    const pfpImagesArray = ["images/pfp/logo1.png", "images/pfp/logo2.png", "images/pfp/logo3.png", "images/pfp/logo4.png", "images/pfp/logo5.png", "images/pfp/logo6.png"];

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    for (g in guilds) {
        if (password.value === guilds[g] && hasLetters(password.value) === true) { // where u left off
            let pfpImagePAth = pfpImagesArray[Math.floor(Math.random() * pfpImagesArray.length)];
            username_user = { name: username.value, pfp: pfpImagePAth};

            localStorage.setItem('userdata', JSON.stringify(username_user));
            location.replace("/chat-app.html")
        }
    }
}