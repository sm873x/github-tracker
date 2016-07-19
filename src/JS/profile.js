(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.dispProfile = function displayProfile(data) {
        console.log(data);
        ns.$authArea.hide();

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
