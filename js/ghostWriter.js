(function($) {
  'use strict';

  $.fn.ghostWriter = function() {
    var elem = $(this);
    var phrases = elem.attr('data-phrases');
    var duration = elem.attr('data-duration');
    return new GhostWriter(elem, phrases, duration);
  };

  function GhostWriter(elem, phrases, duration) {
    this.elem = elem;
    this.phrases = JSON.parse(phrases) || [];
    this.duration = parseInt(duration, 10) || 2000;
    this.loopIndex = 0;
    this.text = '';
    this.isDeleting = false;
    this.fn = null;

    // Immediately start typing
    this.play();
  };

  GhostWriter.prototype.play = function () {
    this._clear();
    this._type();
  };

  GhostWriter.prototype.stop = function () {
    clearTimeout(this.fn);
  };

  GhostWriter.prototype._type = function() {
    var i = this.loopIndex % this.phrases.length;
    var current = this.phrases[i];
    var interval = 200 - Math.random() * 100;
    var self = this;

    if (this.isDeleting)
      this.text = current.slice(0, this.text.length - 1);
    else
      this.text = current.slice(0, this.text.length + 1);

    this.elem.html('<span>' + this.text + '</span>');

    if (this.isDeleting) interval /= 2;

    if (!this.isDeleting && this.text === current) {
      this.isDeleting = true;
      interval = this.duration;
    } else if (this.isDeleting && this.text === '') {
      this.isDeleting = false;
      this.loopIndex++;
      interval = 500;
    }


    this.fn = setTimeout(function() {
      self._type();
    }, interval);
  };

  GhostWriter.prototype._clear = function () {
    clearTimeout(this.fn)

    this.loopIndex = 0;
    this.text = '';
    this.isDeleting = false;
    this.fn = null;
  };
}(jQuery));
