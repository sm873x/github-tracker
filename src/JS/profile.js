(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.profile = {};
    ns.profile.load = function initProfile() {
        console.log('hash', window.location.hash);
        ns.dispNav();
        ns.dispProfile(ns.userData);
    };

    ns.dispProfile = function dispProfile(data) {
        $('.avatar')
            .attr('src', data.avatar_url);
        $('.userPage')
            .text(ns.username)
            .attr('href', data.html_url);
        $('.name')
            .text('Name: ' + data.name);
        $('.repos')
            .text('Repos: ' + data.public_repos);
        $('.followers')
            .text('Followers: ' + data.followers + ' (following ' + data.following + ')');
        $('.acct-created')
            .text('Account created: ' + ns.date(data.created_at) );
    };

})(window.tracker);
