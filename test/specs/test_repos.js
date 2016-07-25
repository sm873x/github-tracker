(function() {
    
    'use strict';

    var assert = window.chai.assert;

    var fixtures = $('.fixtures').html();

    suite('get all repos', function() {
        setup(function() {
            $.mockjax({
                url: 'https://api.github.com/user/repos',
                method: 'get',
                responseText: [ {name: 'repo1'}, {name: 'repo2'} ]
            });
        });

        teardown(function() {
            $.mockjax.clear();
        });

        test('ensure getRepoList function exists', function() {
            assert.ok( window.tracker.getRepoList, 'getRepoList exists');
            assert.strictEqual(typeof(window.tracker.getRepoList), 'function', 'getRepoList is a function');
        });

        test('getRepoList makes ajax call', function(done) {
            var returnVal = window.tracker.getRepoList('321');

            assert.strictEqual(typeof(returnVal), 'object');
            assert.isFunction(returnVal.done);
            assert.isFunction(returnVal.fail);

            returnVal
                .done(function() {
                    var mockedCalls = $.mockjax.mockedAjaxCalls();
                    assert.strictEqual(mockedCalls.length, 1);
                    assert.strictEqual(mockedCalls[0].url, 'https://api.github.com/user/repos');
                })
                .fail(function() {
                    assert.fail('should not fail github API repo call');
                })
                .always(function() {
                    done();
                });
        });
    });

    suite('display repos in table', function() {
        setup(function() {
            $('.fixtures').html(fixtures);
        });

        test('ensure display repos function exists', function() {
            assert.ok( window.tracker.dispRepoList, 'dispRepoList exists');
            assert.strictEqual(typeof(window.tracker.dispRepoList), 'function', 'dispRepoList is a function');
        });

        test('displays repo object data within table rows', function() {
            var repo = {name: 'example', stargazers_count: 2, open_issues_count: 0};
            window.tracker.dispRepoList(repo);
            assert.strictEqual(repo.name, 'example', 'data values work');
        });
    });

})();
