(function() {
    'use strict';

    var assert = chai.assert;

    suite('get user information with token', function() {

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

    });



})();
