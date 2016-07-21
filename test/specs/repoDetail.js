(function() {
    'use strict';

    var assert = chai.assert;

    suite('repoDetails view', function() {

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
            var returnVal = window.tracker.getRepo('sm873x', 'octocats');
            assert.isObject(returnVal, 'getRepo returns object');
            assert.isFunction(returnVal.done);
            assert.isFunction(returnVal.fail);

            returnVal
                .done(function(data) {
                    assert.strictEqual($.mockjax.mockedAjaxCalls().length, 1)

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

        test('get repo data fails with no arguments');

        test('get repo data fails with no username');

        test('get repo data fails with no repo name');

        test('get repo data fails with nonexistent repo');

    });

})();
