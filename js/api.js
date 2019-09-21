var url = "https://readerapi.codepolitan.com/";

function status(response) {
    if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
    }else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error: ", error);
}

function getArticles() {
    if ("caches" in window) {
        caches.match(url + "articles").then(function(response){
            if (response) {
                response.json().then(function(data){
                    var articlesHTML = "";
                    data.result.forEach(function(art){
                        articlesHTML += `
                        <div class="card">
                            <a href="./art.html?id=${art.id}">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${art.thumbnail}" />
                                </div>  
                            </a>
                            <div class="card-content">
                                <span class="card-title truncate">${art.title}</span>
                                <p>${art.description}</p>
                            </div>
                        </div>
                        `;
                    });
                    document.getElementById("articles").innerHTML = articlesHTML;
                });
            }
        });
    }

    fetch(url + "articles")
    .then(status)
    .then(json)
    .then(function(data){
        var articlesHTML = "";
        data.result.forEach(function(art){
            articlesHTML +=`
            <div class="col s12 m4">
                <div class="card">
                    <a href="./article.html?id=${art.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${art.thumbnail}" />
                        </div>
                    </a>
                    <div class="card-content ">
                        <span class="card-title truncate">${art.title}</span>
                        <p>${art.description}</p>
                    </div>
                </div>
            </div>
            `;
        });
        document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

// untuk halaman detail article
function getArticleById() {
    var urlParams = new URLSearchParams(window.location.search);
    alert(urlParams);
    var idParam = urlParams.get("id");

    if("caches" in window) {
        caches.match(url + "article/" + idParam).then(function(response){
            if (response) {
                response.json().then(function(data){
                    var articleHTML = `
                        <div class="card">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${data.result.cover}" />
                            </div>
                            <div class="card-content">
                                <span class="card-title">${data.result.post_title}</span>
                                ${snarkdown(data.result.post_content)}
                            </div>
                        </div>
                    `;
                    document.getElementById("body-content").innerHTML = articleHTML;
                    resolve(data);
                });
            }
        });
    }

    fetch(url + "article/" + idParam) .then(status)
    .then(json)
    .then(function(data){
        console.log(data);
        var articleHTML = `
        <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
            </div>
            <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
            </div>
      </div>
        `;
    document.getElementById("body-content").innerHTML = articleHTML;
    });
}