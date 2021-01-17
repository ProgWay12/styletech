function chose_answer(item) {
    let info;
    if (item.id == 1 && document.getElementsByClassName("ask")[0].getAttribute('value') == "straight-dramatic") {
        info = JSON.stringify({
            answer: "straight"
        })
    } else if (item.id == 2 && document.getElementsByClassName("ask")[0].getAttribute('value') == "straight-dramatic") {
        info = JSON.stringify({
            answer: "dramatic"
        })
    } else if (item.id == 1 && document.getElementsByClassName("ask")[0].getAttribute('value') == "dramatic-straight") {
        info = JSON.stringify({
            answer: "dramatic"
        })
    } else if (item.id == 2 && document.getElementsByClassName("ask")[0].getAttribute('value') == "dramatic-straight") {
        info = JSON.stringify({
            answer: "straight"
        })
    } else if (item.id == 1 && document.getElementsByClassName("ask")[0].getAttribute('value') == "classic-romantic"){
        info = JSON.stringify({
            answer: "classic"
        })
    } else if (item.id == 2 && document.getElementsByClassName("ask")[0].getAttribute('value') == "classic-romantic") {
        info = JSON.stringify({
            answer: "romantic"
        })
    } else if (item.id == 1 && document.getElementsByClassName("ask")[0].getAttribute('value') == "romantic-classic"){
        info = JSON.stringify({
            answer: "romantic"
        })
    } else if (item.id == 2 && document.getElementsByClassName("ask")[0].getAttribute('value') == "romantic-classic") {
        info = JSON.stringify({
            answer: "classic"
        })
    }
    let req = new XMLHttpRequest();
    req.open("POST", "/count_of_points", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        let parseinfo = JSON.parse(req.response);
        if (parseinfo.reload) {
           location.reload()
        }
     });
    req.send(info);
}

function open_wats_app() {
    document.location.href = "https://wa.me/79880283715?text=Я%20заинтересован%20в%20покупке%20вашего%20авто"
}