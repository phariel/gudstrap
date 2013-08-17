/* ========================================================================
 * Bootstrap-ef: stepper-ef.js v1.0
 * For numeric stepper of EF project only
 * ======================================================================== */

+ function($) {
  "use strict";

  // NUMERIC STEPPER CLASS DEFINITION
  // =========================

  var stepperMin = 0
  var stepperMax = 99999
  var stepperStep = 1

  var stepperClass = '.stepper'
  var stepperBtnUpClass = stepperClass + ' .btn-up'
  var stepperBtnDownClass = stepperClass + ' .btn-down'
  var stepperInputClass = '.form-control'
  var stepperInputDelegateClass = stepperClass + ' ' + stepperInputClass

  var dataStepper = 'stepper'
  var dataStepperMin = 'stepper-min'
  var dataStepperMax = 'stepper-max'
  var dataStepperStep = 'stepper-step'
  var dataLastVal = 'stepper-lastval'

  var stepperClick = 'click.bs.stepper.data-api'
  var stepperKeydown = 'keydown.bs.stepper.data-api'
  var stepperFocus = 'focus.bs.stepper.data-api'
  var stepperBlur = 'blur.bs.stepper.data-api'

  var disableAttr = '.disabled, :disabled'

  var Stepper = function(element, option) {
    var $el = $(element)
    var $input = $el.find(stepperInputClass)

    if (!$input.data(dataStepperMin)) $input.data(dataStepperMin, stepperMin)
    if (!$input.data(dataStepperMax)) $input.data(dataStepperMax, stepperMax)
    if (!$input.data(dataStepperStep)) $input.data(dataStepperStep, stepperStep)

    if (typeof(option) == 'object') {
      $.each(option, function(key, value) {
        $input.data(key, value)
      })
    }

    setVal($input, $input.val())
  }

  Stepper.prototype.increase = function(step) {
    execStep($(this), 'increase', step)
  }

  Stepper.prototype.decrease = function(step) {
    execStep($(this), 'decrease', step)
  }

  var increaseEvent = function(e) {
    var $this = $(this).parents(stepperClass)
    var $input = $this.find(stepperInputClass)
    if ($input.is(disableAttr)) return
    $this.stepper('increase')
  }

  var decreaseEvent = function(e) {
    var $this = $(this).parents(stepperClass)
    var $input = $this.find(stepperInputClass)
    if ($input.is(disableAttr)) return
    $this.stepper('decrease')
  }

  var keydownEvent = function(e) {
    var keyCode = e.keyCode
    // Enter, delete, Left arrow and Right arrow keys allowed
    if (keyCode === 13) {
      $(this).trigger(stepperBlur)
    } else if (keyCode !== 8 && keyCode !== 37 && keyCode !== 39) {
      if (keyCode < 48 || keyCode > 57) return false
    }
  }

  var focusEvent = function(e) {
    var $this = $(this)
    $this.val('')
  }

  var blurEvent = function(e) {
    var $this = $(this)
    setVal($this, $this.val())
  }

  var execStep = function($this, action, step) {
    var $input = $this.find(stepperInputClass)
    var val = parseInt($input.val(), 10)

    step = parseInt(step, 10)

    if (!step) step = $input.data(dataStepperStep)

    switch (action) {
      case 'increase':
        val += step
        break
      case 'decrease':
        val -= step
        break
    }

    setVal($input, val)

  }

  var setVal = function($input, val) {
    var maxValue = $input.data(dataStepperMax)
    var minValue = $input.data(dataStepperMin)
    var lastVal = $input.data(dataLastVal)

    val = parseInt(val, 10)

    if (!val && val !== 0) {
      if (!lastVal) {
        lastVal = minValue
      }
      val = lastVal
    } else if (val < minValue) {
      val = minValue
    } else if (val > maxValue) {
      val = maxValue
    }

    $input.val(val)
    $input.data(dataLastVal, val)
  }

  // NUMERIC STEPPER PLUGIN DEFINITION
  // ==========================

  var old = $.fn.stepper

  $.fn.stepper = function(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data(dataStepper)
      if (!data) $this.data(dataStepper, (data = new Stepper(this, option)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.stepper.Constructor = Stepper

  // NUMERIC STEPPER NO CONFLICT
  // ====================

  $.fn.stepper.noConflict = function() {
    $.fn.stepper = old
    return this
  }

  // APPLY TO NUMERIC STEPPER ELEMENTS
  // ===================================

  $(document)
    .on(stepperClick, stepperBtnUpClass, increaseEvent)
    .on(stepperClick, stepperBtnDownClass, decreaseEvent)
    .on(stepperKeydown, stepperInputDelegateClass, keydownEvent)
    .on(stepperBlur, stepperInputDelegateClass, blurEvent)
    .on(stepperFocus, stepperInputDelegateClass, focusEvent)

  $(window).on('load', function() {
    $(stepperClass).stepper()
  })

}(window.jQuery);