(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    $('a[href="#repos"]').on('click', function() {
        getRepoList()
        .done(function(data) {
            console.log(data);
        })
        .fail( ns.error );
    });

    function getRepoList() {
        return $.ajax({
            url: 'https:api.github.com/user/repos',
            get: 'get',
            headers: {
                'Authorization': 'token ' + ns.token
            },
            dataType: 'json'
        });

    }

})(window.tracker);
