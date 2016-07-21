(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});


    $('a[href="#repos"]').on('click', function() {

        getRepoList()
            .done(function(data) {
                ns.repoDataArr = data;
                console.log(ns.repoDataArr);

                ns.repoDataArr.forEach( ns.dispRepoList );
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

    ns.dispRepoList = function dispRepoList(repo) {
        ns.repoName = repo.name;
        ns.repoURL = repo.url;
        //
        // getRepoStars(repo)
        //     .done(function dispStars(data) {
        //         console.log('star data', data);
        //     })
        //     .fail(ns.error);

        $('.repoTable')
            .append('<tr class=' + ns.repoName + '> \
                        <td>' + ns.repoName + '</td> \
                        <td>' + repo.stargazers_count + '</td> \
                        <td>' + repo.open_issues_count + '</td> \
                    </tr>');
    };
    //
    // function getRepoStars() {
    //     return $.ajax({
    //         url: ns.repoURL + '/starred/' + ns.username + ns.repoName,
    //         method: 'get',
    //         dataType: 'json'
    //     });
    // }

})(window.tracker);
