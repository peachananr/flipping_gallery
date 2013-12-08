/* ===========================================================
 * jquery-flipping_gallery.js v1.1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create a simple but beautiful
 * 3D flipping gallery with on JS call
 *
 * https://github.com/peachananr/flipping_gallery
 *
 * ========================================================== */

!function($){
  
  var defaults = {
    direction: "forward",
    flipDirection: "bottom",
    selector: "> a",
    spacing: 10,
    showMaximum: 15,
    enableScroll: true,
    autoplay: false
	};
	
	
  
  $.fn.flipping_gallery = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        total = el.find(settings.selector).length,
        space = 0,
        scale = 0.5 / total, 
        opacity = 1 / total,
        lastAnimation = 0,
        quietPeriod = 500;  
      
    if (total > settings.showMaximum) opacity = 1 / settings.showMaximum
    el.addClass("fg-body")
    
    
    $.fn.realignCards = function() {
      var el = $(this);
      $.each(el.find(settings.selector), function(i) {
        if (i == 0) {
          $(this).addClass("active " + settings.flipDirection)
          el.find(".fg-caption").remove()
          if($(this).data("caption")) {
            el.append("<div class='fg-caption' style='opacity: 0;'>" + $(this).attr("data-caption") + "</div>")
            el.find(".fg-caption").css({
              "opacity": "1"
            });
          }
        }
        
        
        space = space + settings.spacing
        new_scale = 1 - (scale * i)
        new_opacity = 1 - (opacity * i)
        if (i >= settings.showMaximum) {
          $(this).css("opacity", 0)
        } else {
           $(this).css("opacity", 1)
        }
        $(this).addClass("animate fg-card").css({
          "z-index": 5 - i,
          "margin-top": "-" + space + "px",
          "-webkit-transform": "scale(" + new_scale + ")",
          "-moz-transform": "scale(" + new_scale + ")",
          "-o-transform": "scale(" + new_scale + ")",
          "transform": "scale(" + new_scale + ")",
          "opacity": new_opacity
        });
        $(this).click(function() {
          return false;
        });
      });
      el.find("> .fg-card.active").click(function() {
        if (settings.direction == "forward") {
          el.flipForward();
        } else {
          el.flipBackward();
        }
        
        return false;
      })
    }
    
    function init_scroll(event, delta) {
        deltaOfInterest = delta;
        var timeNow = new Date().getTime();
        // Cancel scroll if currently animating or within quiet period
        if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          el.flipForward()
        } else {
          el.flipBackward()
        }
        lastAnimation = timeNow;
    }
    
    $.fn.flipForward = function() {
      if (!el.hasClass("animating")) {
        el.addClass("animating")
        el.find(".fg-caption").remove();
        var card = el.find("> .fg-card").first();
        card.addClass("fg-flipping").css("opacity", "0");
        card.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
          var save_card = card.removeClass("animate active fg-flipping [class^='fg-count-'] " + settings.flipDirection).clone();
          card.remove();
          el.append(save_card.hide());
          
          el.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            space = 0;
            el.realignCards()
          });
          
          el.find("> .fg-card").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(e) {
            el.find("> .fg-card").fadeIn()
            el.removeClass("animating")
          });
        });
      }
    }
    
    $.fn.flipBackward = function() {
      if (!el.hasClass("animating")) {
        el.addClass("animating")
        var prev_card = el.find("> .fg-card").last();
        var new_prev_card = prev_card.clone()
        prev_card.remove()
        el.find(".active").removeClass("active "  + settings.flipDirection)
        el.prepend(new_prev_card.attr("style", "").css({
          "opacity": "0",
          "z-index": "99"
        }).hide().addClass("active fg-flipping "  + settings.flipDirection))
        el.find("> .fg-card.active").addClass("animate").show().removeClass("fg-flipping").css("opacity", "1")
        space = 0;
        el.realignCards();
        el.find("> .fg-card").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(e) {
        
          el.removeClass("animating")
        });
      }
    }
    
    el.realignCards();
    
    if (settings.enableScroll == true) {
      $(el).bind('mousewheel DOMMouseScroll', function(event) {
        event.preventDefault();
        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        init_scroll(event, delta);
      });
    }
    
    if(settings.autoplay != 0 && settings.autoplay != false) {
      setInterval(function() {
        
        if($(el.selector + ":hover").length < 1) el.flipForward()
      }, settings.autoplay);
    }
    
  }
}(window.jQuery);

