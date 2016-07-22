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
        .done( ns.dispRepoDetail )
        .fail( ns.error );
    };

    ns.dispRepoDetail = function dispRepoDetail(data) {
        console.log(data);

        $('.repo-name')
            .attr('href', data.html_url)
            .text(data.name);
        $('.repo-text').text(data.description);
        dispIssue(data);
    };

    function dispIssue(data) {
        if (data.has_issues !== true) {
            $('.issues-url')
                .replaceWith('<p>This repo does not contain issues</p>');
        }
        
        $('.issues-url').attr('href', (data.html_url + '/issues') );
        $('.open-issues').text(JSON.stringify(data.open_issues_count));
    }
})(window.tracker);
