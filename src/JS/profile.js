(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.profile = {};
    ns.profile.load = function initProfile() {
        console.log('hash', window.location.hash);
        ns.dispNav();
        ns.dispProfile();
    };

    ns.dispProfile = function dispProfile() {

        $('.userPage')
            .text(ns.userData.login)
            .attr('href', ns.userData.html_url);
        $('.name')
            .text('Name: ' + ns.userData.name);
        $('.repos')
            .text('Repos: ' + ns.userData.public_repos);
        $('.followers')
            .text('Followers: ' + ns.userData.followers);
        $('.acct-created')
            .text('Account created: ' + ns.userData.created_at);

    };

})(window.tracker);
