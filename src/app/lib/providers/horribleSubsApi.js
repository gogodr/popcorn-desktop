(function (App) {
    'use strict';
    var http = require('http');
    var himalaya = require('himalaya');
    var cheerio = require('cheerio');

    var HorribleSubsApi = function () {
        this.seasonAnimeList = [];
        this.lastFetch = new Date();
        this.getAnimeSeasonList().then(() => {

        });
        this.getFeed().then((releases) => {
            console.log("Releases",releases)
        });
    };

    HorribleSubsApi.prototype.getFeed = function (p = 0) {
        return new Promise((resolve, reject) => {
            const request = http.get('http://horriblesubs.info/lib/latest.php?nextid=' + p,(res)=>{
                let body = "";                
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    var json = himalaya.parse(body);
                    let itemList = [];
                    itemList = json.map((item) => {
                        if (item.tagName == 'table') {
                            try {
                                return {
                                    anime: item.children[0].children[0].children[1].children[0].content.replace(' - ', ' ').replace('-', ' '),
                                    episode: parseInt(item.children[0].children[0].children[2].content.replace('-', '').trim())
                                };
                            } catch (e) {
                                return {
                                    anime: 'fail'
                                };
                            }
                        } else if (item.tagName == 'div') {
                            try {
                                return {
                                    resolution: item.children[0].children[0].children[0].children[0].children[0].content.match(regex)[1],
                                    link: item.children[0].children[0].children[1].children[0].children[0].attributes.href
                                };
                            } catch (e) {
                                return {};
                            }
                        }
                    });
                    let auxAnime;
                    let animeIndex = -1;
                    let animes = [];
                    itemList.forEach((item) => {
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
                    return resolve(animes);
                });
                res.on('error', (e) => {
                    return reject(e);
                });
            });
        });
    };

    HorribleSubsApi.prototype.getAnimeSeasonList = function () {
        return new Promise((resolve, reject) => {
            const request = http.get('http://horriblesubs.info/current-season/',(res)=>{
                let body = "";                
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    const $ = cheerio.load(body);
                    console.log("Season Animes", $('.shows-wrapper')[0].children.filter((item)=>{
                        return item.children?true:false;
                    }).map((item)=>{
                        return item.children[0].attribs;
                    }));
                    //var json = himalaya.parse(body);
                    let itemList = [];
                });
                res.on('error', (e) => {
                    return reject(e);
                });
            });
        });
    };
    App.Providers.HorribleSubsApi = new HorribleSubsApi();
})(window.App);
