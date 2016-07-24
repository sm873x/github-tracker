(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    $('a[href="#repos"]').on('click', function() {
        if (!ns.repoDataArr) {
            ns.getRepoList(ns.token)
                .done(function(data) {
                    ns.repoDataArr = data;
                    console.log(ns.repoDataArr);
                    ns.repoDataArr.forEach( ns.dispRepoList );
                })
                .fail( ns.error );
        }
    });

    ns.getRepoList = function getRepoList(token) {
        return $.ajax({
            url: 'https://api.github.com/user/repos',
            get: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    };

    ns.dispRepoList = function dispRepoList(repo) {
        ns.repoName = repo.name;

        $('.repoTable')
            .append('<tr class=' + ns.repoName + '> \
                        <td class="toRepoDetail">' + ns.repoName + '</td> \
                        <td>' + repo.stargazers_count + '</td> \
                        <td>' + repo.open_issues_count + '</td> \
                    </tr>');
    };

})(window.tracker);
