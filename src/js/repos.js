(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    // $('a[href="#repos"]').on('click', function() {
    ns.repos = {};
    ns.repos.load = function() {
        if (!ns.repoDataArr) {
            ns.getRepoList(ns.token)
                .done(function(data) {
                    ns.repoDataArr = data;
                    console.log(ns.repoDataArr);
                    ns.repoDataArr.forEach( ns.dispRepoList );
                })
                .fail( ns.error );
        }
    };
    // });

    /**
     * Make ajax call to get list of repos
     * @param  {String} token Personal authorized token
     * @return {Promise} jQuery XHR Object containing promise method
     */
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

    /**
     * Display repo list in html table
     * @param  {JQuery object} repo Repo object with specified properties and values within
     * @return {void}
     */
    ns.dispRepoList = function dispRepoList(repo) {

        $('.repoTable')
            .append('<tr> \
                        <td><a href="#repoDetail/' + repo.name + '">' + repo.name + '</a></td> \
                        <td>' + repo.stargazers_count + '</td> \
                        <td>' + repo.open_issues_count + '</td> \
                    </tr>');
    };

})(window.tracker);
