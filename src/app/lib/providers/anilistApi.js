/*
const AniListAPI = require('anilist-api-pt');
const anilist = new AniListAPI({
    client_id: 'animeapp-9poaj',
    client_secret: '1qygNFVVc3asI8qxjAgx'
});
let storedAnime = {};
let authorized = false;

function searchAnime(query, retry = 0) {
    return new Promise((resolve, reject) => {
        const ogQuery = query;
        function searchAnimeFun(query) {
            console.log('search', query);
            if (!authorized) {
                anilist.auth().then((res) => {
                    authorized = true;
                    searchAnimeFun(query);
                }).catch((err) => {
                    return reject(err);
                });
            } else {
                anilist.anime.searchAnime(query).then((res) => {
                    if ((!res[0]) && (retry < 2)) {
                        retry++;
                        searchAnimeFun(query.substr(0, query.lastIndexOf(' ')));
                    }
                    if (retry >= 2) {
                        return reject('Anime not found - ' + query);
                    }
                    if (res[0]) {
                        const anime = {
                            key:ogQuery,
                            title: res[res.length-1].title_romaji,
                            image: res[res.length-1].image_url_lge,
                            genres: res[res.length-1].genres.filter((a) => { return a != "" }),
                            video: res[res.length-1].youtube_id
                        }
                        storedAnime[ogQuery] = anime;
                        return resolve(anime);
                    }
                }).catch((err) => {
                    return reject(err);
                });
            }
        }
        if (storedAnime[ogQuery]) {
            console.log("fetch from storage");
            return resolve(Object.apply({}, storedAnime[ogQuery], { fromStorage: true }));
        }
        searchAnimeFun(ogQuery);
    });
}

module.exports = {
    searchAnime: searchAnime
};
*/