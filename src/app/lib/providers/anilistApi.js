(function (App) {
    'use strict';
    const AniListAPI = require('anilist-api-pt');

    let storedAnime = {};
    let authorized = false;

    var AnilistApi = function () {

        this.anilist = new AniListAPI({
            client_id: 'animeapp-9poaj',
            client_secret: '1qygNFVVc3asI8qxjAgx'
        });
        this.storedAnime = {};
        this.authorized = false;

    };

    AnilistApi.prototype.searchAnime = function (query, retry = 0) {

        let self = this;
        return new Promise((resolve, reject) => {
            const ogQuery = query;
            const searchAnimeFun = (query) => {
                //HorribleSubs derp name
                if (query == 'PriPri Chii') {
                    query = 'PuriPuri Chii';
                }
                if (query == '100% Pascal sensei') {
                    query = 'pascal sensei';
                }
                console.log('search', query);
                if (!self.authorized) {
                    self.anilist.auth().then((res) => {
                        self.authorized = true;
                        searchAnimeFun(query);
                    }).catch((err) => {
                        return reject(err);
                    });
                } else {
                    self.anilist.anime.searchAnime(query).then((res) => {
                        if ((!res[0]) && (retry < 2)) {
                            retry++;
                            searchAnimeFun(query.substr(0, query.lastIndexOf(' ')));
                        }
                        if (retry >= 2) {
                            return resolve();
                        }
                        if (res[0]) {
                            const anime = {
                                key: ogQuery,
                                title: res[res.length - 1].title_romaji,
                                image: res[res.length - 1].image_url_lge,
                                genres: res[res.length - 1].genres.filter((a) => { return a != "" }),
                                video: res[res.length - 1].youtube_id,
                                description: res[res.length - 1].description
                            }
                            self.storedAnime[ogQuery] = anime;
                            console.log("FOUND", ogQuery);
                            return resolve(anime);
                        }
                    }).catch((err) => {
                        console.log("ERROR", ogQuery);
                        return resolve();
                    });
                }
            }
            if (self.storedAnime[ogQuery]) {
                return resolve(self.storedAnime[ogQuery]);
            } else {
                searchAnimeFun(ogQuery);
            }
        });
    };
    App.Providers.AnilistApi = new AnilistApi();
})(window.App);