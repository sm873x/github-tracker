(function() {
    'use strict';

    var assert = window.chai.assert;

    var fixtures = $('.fixtures').html();

    suite('get and display repos in table', function() {
        setup(function() {
            $('.fixtures').html(fixtures);
        });

        teardown(function() {
            console.log('after each test');
        });

        test('ensure getRepoList function exists', function() {
            assert.ok( window.tracker.getRepoList, 'getRepoList exists');
        });

        test('ensure display repos function exists', function() {
            assert.ok( window.tracker.dispRepoList, 'dispRepoList exists');
            assert.strictEqual(typeof(window.tracker.dispRepoList), 'function', 'dispRepoList is a function');
        });
    });
})();
