(function ($) {
  var halo = {
      initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');
            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this),
                        auto_playvideo = self.data('auto-video');

                    if (self.find('.item-video').length) {
                      var tag = document.createElement('script');
                      tag.src = "https://www.youtube.com/iframe_api";
                      var firstScriptTag = document.getElementsByTagName('script')[0];
                      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }

                    if(auto_playvideo) {
                        // POST commands to YouTube or Vimeo API
                        function postMessageToPlayer(player, command) {
                            if (player == null || command == null) return;
                            console.log(player.contentWindow);
                            player.contentWindow.postMessage(JSON.stringify(command), "*");
                        }

                        // When the slide is changing
                        function playPauseVideo(slick, control) {
                            var currentSlide, player, video;

                            currentSlide = slick.find('.slick-current .item ');
                            if($(window).width() > 551) {
                              player = currentSlide.find("iframe.slide-pc").get(0);
                            } else {
                              player = currentSlide.find("iframe.slide-mobile").get(0);
                            }

                            if (currentSlide.hasClass('slide-youtube')) {
                              if($(window).width() > 551) {
                                var id = currentSlide.find('iframe.slide-pc').attr('id');
                                var video_id = currentSlide.find('iframe.slide-pc').data('video-id');
                              } else {
                                var id = currentSlide.find('iframe.slide-mobile').attr('id');
                                var video_id = currentSlide.find('iframe.slide-mobile').data('video-id');
                              }
  
                               if (control === "play"){
                                    postMessageToPlayer(player, {
                                     "event": "command",
                                     "func": "playVideo"
                                   });
                                  self.slick('slickPause');
                                   $(player).on('ended', function() {
                                     postMessageToPlayer(player, {
                                       "event": "command",
                                       "func": "playVideo"
                                     });
                                     self.slick('slickPlay');
                                     self.slick('next');
                                   });
                                }
                               else {
                                  postMessageToPlayer(player, {
                                     "event": "command",
                                     "func": "pauseVideo"
                                   });
                               }
                               
                               var player1;
                               function onPlayerReady(event) {
                                 event.target.playVideo();
                               }

                                // when video ends
                               function onPlayerStateChange(event) { 
                                 if(event.data === 0) {
                                    postMessageToPlayer(player, {
                                       "event": "command",
                                       "func": "playVideo"
                                    });            
                                   self.slick('slickPlay');
                                   self.slick('next');
                                 }
                               }
                               function onYouTubePlayerAPIReady() {
                                    player1 = new YT.Player(id, {
                                      videoId: video_id,
                                      events: {
                                        'onReady': onPlayerReady,
                                        'onStateChange': onPlayerStateChange
                                      }
                                    });
                               }
                               
                               onYouTubePlayerAPIReady();

                            } else if (currentSlide.hasClass('slide-video')) {
                               video = currentSlide.find("video").get(0);

                               if (video != null) {
                                 if (control === "play"){
                                   video.play();

                                   self.slick('slickPause');
                                   $(video).on('ended', function() {
                                     self.slick('slickPlay');
                                     self.slick('next');
                                   });

                                 } else {
                                   video.pause();
                                 }
                               }
                            };
                        };

                        self.on('init', function(slick) {
                            slick = $(slick.currentTarget);

                            setTimeout(function(){
                                playPauseVideo(slick,"play");
                            }, 1000);
                        });

                        self.on("beforeChange", function(event, slick) {
                            slick = $(slick.$slider);
                            playPauseVideo(slick,"pause");

                            self.on("mouseenter focus", function (event, slick) {
                                $('.home-slideshow .slideshow').addClass('over_hover');
                            });
                        });

                        self.on("afterChange", function(event, slick) {
                            $('.item.slick-slide:not(.slick-current) .fluid-width-video-wrapper .video').css('display', 'none');
                            $('.slick-current .fluid-width-video-wrapper .video').css('display', 'block');
                            slick = $(slick.$slider);
                            playPauseVideo(slick,"play");
                            // if( $("video").prop('muted') ) {
                            //     $("video").prop('muted', true);
                            // } else {
                            //     $("video").prop('muted', true);
                            // }
                        });
                    };

                    if (self.not('.slick-initialized')) {
                        if (self.data('dots') == 'none') {
                          var dots = false;
                        } else {
                          var dots = true;
                        }
                        if (self.data('dots') == 'number') {
                          var arrowsMobile = true;
                          var customPaging = (self, i) => {let index = i + 1;var count = self.slideCount;return '<a class="dot" aria-label="'+index+'/'+count+'">'+index+'/'+count+'</a>';}
                        } else {
                          var arrowsMobile = false;
                        }
                        self.slick({
                            dots: dots,
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplay-speed'),
                            arrows: self.data('arrows'),
                            nextArrow: window.arrows.icon_next,
                            prevArrow: window.arrows.icon_prev,
                            customPaging: customPaging,
                            rtl: window.rtl_slick,
                            speed: self.data('speed') || 500,
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                    arrows: arrowsMobile,
                                    customPaging: customPaging,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: arrowsMobile,
                                    customPaging: customPaging,
                                    dots: true
                                }
                            }
                            ]
                        });
                    };
                });
            };
        }
  }
  halo.initSlideshow();
  if ($('body').hasClass('cursor-fixed__show')){
    window.sharedFunctionsAnimation.onEnterButton();
    window.sharedFunctionsAnimation.onLeaveButton();
  }
})(jQuery);
