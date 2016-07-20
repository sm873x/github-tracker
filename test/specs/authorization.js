(function() {
    'use strict';

    var assert = chai.assert;

    suite('get user information with token', function() {

        setup(function() {

            $.mockjax({
                url: 'https://api.github.com/user',
                method: 'get',
                responseText: {name: 'Stella Ma', login: 'sm873x'}
            });

        });

        teardown(function() {
            $.mockjax.clear();
        });

        test('ensure function exists', function() {
            assert.ok( window.tracker.authorize, 'authorize exists' );
            assert.strictEqual( typeof(window.tracker.authorize), 'function', 'authorize is a function');
        });

        test('no token results in fail', function(done) {
            var promise = window.tracker.authorize();

            assert.strictEqual( typeof(promise), 'object', 'value returned as object' );
            assert.strictEqual( typeof(promise.fail), 'function', 'value is a promise' );

            promise.done(function() {
                assert.fail('authorize should not succeed w/o token' );
            })
            .fail(function(data) {
                assert.strictEqual( data.message, 'no token given' );
            })
            .always(function() {
                done();
            });
        });

        test('authorize makes ajax call', function(done) {
            var returnVal = window.tracker.authorize('123');

            assert.strictEqual(typeof(returnVal), 'object');
            assert.strictEqual(typeof(returnVal.done), 'function');
            assert.strictEqual(typeof(returnVal.fail), 'function');

            returnVal
            .done(function(data) {
                var mockedCalls = $.mockjax.mockedAjaxCalls();
                assert.strictEqual(mockedCalls.length, 1);
                assert.strictEqual(mockedCalls[0].url, 'https://api.github.com/user');

                assert.isObject(data, 'user data is an object');
            })
            .fail(function() {
                assert.fail('should not fail github API call');
            })
            .always(function() {
                done();
            });
        });

    });



})();
