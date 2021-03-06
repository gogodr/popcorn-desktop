(function (App) {
    'use strict';

    var getDataFromProvider = function (torrentProvider, subtitle, metadata, self) {
        var deferred = Q.defer();

        var torrentsPromise = torrentProvider.fetch(self.filter);

        console.log('torrentsPromise', torrentsPromise);
        var idsPromise = torrentsPromise.then(_.bind(torrentProvider.extractIds, torrentProvider));
        var promises = [
            torrentsPromise,
            subtitle ? idsPromise.then(_.bind(subtitle.fetch, subtitle)) : true,
            metadata ? idsPromise.then(function (ids) {
                return Q.allSettled(_.map(ids, function (id) {
                    return metadata.movies.summary(id);
                }));
            }) : true
        ];

        console.log('pre all', promises);

        Q.all(promises)
            .spread(function (torrents, subtitles, metadatas) {

                console.log('post all', torrents, subtitles, metadatas);

                // If a new request was started...
                metadatas = _.map(metadatas, function (m) {
                    if (!m || !m.value || !m.value.ids) {
                        return {};
                    }

                    m = m.value;
                    m.id = m.ids.imdb;
                    return m;
                });

                _.each(torrents.results, function (movie) {
                    var id = movie[self.popid];
                    /* XXX(xaiki): check if we already have this
                     * torrent if we do merge our torrents with the
                     * ones we already have and update.
                     */
                    var model = self.get(id);
                    if (model) {
                        var ts = model.get('torrents');
                        _.extend(ts, movie.torrents);
                        model.set('torrents', ts);

                        return;
                    }
                    movie.provider = torrentProvider.name;

                    if (subtitles) {
                        movie.subtitle = subtitles[id];
                    }

                    if (metadatas) {
                        var info = _.findWhere(metadatas, {
                            id: id
                        });


                    }
                });

                return deferred.resolve(torrents);
            })
            .catch(function (err) {
                self.state = 'error';
                self.trigger('loaded', self, self.state);
                win.error('PopCollection.fetch() : torrentPromises mapping', err);
            });

        return deferred.promise;
    };

    var PopCollection = Backbone.Collection.extend({
        popid: 'imdb_id',
        initialize: function (models, options) {
            this.providers = this.getProviders();

            options = options || {};
            options.filter = options.filter || new App.Model.Filter();

            this.filter = _.defaults(_.clone(options.filter.attributes), {
                page: 0
            });
            this.hasMore = true;

            Backbone.Collection.prototype.initialize.apply(this, arguments);
        },

        fetch: function () {
            try {
                var self = this;

                if (this.state === 'loading' && !this.hasMore) {
                    return;
                }

                this.state = 'loading';
                self.trigger('loading', self);

                var subtitle; //TODO: var subtitle = App.Providers.get('ysubs');
                var metadata = this.providers.metadata;
                var torrents = this.providers.torrents;
                console.log("providers", this.providers);
                /* XXX(xaiki): provider hack
                 *
                 * we actually do this to 'save' the provider number,
                 * this is shit, as we can't dynamically switch
                 * providers, the 'right' way to do it is to have every
                 * provider declare a unique id, and then lookthem up in
                 * a hash.
                 */
                console.log('pre---', subtitle, metadata, torrents);

                var torrentPromises = _.map(torrents, function (torrentProvider) {
                    var providerName = torrentProvider.name.split('?')[0];
                    if (providerName == "AnimeApi") {

                    }
                    switch (providerName) {
                        case "AnimeApi":
                            return new Promise((resolve, reject) => {
                                App.Providers.HorribleSubsApi.getAnimeSeasonList().then(() => {
                                    resolve([{
                                        _id: "centaur-no-nayami",
                                        images: {
                                            banner: "http://horriblesubs.info/wp-content/uploads/2017/07/centaur.jpg",
                                            fanart: "http://horriblesubs.info/wp-content/uploads/2017/07/centaur.jpg",
                                            poster: "http://horriblesubs.info/wp-content/uploads/2017/07/centaur.jpg"
                                        },
                                        provider: "horriblesubsApi",
                                        slug: 'centaur-no-nayami',
                                        title: "Centaur no Nayami",
                                        genres: ["Slice of Life", "Comedy"],
                                        description: "Himeno is a sweet, shy little centaur girl. In her world, everyone seems to be a supernatural creature, and all her classmates have some kind of horns, wings, tails, halos, or other visible supernatural body part. Despite their supernatural elements, Himeno and her best friends, Nozomi and Kyouko, have a fun and mostly normal daily school life!",
                                        type: "show",
                                        year: "2017"
                                    }]);
                                });
                            }).then((torrents) => {
                                console.log("Trigger get anime");
                                self.add(torrents);
                                self.hasMore = false;
                                self.trigger('sync', self);
                            }).catch(function (err) {
                                console.error('provider error err', err);
                            });;
                        case "MovieApi":
                            return new Promise((resolve, reject) => {
                                console.log("FETCH PAGE", self.filter.page);
                                App.Providers.HorribleSubsApi.getFeed(self.filter.page).then((animes) => {
                                    resolve(animes.map(item => {
                                        let torrents = {};
                                        if (item['480p']) {
                                            torrents['480p'] = {
                                                peers: 0,
                                                seeds: 0,
                                                provider: "HorribleSubs",
                                                url: item['480p']
                                            };
                                        }
                                        if (item['720p']) {
                                            torrents['720p'] = {
                                                peers: 0,
                                                seeds: 0,
                                                provider: "HorribleSubs",
                                                url: item['720p']
                                            };
                                        }
                                        if (item['1080p']) {
                                            torrents['1080p'] = {
                                                peers: 0,
                                                seeds: 0,
                                                provider: "HorribleSubs",
                                                url: item['1080p']
                                            };
                                        }
                                        return {
                                            backdrop: item.image,
                                            cover: item.image,
                                            certification: 'R',
                                            images: {
                                                banner: item.image,
                                                fantart: item.image,
                                                poster: item.image
                                            },
                                            provider: 'horriblesubsApi',
                                            slug: `${item.title} ${item.episode}`.replace(' ', '-'),
                                            title: item.title ? item.title : item.key,
                                            genre: item.genres,
                                            description: item.description,
                                            type: 'movie',
                                            year: (new Date()).getFullYear(),
                                            episode: parseInt(item.episode),
                                            torrents: torrents
                                        }
                                    }));
                                });
                            }).then((torrents) => {
                                console.log("Trigger get anime");
                                self.add(torrents);
                                self.hasMore = true;
                                self.trigger('sync', self);
                            }).catch(function (err) {
                                console.error('provider error err', err);
                            });;
                    }

                    if (providerName != 'AnimeApi') {
                        return getDataFromProvider(torrentProvider, subtitle, metadata, self)
                            .then(function (torrents) {
                                console.log("gotten torrents", torrents.results)
                                self.add(torrents.results);
                                self.hasMore = true;
                                self.trigger('sync', self);
                            })
                            .catch(function (err) {
                                console.error('provider error err', err);
                            });
                    } else {
                    }
                });

                Q.all(torrentPromises).done(function (torrents) {
                    self.state = 'loaded';
                    self.trigger('loaded', self, self.state);
                });
            } catch (e) {
                console.error('cached error', e);
            }
        },

        fetchMore: function () {
            this.filter.page += 1;
            this.fetch();
        }
    });

    App.Model.Collection = PopCollection;
})(window.App);
