(function() {
    'use strict';

    var assert = window.chai.assert;

    var fixtures = $('.fixtures').html();

    suite('profile information list', function() {
        setup(function() {
            $('#fixtures').html(fixtures);
        });

        teardown(function() {
            console.log('after each test');
        });

        test('ensure display profile function exists', function() {
            assert.ok( window.tracker.dispProfile, 'dispProfile exists' );
            assert.strictEqual( typeof(window.tracker.dispProfile), 'function', 'dispProfile is a function');
        });

        test('displays profile data within list items', function() {
            var username = 'foo';
            var data = {name: 'testname', created_at: '2016-07-24T20:43:27'};
            window.tracker.dispProfile(username, data);
            assert.strictEqual(data.name, 'testname', 'data values work');
        });

    });


})();
