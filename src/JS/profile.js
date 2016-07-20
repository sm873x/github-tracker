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
        //
        // if (!data) {
        //     $('#profile')
        //         .append('<p class="no-data">Strange, no info in your GitHub account</p>');
        //         .find('ul')
        //             .hide();
        //     return;
        // }

        $('.userPage')
            .text(data.login)
            .attr('href', data.html_url);
        $('.name')
            .text('Name: ' + data.name);
        $('.repos')
            .text('Repos: ' + data.public_repos);
        $('.followers')
            .text('Followers: ' + data.followers);
        $('.acct-created')
            .text('Account created: ' + data.created_at);

    };

})(window.tracker);
