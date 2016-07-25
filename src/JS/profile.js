(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.profile = {};
    ns.profile.load = function initProfile() {
        console.log('hash', window.location.hash);
        ns.dispNav();
        ns.dispProfile(ns.username, ns.userData);
    };

    /**
     * Displays profile information for authorized user
     * @param  {String} username Name of authorized user
     * @param  {JQuery Object} data Object with specified properties and values
     * @return {void}          
     */
    ns.dispProfile = function dispProfile(username, data) {
        $('.avatar')
            .attr('src', data.avatar_url);
        $('.userPage')
            .text(username)
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
