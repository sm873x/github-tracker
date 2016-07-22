(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});


    ns.getRepo = function getRepo(repoName) {
        $.ajax({
            url: 'https://api.github.com/repos/' + ns.username + '/' + repoName,
            get: 'get',
            headers: {
                'Authorization': 'token ' + ns.token
            },
            dataType: 'json'
        })
        .done( dispRepoDetail )
        .fail( ns.error );
    };

    function dispRepoDetail(data) {
        console.log(data);
    }

})(window.tracker);
