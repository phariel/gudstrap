$(function () {

  module('toggle btn group')

    test('should provide no conflict', function () {
      var button = $.fn.toggleBtnGroup.noConflict()
      ok(!$.fn.toggleBtnGroup, 'button was set back to undefined (org value)')
      $.fn.toggleBtnGroup = button
    })

    test('should be defined on jquery object', function () {
      ok($(document.body).toggleBtnGroup, 'button method is defined')
    })

    test('should return element', function () {
      ok($(document.body).toggleBtnGroup()[0] == document.body, 'document.body returned')
    })

    test('should toggle active when buttons are clicked', function () {
      var toggleBtnGroup = $('<div class="toggle-btn-group toggle-btn-group-text"><a href="#" class="btn btn-default">Left</a><a href="#" class="btn btn-default active">Middle</a><a href="#" class="btn btn-default">Right</a></div>').appendTo('#qunit-fixture')
      var inactiveBtn = toggleBtnGroup.find(':not(.active):first')
      ok(!inactiveBtn.hasClass('active'), 'btn does not have active class')
      inactiveBtn.click()
      ok(inactiveBtn.hasClass('active'), 'btn has class active')
    })

    test('should toggle active when btn children are clicked', function () {
      var toggleBtnGroup = $('<div class="toggle-btn-group toggle-btn-group-text"><a href="#" class="btn btn-default">Left</a><a href="#" class="btn btn-default active">Middle</a><a href="#" class="btn btn-default">Right</a></div>').appendTo('#qunit-fixture')
      toggleBtnGroup.children().each(function () {
        $(this).append('<i>inner</i>')
      })
      var inactiveBtn = toggleBtnGroup.find(':not(.active):first')
      ok(!inactiveBtn.hasClass('active'), 'btn does not have active class')
      inactiveBtn.find('i').click()
      ok(inactiveBtn.hasClass('active'), 'btn has class active')
    })

})
