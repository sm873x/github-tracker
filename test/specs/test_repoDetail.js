(function() {

    'use strict';

    var assert = window.chai.assert;
    var fixtures = $('.fixtures').html();

    suite('getRepo details view', function() {
        setup(function() {
            $.mockjax({
                url: 'https://api.github.com/repos/sm873x/octocats',
                method: 'get',
                responseText: {
                    name: 'octocats',
                    owner: { login: 'sm873x' }
                }
            });
        });

        teardown(function() {
            $.mockjax.clear();
        });

        test('get data from github for repo', function(done) {
            var returnVal = window.tracker.getRepo('sm873x', '123', 'octocats');
            assert.isObject(returnVal, 'getRepo returns object');
            assert.isFunction(returnVal.done);
            assert.isFunction(returnVal.fail);

            returnVal
                .done(function(data) {
                    assert.strictEqual($.mockjax.mockedAjaxCalls().length, 1);

                    assert.isObject(data, 'repo data returned is object');
                    assert.isObject(data.owner, 'repo data has owner object');
                    assert.strictEqual(data.owner.login, 'sm873x', 'data owner login has name');
                    assert.strictEqual(data.name, 'octocats', 'repo data has name');
                })
                .fail(function() {
                    assert.fail('ajax call to get repo data should not fail');
                })
                .always(function() {
                    done();
                });
        });

        test('get repo data fails with no arguments', function(done) {
            var promise = window.tracker.getRepo();

            assert.isObject(promise, 'value returned as object');
            assert.strictEqual(typeof(promise.fail), 'function', 'value is a promise');

            promise.done(function() {
                assert.fail('getRepo should not succeed without arguments');
            })
            .fail(function(xhr) {
                assert.strictEqual( xhr.status, 401, 'unauthorized');
            })
            .always(function() {
                done();
            });
        });

        test('getRepo fails with no username', function(done) {
            var promise = window.tracker.getRepo('', '123', 'octocats');

            assert.isObject(promise, 'value returned as object');
            assert.strictEqual(typeof(promise.fail), 'function', 'value is a promise');

            promise.done(function() {
                assert.fail('getRepo should not succeed without username');
            })
            .fail(function(xhr) {
                assert.strictEqual( xhr.status, 401, 'unauthorized');
            })
            .always(function() {
                done();
            });
        });

        test('getRepo fails with no repo name', function(done) {
            var promise = window.tracker.getRepo('sm873x', '123', '');

            assert.isObject(promise, 'value returned as object');
            assert.strictEqual(typeof(promise.fail), 'function', 'value is a promise');

            promise.done(function() {
                assert.fail('getRepo should not succeed without repo name');
            })
            .fail(function(xhr) {
                assert.strictEqual( xhr.status, 401, 'unauthorized');
            })
            .always(function() {
                done();
            });
        });

        test('getRepo fails with nonexistent repo', function(done) {
            var promise = window.tracker.getRepo('sm873x', '123', 'octo8cats');

            assert.isObject(promise, 'value returned as object');
            assert.strictEqual(typeof(promise.fail), 'function', 'value is a promise');

            promise.done(function() {
                assert.fail('getRepo should not succeed with nonexistent repo name');
            })
            .fail(function(xhr) {
                assert.strictEqual( xhr.status, 401, 'unauthorized');
            })
            .always(function() {
                done();
            });
        });
    });

    suite('display repo details', function() {
        setup(function() {
            $('.fixtures').html(fixtures);
        });

        test('ensure display repo detail function exists', function() {
            assert.ok( window.tracker.dispRepoDetail, 'dispRepoDetail exists');
            assert.strictEqual(typeof(window.tracker.dispRepoDetail), 'function', 'dispRepoDetail is a function');
        });

        test('displays getRepo data within elements', function() {
            var data = {name: 'example', stargazers_count: 2, created_at: '2016-07-25T03:14:28'};
            window.tracker.dispRepoDetail(data);
            assert.strictEqual(data.name, 'example', 'data values work');
        });
    });

})();
