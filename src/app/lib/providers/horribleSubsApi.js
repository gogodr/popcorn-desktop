(function (App) {
    'use strict';
    var http = require('http');
    var cheerio = require('cheerio');

    var HorribleSubsApi = function () {
        this.seasonAnimeList = [];
        this.lastFetch = new Date();
        this.getAnimeSeasonList().then(() => {

        });
        this.getFeed().then((releases) => {
            console.log("Releases", releases)
        });
    };

    HorribleSubsApi.prototype.getFeed = function (p = 0) {
        return new Promise((resolve, reject) => {
            const request = http.get('http://horriblesubs.info/lib/latest.php?nextid=' + p, (res) => {
                let body = "";
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {

                    const $ = cheerio.load(body);
                    var aux = $('body').children().toArray().map((item) => {
                        switch (item.name) {
                            case "table":
                                const auxLink = $(item).find(".rls-label")[0].children;
                                if (auxLink.length > 1) {
                                    return {
                                        anime: auxLink[1].children[0].data.replace(' - ', ' ').replace('-', ' '),
                                        episode: auxLink[2].data.replace('-', '').trim()
                                    }
                                } else {
                                    const regex = /(\(.*\)(.*)(- [0-9][0-9]))/;
                                    const auxTitle = auxLink[0].data;
                                    console.log(auxTitle.match(regex));
                                    return {
                                        anime: auxTitle.match(regex)[2].trim().replace(' - ', ' ').replace('-', ' '),
                                        episode: auxTitle.match(regex)[3].replace('-', '').trim()
                                    }
                                }
                                break;
                            case "div":
                                const label = $(item).find('.dl-label i')[0].children[0].data;
                                const url = $(item).find('.hs-magnet-link span a')[0].attribs.href;
                                const regex = /\[(.*)\]/;
                                return {
                                    resolution: label.match(regex)[1],
                                    link: url
                                };
                                break;
                        }
                    });
                    let auxAnime;
                    let animeIndex = -1;
                    let animes = [];
                    aux.forEach((item) => {
                        if (!item)
                            return;
                        if (item.anime) {
                            auxAnime = item;
                            animeIndex++;
                        }
                        if (item.link) {
                            if (!animes[animeIndex]) {
                                animes[animeIndex] = {
                                    anime: auxAnime.anime,
                                    episode: auxAnime.episode
                                }
                            }
                            animes[animeIndex][item.resolution] = item.link;
                        }
                    });

                    let getAnimeTasks = [];
                    animes.forEach((item) => {
                        getAnimeTasks.push(App.Providers.AnilistApi.searchAnime(item.anime));
                    });
                    Q.all(getAnimeTasks).then((fullInfoAnimes) => {
                        console.log("fullInfoAnimes", fullInfoAnimes);
                        var animesFullInfo = [];
                        animes = animes.map((item, k) => {
                            return Object.assign({}, item, fullInfoAnimes[k]);
                        });
                        console.log("animes", animes);
                        return resolve(animes);
                    });
                });
                res.on('error', (e) => {
                    return reject(e);
                });
            });
        });
    };

    HorribleSubsApi.prototype.getAnimeSeasonList = function () {
        return new Promise((resolve, reject) => {
            const request = http.get('http://horriblesubs.info/current-season/', (res) => {
                let body = "";
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    const $ = cheerio.load(body);
                    const list = $('.shows-wrapper')[0].children.filter((item) => {
                        return item.children ? true : false;
                    }).map((item) => {
                        return item.children[0].attribs;
                    });
                    return resolve(list);
                });
                res.on('error', (e) => {
                    return reject(e);
                });
            });
        });
    };
    App.Providers.HorribleSubsApi = new HorribleSubsApi();
})(window.App);
