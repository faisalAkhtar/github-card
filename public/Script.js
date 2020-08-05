window.onload = function() {
    document.querySelector("form").onsubmit = function(e) {
        e.preventDefault();
        sendQuery(this.username.value)
    };

    sendQuery("faisalakhtar")
}

function sendQuery(user) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/users/" + user);
    xhr.onprogress = function(event) {
        document.getElementById("bio").innerHTML = "Loading..."
    };
    xhr.onload = function() {
        document.querySelector(".card").classList.remove("empty")
        makeCard(JSON.parse(this.responseText))
    };
    xhr.onerror = function() {
        resetForm()
        document.querySelector(".card").classList.add("empty")
        alert(this.responseText)
    };
    xhr.send();
}

function makeCard(obj) {
    if(obj.login==undefined || obj.type!="User") {
        resetForm()
        document.querySelector(".card").classList.add("empty")
        return
    }

    document.querySelector(".copyLink").style.display = "unset"
    document.querySelector(".openInNewWindow").style.display = "unset"
    document.getElementById("avatar").src = "https://avatars.githubusercontent.com/" + obj.login
    document.getElementById("id").innerHTML = obj.id
    document.getElementById("name").innerHTML = obj.name
    document.getElementById("bio").innerHTML = obj.bio
    document.getElementById("login").innerHTML = obj.login
    document.getElementById("login").parentElement.href = "https://github.com/" + obj.login
    if(obj.twitter_username==null) {
        document.getElementById("twitter_username").parentElement.classList.add("hide")
    } else {
        document.getElementById("twitter_username").parentElement.classList.remove("hide")
        document.getElementById("twitter_username").innerHTML = obj.twitter_username
        document.getElementById("twitter_username").parentElement.href = "https://twitter.com/" + obj.twitter_username
    }
    if(obj.blog==null || obj.blog=="") {
        document.getElementById("blog").parentElement.classList.add("hide")
    } else {
        document.getElementById("blog").parentElement.classList.remove("hide")
        document.getElementById("blog").innerHTML = obj.blog
        document.getElementById("blog").parentElement.href = obj.blog
    }
    if(obj.location==null) {
        document.getElementById("location").parentElement.classList.add("hide")
    } else {
        document.getElementById("location").parentElement.classList.remove("hide")
        document.getElementById("location").innerHTML = obj.location
    }
    document.getElementById("public_repos").innerHTML = obj.public_repos
    document.getElementById("followers").innerHTML = obj.followers
}

function resetForm() {
    document.querySelector(".copyLink").style.display = "none"
    document.querySelector(".openInNewWindow").style.display = "none"
    document.getElementById("avatar").src = ""
    document.getElementById("id").innerHTML = "&nbsp;"
    document.getElementById("name").innerHTML = "&nbsp;"
    document.getElementById("bio").innerHTML = "&nbsp;"
    document.getElementById("login").innerHTML = "&nbsp;"
    document.getElementById("login").parentElement.href = ""
    document.getElementById("twitter_username").parentElement.classList.remove("hide")
    document.getElementById("twitter_username").innerHTML = "&nbsp;"
    document.getElementById("twitter_username").parentElement.href = ""
    document.getElementById("blog").parentElement.classList.remove("hide")
    document.getElementById("blog").innerHTML = "&nbsp;"
    document.getElementById("blog").parentElement.href = ""
    document.getElementById("location").parentElement.classList.remove("hide")
    document.getElementById("location").innerHTML = "&nbsp;"
    document.getElementById("public_repos").innerHTML = "&nbsp;"
    document.getElementById("followers").innerHTML = "&nbsp;"
}

document.querySelector('.openInNewWindow').onclick = (e)=>{
    let username = document.getElementById('login').innerHTML
    if(username!='&nbsp;') {
        window.open(location.href + "api?username=" + username)
    }
}

document.querySelector('.copyLink').onclick = (e)=>{
    let username = document.getElementById('login').innerHTML,
        link = location.href + "api?username=" + username
        temp = document.createElement("input")
    temp.value = link
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    setTimeout( () => { alert("Link copied\n"+link) }, 200);
}
