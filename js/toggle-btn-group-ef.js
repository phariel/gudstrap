/* ========================================================================
* Bootstrap-ef: sdtoggle.js v1.0
* For button group toggle of EF project only
* ======================================================================== */

+function($) { 'use strict';

  var ToggleBtnGroup = function(element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, ToggleBtnGroup.DEFAULTS, options)
  }

  ToggleBtnGroup.DEFAULTS = {
    //
  }

  ToggleBtnGroup.prototype.select = function($button) {
    if ($button.hasClass('active')) return

    this.$element.find('.active').removeClass('active')
    $button.addClass('active')
  }

  var old = $.fn.toggleBtnGroup

  $.fn.toggleBtnGroup = function (option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('bs.toggle-btn-group')
      var options = typeof option === 'object' && option

      if (!data) $this.data('bs.toggle-btn-group', (data = new ToggleBtnGroup(this, options)))

      if (typeof option === 'string') data[option]()
    })
  }

  $.fn.toggleBtnGroup.Constructor = ToggleBtnGroup

  $.fn.toggleBtnGroup.noConflict = function() {
    $.fn.toggleBtnGroup = old
    return this
  }

  $(document).on('click.bs.toggle-btn-group.data-api', '.toggle-btn-group > *, [data-toggle="toggle-btn-group"] > *', function (e) {
    e.preventDefault()
    var $button = $(this)
    $button.parent().toggleBtnGroup().data('bs.toggle-btn-group').select($button)
  })

}(jQuery);
