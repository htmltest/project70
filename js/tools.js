var stopUserVideo = false;
var stopScrollVideo = false;
var stopScrollGallery = false;

(function($) {

    $(document).ready(function() {

        $('.side-link').click(function(e) {
            $('body').toggleClass('hidden-menu');
            e.preventDefault();
        });

        $('body').on('click', '.order-link', function(e) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

        $.extend($.validator.messages, {
            required: 'Не заполнено поле',
            email: 'Введен некорректный e-mail'
        });

        $('body').on('click', '.message-error-back-link', function(e) {
            $(this).parents().filter('.message-error').remove();
            e.preventDefault();
        });

        $('.callback-link').click(function(e) {
            $('.callback').toggle();
            $('.callback').find('.loading, .message-error, .message-success').remove();
            $('.callback .form-input input').val('');
            e.preventDefault();
        });

        $('.callback-close').click(function(e) {
            $('.callback').hide();
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.callback').length == 0 && !$(e.target).hasClass('callback') && !$(e.target).hasClass('callback-link') && !$(e.target).hasClass('map-callback')) {
                $('.callback').hide();
            }
        });

        $('.map-callback').click(function(e) {
            $('.callback').show();
            $('.callback').find('.loading, .message-error, .message-success').remove();
            $('.callback .form-input input').val('');
            e.preventDefault();
        });

        $.validator.addMethod('maskPhone',
            function(value, element) {
                return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
            },
            'Не соответствует формату'
        );

        initForm();

        $('.plans-rooms a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.plans-rooms li.active').removeClass('active');
                curLi.addClass('active');

                var curIndex = $('.plans-rooms li').index(curLi);
                $('.plans-rooms-tab.active').removeClass('active');
                $('.plans-rooms-tab').eq(curIndex).addClass('active');

                var curLink = $('.plans-rooms-tab').eq(curIndex).find('.plans-types li.active a');
                $('.cocoen').replaceWith('<div class="cocoen"><img src="' + curLink.data('comparebefore') + '" alt="" /><img src="' + curLink.data('compareafter') + '" alt="" /></div>');
                $('.cocoen').cocoen();
            }
            e.preventDefault();
        });

        $('.plans-types a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curBlock = curLi.parents().filter('.plans-rooms-tab');

                curBlock.find('.plans-types li.active').removeClass('active');
                curLi.addClass('active');

                var curIndex = curBlock.find('.plans-types li').index(curLi);
                curBlock.find('.plans-types-tab.active').removeClass('active');
                curBlock.find('.plans-types-tab').eq(curIndex).addClass('active');

                $('.cocoen').replaceWith('<div class="cocoen"><img src="' + $(this).data('comparebefore') + '" alt="" /><img src="' + $(this).data('compareafter') + '" alt="" /></div>');
                $('.cocoen').cocoen();
            }
            e.preventDefault();
        });

        $('.cocoen').each(function() {
            $(this).cocoen();
        });

        $('.webcam-slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            var curHTML = '';
            var i = 1;
            curSlider.find('.webcam-slider-content li').each(function() {
                curHTML += '<a href="#">' + i + '</a>';
                i++;
            });
            $('.webcam-slider-ctrl-list').html(curHTML);
            $('.webcam-slider-ctrl-list a:first').addClass('active');
        });

        $('.webcam-slider').on('click', '.webcam-slider-ctrl-list a', function(e) {
            if (!$(this).hasClass('active')) {
                var curSlider = $('.webcam-slider');
                if (curSlider.data('disableAnimation')) {
                    var curIndex = curSlider.data('curIndex');
                    var newIndex = $('.webcam-slider-ctrl-list a').index($(this));

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.webcam-slider-content > ul > li').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.webcam-slider-content > ul > li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                    curSlider.find('.webcam-slider-ctrl-list a.active').removeClass('active');
                    curSlider.find('.webcam-slider-ctrl-list a').eq(newIndex).addClass('active');

                    curSlider.find('.webcam-slider-content > ul > li').eq(curIndex).fadeOut(function() {
                        curSlider.data('disableAnimation', true);
                    });
                }
            }

            e.preventDefault();
        });

        function resizeGallery() {
            var curBlock = $('.gallery');
            var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
            var curLeft = 0;
            var newIndex = -1;
            curBlock.find('.gallery-content li').each(function() {
                var curItem = $(this);
                curLeft -= curItem.width();
                if (curItem.attr('curid')) {
                    newIndex++;
                    if (curIndex == newIndex) {
                        return false;
                    }
                }
            });
            curLeft += curBlock.find('.gallery-content li').eq(newIndex).width() / 2;
            curLeft += curBlock.find('.gallery-content').width() / 2;
            curBlock.find('.gallery-content ul').css({'left': curLeft});
            var sideWidth = (curBlock.find('.gallery-content').width() - curBlock.find('.gallery-content li').eq(newIndex).width()) / 2;
            if (sideWidth < 0) {
                sideWidth = 0;
            }
            curBlock.find('.gallery-prev, .gallery-next').width(sideWidth);
        }

        $('.gallery-periods').each(function() {
            $('.gallery-periods-parents > ul > li.active > ul > li.active').each(function() {
                var curLi = $(this);
                if (curLi.find('ul').length > 0) {
                    $('.gallery-periods-third').html('<ul>' + curLi.find('ul').html() + '</ul>');
                    $('.gallery-periods-third-wrap').show();
                    resizePeriods();
                }
            });
        });

        $('.gallery-periods-parents > ul > li > a').click(function(e) {
            var curLi = $(this).parent();
            if (curLi.find('ul').length > 0) {
                if (curLi.hasClass('open')) {
                    curLi.removeClass('open');
                    $('.gallery-periods-third').html('');
                    $('.gallery-periods-third-wrap').hide();
                    $('.gallery-periods-parents > ul > li > ul > li.active').removeClass('active');
                } else {
                    $('.gallery-periods-parents > ul > li.open').removeClass('open');
                    curLi.addClass('open');
                    $('.gallery-periods-third').html('');
                    $('.gallery-periods-third-wrap').hide();
                    $('.gallery-periods-parents > ul > li > ul > li.active').removeClass('active');
                }
                resizePeriods();
                e.preventDefault();
            }
        });

        $('.gallery-periods-parents > ul > li > ul > li > a').click(function(e) {
            var curLi = $(this).parent();
            if (curLi.find('ul').length > 0) {
                $('.gallery-periods-parents > ul > li > ul > li.active').removeClass('active');
                curLi.addClass('active');
                $('.gallery-periods-third').html('<ul>' + curLi.find('ul').html() + '</ul>');
                $('.gallery-periods-third-wrap').show();
                resizePeriods();
                e.preventDefault();
            }
        });

        function resizePeriods() {
            if ($('.gallery-periods-parents > ul').width() > $('.gallery-periods-parents').width()) {
                var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
                if (curLeft < 0) {
                    $('.gallery-periods-parents-prev').css({'display': 'block'});
                } else {
                    $('.gallery-periods-parents-prev').css({'display': 'none'});
                }
                if ($('.gallery-periods-parents > ul').width() - curLeft > $('.gallery-periods-parents').width()) {
                    $('.gallery-periods-parents-next').css({'display': 'block'});
                } else {
                    $('.gallery-periods-parents-next').css({'display': 'none'});
                }
                var isFull = false;
                if ($('.gallery-periods-parents > ul > li.active').length > 0) {
                    while(!isFull && ($('.gallery-periods-parents > ul > li.active').offset().left + $('.gallery-periods-parents > ul > li.active').width() > $('.gallery-periods-parents').width() + $('.gallery-periods-parents').offset().left)) {
                        var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
                        curLeft -= $('.gallery-periods-parents').width() / 2;

                        $('.gallery-periods-parents-prev').css({'display': 'block'});
                        if ($('.gallery-periods-parents > ul').width() + curLeft <= $('.gallery-periods-parents').width()) {
                            curLeft = $('.gallery-periods-parents').width() - $('.gallery-periods-parents > ul').width();
                            $('.gallery-periods-parents-next').css({'display': 'none'});
                            isFull = true;
                        }

                        $('.gallery-periods-parents > ul').css({'left': curLeft});

                    }
                }
            } else {
                $('.gallery-periods-parents-prev').css({'display': 'none'});
                $('.gallery-periods-parents-next').css({'display': 'none'});
                $('.gallery-periods-parents > ul').css({'left': 0});
            }
            if ($('.gallery-periods-third > ul').width() > $('.gallery-periods-third').width()) {
                var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
                if (curLeft < 0) {
                    $('.gallery-periods-third-prev').css({'display': 'block'});
                } else {
                    $('.gallery-periods-third-prev').css({'display': 'none'});
                }
                if ($('.gallery-periods-third > ul').width() - curLeft > $('.gallery-periods-third').width()) {
                    $('.gallery-periods-third-next').css({'display': 'block'});
                } else {
                    $('.gallery-periods-third-next').css({'display': 'none'});
                }
                if ($('.gallery-periods-third > ul > li.active').length > 0) {
                    var isFull = false;
                    while(!isFull && ($('.gallery-periods-third > ul > li.active').offset().left + $('.gallery-periods-third > ul > li.active').width() > $('.gallery-periods-third').width() + $('.gallery-periods-third').offset().left)) {
                        var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
                        curLeft -= $('.gallery-periods-third').width() / 2;

                        $('.gallery-periods-third-prev').css({'display': 'block'});
                        if ($('.gallery-periods-third > ul').width() + curLeft <= $('.gallery-periods-third').width()) {
                            curLeft = $('.gallery-periods-third').width() - $('.gallery-periods-third > ul').width();
                            $('.gallery-periods-third-next').css({'display': 'none'});
                            isFull = true;
                        }

                        $('.gallery-periods-third > ul').css({'left': curLeft});

                    }
                }
            } else {
                $('.gallery-periods-third-prev').css({'display': 'none'});
                $('.gallery-periods-third-next').css({'display': 'none'});
                $('.gallery-periods-third > ul').css({'left': 0});
            }
        }

        $('.gallery-periods-parents-next a').click(function(e) {
            $('.gallery-periods-parents > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
            curLeft -= $('.gallery-periods-parents').width() / 2;

            $('.gallery-periods-parents-prev').css({'display': 'block'});
            if ($('.gallery-periods-parents > ul').width() + curLeft <= $('.gallery-periods-parents').width()) {
                curLeft = $('.gallery-periods-parents').width() - $('.gallery-periods-parents > ul').width();
                $('.gallery-periods-parents-next').css({'display': 'none'});
            }

            $('.gallery-periods-parents > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery-periods-parents-prev a').click(function(e) {
            $('.gallery-periods-parents > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-parents > ul').css('left').replace(/px/, ''));
            curLeft += $('.gallery-periods-parents').width() / 2;

            $('.gallery-periods-parents-next').css({'display': 'block'});
            if (curLeft >= 0) {
                curLeft = 0;
                $('.gallery-periods-parents-prev').css({'display': 'none'});
            }

            $('.gallery-periods-parents > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery-periods-third-next a').click(function(e) {
            $('.gallery-periods-third > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
            curLeft -= $('.gallery-periods-third').width() / 2;

            $('.gallery-periods-third-prev').css({'display': 'block'});
            if ($('.gallery-periods-third > ul').width() + curLeft <= $('.gallery-periods-third').width()) {
                curLeft = $('.gallery-periods-third').width() - $('.gallery-periods-third > ul').width();
                $('.gallery-periods-third-next').css({'display': 'none'});
            }

            $('.gallery-periods-third > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery-periods-third-prev a').click(function(e) {
            $('.gallery-periods-third > ul').stop(true, true);

            var curLeft = Number($('.gallery-periods-third > ul').css('left').replace(/px/, ''));
            curLeft += $('.gallery-periods-third').width() / 2;

            $('.gallery-periods-third-next').css({'display': 'block'});
            if (curLeft >= 0) {
                curLeft = 0;
                $('.gallery-periods-third-prev').css({'display': 'none'});
            }

            $('.gallery-periods-third > ul').animate({'left': curLeft});

            e.preventDefault();
        });

        $('.gallery').each(function() {
            var curBlock = $(this);

            $(window).load(function() {
                $('.gallery-content ul').css({'visibility': 'visible'});

                resizePeriods();

                var startHTML = curBlock.find('.gallery-content ul').html();
                var i = 0;
                curBlock.find('.gallery-content li').each(function() {
                    $(this).attr('curid', i++);
                });
                curBlock.find('.gallery-content ul').prepend(startHTML);
                curBlock.find('.gallery-content ul').append(startHTML);
            });

            $(window).bind('load resize', resizeGallery);

            curBlock.find('.gallery-next').click(function(e) {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                curIndex++;
                if (curIndex >= curBlock.find('.gallery-preview li').length) {
                    curIndex = 0;
                }
                curBlock.find('.gallery-preview li').eq(curIndex).find('a').click();
                e.preventDefault();
            });

            curBlock.find('.gallery-prev').click(function(e) {
                var curIndex = curBlock.find('.gallery-preview li').index(curBlock.find('.gallery-preview li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.gallery-preview li').length - 1;
                }
                curBlock.find('.gallery-preview li').eq(curIndex).find('a').click();
                e.preventDefault();
            });

            curBlock.find('.gallery-preview a').click(function(e) {
                var curLi = $(this).parent();
                if (!curLi.hasClass('active')) {
                    var curIndex = curBlock.find('.gallery-preview li').index(curLi);

                    curBlock.find('.gallery-preview li.active').removeClass('active');
                    curLi.addClass('active');

                    curBlock.find('.gallery-content ul').stop(true, true);
                    curBlock.find('.gallery-prev, .gallery-next').stop(true, true);

                    var curLeft = 0;
                    var newIndex = -1;
                    curBlock.find('.gallery-content li').each(function() {
                        var curItem = $(this);
                        curLeft -= curItem.width();
                        if (curItem.attr('curid')) {
                            newIndex++;
                            if (curIndex == newIndex) {
                                return false;
                            }
                        }
                    });
                    curLeft += curBlock.find('.gallery-content li').eq(newIndex).width() / 2;
                    curLeft += curBlock.find('.gallery-content').width() / 2;
                    curBlock.find('.gallery-content ul').animate({'left': curLeft});
                    var sideWidth = (curBlock.find('.gallery-content').width() - curBlock.find('.gallery-content li').eq(newIndex).width()) / 2;
                    if (sideWidth < 0) {
                        sideWidth = 0;
                    }
                    curBlock.find('.gallery-prev, .gallery-next').animate({'width': sideWidth});
                }
                e.preventDefault();
            });

            curBlock.find('.gallery-periods-next a').click(function(e) {
                var curBlock = $(this).parents().filter('.gallery');

                curBlock.find('.gallery-periods ul').stop(true, true);

                var curLeft = Number(curBlock.find('.gallery-periods ul').css('left').replace(/px/, ''));
                curLeft -= curBlock.find('.gallery-periods-inner').width() / 2;

                curBlock.find('.gallery-periods-prev').css({'display': 'block'});
                if (curBlock.find('.gallery-periods-inner ul').width() + curLeft <= curBlock.find('.gallery-periods-inner').width()) {
                    curLeft = curBlock.find('.gallery-periods-inner').width() - curBlock.find('.gallery-periods-inner ul').width() - 20;
                    curBlock.find('.gallery-periods-next').css({'display': 'none'});
                }

                curBlock.find('.gallery-periods ul').animate({'left': curLeft});

                e.preventDefault();
            });

            curBlock.find('.gallery-periods-prev a').click(function(e) {
                var curBlock = $(this).parents().filter('.gallery');

                curBlock.find('.gallery-periods ul').stop(true, true);

                var curLeft = Number(curBlock.find('.gallery-periods ul').css('left').replace(/px/, ''));
                curLeft += curBlock.find('.gallery-periods-inner').width() / 2;

                curBlock.find('.gallery-periods-next').css({'display': 'block'});
                if (curLeft >= 0) {
                    curLeft = 0;
                    curBlock.find('.gallery-periods-prev').css({'display': 'none'});
                }

                curBlock.find('.gallery-periods ul').animate({'left': curLeft});

                e.preventDefault();
            });

        });

        $('.webcam-play').click(function(e) {
            var curLink = $(this);
            var curItem = curLink.parent();
            curItem.addClass('play');
            e.preventDefault();
        });

        resizeVideo();

        $(window).load(function() {
            $('.slider-preview ul li:first a').click();
        });

        if (Modernizr.video.h264) {
            $('.slider-content video').each(function() {
                var curVideo = $(this);
                curVideo[0].addEventListener('timeupdate', function() {
                    var progress = Math.floor(curVideo[0].currentTime) / Math.floor(curVideo[0].duration);
                    var curIndex = $('.slider-content video').index(curVideo);
                    var curProgress = $('.slider-preview ul li').eq(curIndex).find('span');
                    curProgress.css({'width': Math.floor(progress * curProgress.parent().width())});
                }, false);

                curVideo[0].addEventListener('ended', function() {
                    var curIndex = $('.slider-preview ul li').index($('.slider-preview ul li.active'));
                    curIndex++;
                    if (curIndex > $('.slider-preview ul li').length - 1) {
                        curIndex = 0;
                    }
                    $('.slider-preview ul li').eq(curIndex).find('a').click();
                });

                curVideo[0].addEventListener('canplay', function() {
                    curVideo.show();
                });
            });
        }

        $('.slider-preview ul li a').click(function(e) {
            var curLink = $(this);
            var curLi = curLink.parent();

            var curIndex = $('.slider-preview ul li').index(curLi);
            var curVideo = $('.slider-content li').eq(curIndex).find('video');

            if (curLi.hasClass('active')) {
                if (curLi.hasClass('play')) {
                    if (!stopScrollVideo) {
                        stopUserVideo = true;
                    }
                    curLi.removeClass('play');
                    if (Modernizr.video.h264) {
                        curVideo[0].pause();
                    }
                } else {
                    stopUserVideo = false;
                    curLi.addClass('play');
                    if (Modernizr.video.h264) {
                        curVideo[0].muted = true;
                        curVideo[0].play();
                    }
                }
            } else {
                stopUserVideo = false;
                $('.slider-preview ul li.active').removeClass('active play');
                curLi.addClass('active play');

                if (Modernizr.video.h264) {
                    $('.slider-content li.active video')[0].pause();
                    $('.slider-content li.active video')[0].currentTime = 0;
                }
                $('.slider-content li.active').removeClass('active');
                $('.slider-content li').eq(curIndex).addClass('active');
                if (Modernizr.video.h264) {
                    curVideo[0].muted = true;
                    curVideo[0].currentTime = 0;
                    curVideo[0].play();
                }
            }

            e.preventDefault();
        });

        var sliderPeriod    = 5000;
        var sliderTimer     = null;

        $('.slider-inner').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
        });

        function sliderNext() {
            var curSlider = $('.slider-inner');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex + 1;
                if (newIndex >= curSlider.find('li').length) {
                    newIndex = 0;
                }

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('li').eq(curIndex).animate({'top': 50, 'opacity': 0}, function() {
                    curSlider.find('li').eq(newIndex).css({'top': -50, 'opacity': 0, 'display': 'block'}).animate({'top': 0, 'opacity': 1}, function() {
                        curSlider.data('disableAnimation', true);
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    });
                });
            }
        }

        $('body').on('mouseover', '.choose-map-rooms-item-1', function() {
            $('.choose-map-section-number-flats-1').show();
        });

        $('body').on('mouseout', '.choose-map-rooms-item-1', function() {
            $('.choose-map-section-number-flats-1').hide();
        });

        $('body').on('mouseover', '.choose-map-rooms-item-2', function() {
            $('.choose-map-section-number-flats-2').show();
        });

        $('body').on('mouseout', '.choose-map-rooms-item-2', function() {
            $('.choose-map-section-number-flats-2').hide();
        });

        $('body').on('mouseover', '.choose-map-rooms-item-3', function() {
            $('.choose-map-section-number-flats-3').show();
        });

        $('body').on('mouseout', '.choose-map-rooms-item-3', function() {
            $('.choose-map-section-number-flats-3').hide();
        });

        $('body').on('click', '.choose-form-reset input', function() {
            window.setTimeout(function() {
                $('.form-select select').trigger('chosen:updated');
            }, 100);
        });

        $('body').on('click', '.choose-form', function() {
            $('body').removeClass('hidden-menu');
        });

        initChoose();

        $('body').on('click', '.choose-content area', function(e) {
            var curArea = $(this);
            $('.choose-content area').data('maphilight', {"stroke":2, "strokeColor":"f53d20", "fillColor":"f53d20", "fillOpacity":0.25});
            curArea.data('maphilight', {"stroke":2, "strokeColor":"f53d20", "fillColor":"f53d20", "fillOpacity":0.25, "alwaysOn":true});
            $('.choose-map').maphilight();

            $('.choose-window').addClass('open');

            var curIndex = $('.choose-content area').index(curArea);
            $('.choose-map-section-number strong').removeClass('active');
            $('.choose-map-section-number strong').eq(curIndex).addClass('active');

            $('.choose-window-container').append('<div class="loading"><div class="loading-text">Загрузка данных</div></div>');
            $.ajax({
                type: 'POST',
                url: curArea.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.choose-window-container').find('.loading').remove();
                $('.choose-window-container').html(html);
                $('.choose-window-map').maphilight();
            });

            e.preventDefault();
        });

        $('body').on('click', '.choose-window-floors a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curIndex = $('.choose-window-floors li').index(curLi);
                $('.choose-window-floors li.active').removeClass('active');
                curLi.addClass('active');
                $('.choose-window-tab.active').removeClass('active');
                $('.choose-window-tab').eq(curIndex).addClass('active');
            }
            e.preventDefault();
        });

        $('body').on('click', '.choose-window-map-scheme+map area', function(e) {
            if ($(this).hasClass('disabled')) {
                e.preventDefault();
            }
        });

        $('body').on('mouseover', '.choose-window-map-scheme+map area', function(e) {
            var curBlock = $(this).parents().filter('.choose-window-flat-scheme');
            var curIndex = curBlock.find('.choose-window-map-scheme+map area').index($(this));
            var curArea = curBlock.find('.choose-window-map+map area').eq(curIndex);
            if (curArea.data('maphilighthover')) {
                var curStyle = curArea.data('maphilight');
                curArea.data('maphilight', curArea.data('maphilighthover'));
                curArea.data('maphilighthover', curStyle);
                curBlock.find('.choose-window-map').maphilight();
            }
            curBlock.find('.flat-floor-scheme-hint-item').eq(curIndex).show().css({'left': e.pageX - $(window).scrollLeft(), 'top': e.pageY - $(window).scrollTop()});
        });

        $('body').on('mouseout', '.choose-window-map-scheme+map area', function(e) {
            var curBlock = $(this).parents().filter('.choose-window-flat-scheme');
            var curIndex = curBlock.find('.choose-window-map-scheme+map area').index($(this));
            var curArea = curBlock.find('.choose-window-map+map area').eq(curIndex);
            if (curArea.data('maphilighthover')) {
                var curStyle = curArea.data('maphilight');
                curArea.data('maphilight', curArea.data('maphilighthover'));
                curArea.data('maphilighthover', curStyle);
                curBlock.find('.choose-window-map').maphilight();
            }
            $('.flat-floor-scheme-hint-item').hide();
        });

        $('body').on('mousemove', '.choose-window-map-scheme+map area', function(e) {
            var curBlock = $(this).parents().filter('.choose-window-flat-scheme');
            var curIndex = curBlock.find('.choose-window-map-scheme+map area').index($(this));
            curBlock.find('.flat-floor-scheme-hint-item').eq(curIndex).show().css({'left': e.pageX - $(window).scrollLeft(), 'top': e.pageY - $(window).scrollTop()});
        });

        $('body').on('click', '.choose-map-section-number strong', function(e) {
            var curLi = $(this);
            var curIndex = $('.choose-map-section-number strong').index(curLi);
            $('.choose-content area').eq(curIndex).click();
            e.preventDefault();
        });

        $('body').on('mouseover', '.choose-map-section-number strong', function(e) {
            var curLi = $(this);
            var curIndex = $('.choose-map-section-number strong').index(curLi);
            if (!curLi.hasClass('active')) {
                $('.choose-content area').eq(curIndex).data('maphilight', {"stroke":2, "strokeColor":"f53d20", "fillColor":"f53d20", "fillOpacity":0.25, "alwaysOn":true});
                $('.choose-map').maphilight();
            }
            var curLeft = e.pageX - $(window).scrollLeft();
            var curTop = e.pageY - $(window).scrollTop();
            $('.infrastructure-map-section-list').eq(curIndex).removeClass('infrastructure-map-section-list-right').show().css({'left': curLeft, 'top': curTop});
            if ($('.infrastructure-map-section-list-wrap').eq(curIndex).offset().left + $('.infrastructure-map-section-list-wrap').eq(curIndex).outerWidth() > $(window).width()) {
                $('.infrastructure-map-section-list').eq(curIndex).addClass('infrastructure-map-section-list-right');
            }
        });

        $('body').on('mousemove', '.choose-map-section-number strong', function(e) {
            var curLi = $(this);
            var curIndex = $('.choose-map-section-number strong').index(curLi);
            var curLeft = e.pageX - $(window).scrollLeft();
            var curTop = e.pageY - $(window).scrollTop();
            $('.infrastructure-map-section-list').eq(curIndex).removeClass('infrastructure-map-section-list-right').show().css({'left': curLeft, 'top': curTop});
            if ($('.infrastructure-map-section-list-wrap').eq(curIndex).offset().left + $('.infrastructure-map-section-list-wrap').eq(curIndex).outerWidth() > $(window).width()) {
                $('.infrastructure-map-section-list').eq(curIndex).addClass('infrastructure-map-section-list-right');
            }
        });

        $('body').on('mouseout', '.choose-map-section-number strong', function(e) {
            var curLi = $(this);
            if (!curLi.hasClass('active')) {
                var curIndex = $('.choose-map-section-number strong').index(curLi);
                $('.choose-content area').eq(curIndex).data('maphilight', {"stroke":2, "strokeColor":"f53d20", "fillColor":"f53d20", "fillOpacity":0.25});
                $('.choose-map').maphilight();
            }
            $('.infrastructure-map-section-list').hide();
        });

        $('.flat-map').maphilight();

        $('.flat-builds-content area').click(function(e) {
            e.preventDefault();
        });

        $('.flat-floor-container .choose-window-map').maphilight();

        $('.photo-gallery-item').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);

            var pageSize = 5;
            var curPages = Math.ceil(curSlider.find('li').length / pageSize);
            if (curPages > 1) {
                var curHTML = '';
                for (var i = 0; i < curPages; i++) {
                    curHTML += '<a href="#"></a>';
                }
                curSlider.find('.photo-gallery-ctrl').html(curHTML);
                curSlider.find('.photo-gallery-ctrl a:first-child').addClass('active');
            }
        });

        $('.photo-gallery-item').on('click', '.photo-gallery-ctrl a', function(e) {
            var pageSize = 5;
            var curList = $(this).parents().filter('.photo-gallery-item');
            var curIndex = curList.find('.photo-gallery-ctrl a').index($(this));
            curList.find('li:first').stop(true, true);
            curList.find('.photo-gallery-ctrl a.active').removeClass('active');
            $(this).addClass('active');
            curList.find('li:first').animate({'margin-left': -curIndex * pageSize * curList.find('li:first').outerWidth()});
            e.preventDefault();
        });

        $('.photo-gallery-item li a').click(function(e) {
            var curGalleryItem = $(this).parents().filter('.photo-gallery-item');
            $('.photo-gallery-item').removeClass('active');
            curGalleryItem.addClass('active');

            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').css({'margin-top': -curScrollTop});
            $('body').data('scrollTop', curScrollTop);
            $('body').css({'margin-left': -curScrollLeft});
            $('body').data('scrollLeft', curScrollLeft);

            $('.item-gallery-loading').show();
            var curLink = $(this);
            var curIndex = curGalleryItem.find('.photo-gallery-content li a').index(curLink);
            $('.item-gallery').data('curIndex', curIndex);

            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });

            $('.item-gallery').addClass('item-gallery-open');
            stopScrollGallery = true;

            e.preventDefault();
        });

        $('.item-gallery-close').click(function(e) {
            itemGalleryClose();
            e.preventDefault();
        });

        $('body').keyup(function(e) {
            if (e.keyCode == 27) {
                itemGalleryClose();
            }
        });

        $(document).click(function(e) {
            if ($(e.target).hasClass('item-gallery')) {
                itemGalleryClose();
            }
        });

        function itemGalleryClose() {
            if ($('.item-gallery-open').length > 0) {
                $('.item-gallery').removeClass('item-gallery-open');
                $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
                $(window).scrollTop($('body').data('scrollTop'));
                $(window).scrollLeft($('body').data('scrollLeft'));
                stopScrollGallery = false;
            }
        }

        function galleryPosition() {
            var curWidth = $('.item-gallery-big').width();
            var windowHeight = $(window).height();
            var curHeight = windowHeight - 40;

            var imgWidth = $('.item-gallery-big img').width();
            var imgHeight = $('.item-gallery-big img').height();

            var newWidth = curWidth;
            var newHeight = imgHeight * newWidth / imgWidth;

            if (newHeight > curHeight) {
                newHeight = curHeight;
                newWidth = imgWidth * newHeight / imgHeight;
            }

            $('.item-gallery-big img').width(newWidth);
            $('.item-gallery-big img').height(newHeight);

            if ($('.item-gallery-container').outerHeight() > windowHeight - 40) {
                $('.item-gallery-container').css({'top': 20, 'margin-top': 0});
            } else {
                $('.item-gallery-container').css({'top': '50%', 'margin-top': -$('.item-gallery-container').outerHeight() / 2});
            }
        }

        $('.item-gallery-next').click(function(e) {
            var curIndex = $('.item-gallery').data('curIndex');
            curIndex++;
            if (curIndex >= $('.photo-gallery-item.active .photo-gallery-content ul li').length) {
                curIndex = 0;
            }

            $('.item-gallery-loading').show();

            var curLink = $('.photo-gallery-item.active .photo-gallery-content ul li').eq(curIndex).find('a');
            $('.item-gallery').data('curIndex', curIndex);

            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });

            e.preventDefault();
        });

        $('.item-gallery-prev').click(function(e) {
            var curIndex = $('.item-gallery').data('curIndex');
            curIndex--;
            if (curIndex < 0) {
                curIndex = $('.photo-gallery-item.active .photo-gallery-content ul li').length - 1;
            }

            $('.item-gallery-loading').show();

            var curLink = $('.photo-gallery-item.active .photo-gallery-content ul li').eq(curIndex).find('a');
            $('.item-gallery').data('curIndex', curIndex);

            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });

            e.preventDefault();
        });

        $('.photo-gallery').each(function() {
            var curGallery = $(this);
            curGallery.data('curIndex', 0);
            curGallery.find('.photo-gallery-prev').html(curGallery.find('.photo-gallery-item:last').find('.photo-gallery-item-title span').html());
            curGallery.find('.photo-gallery-next').html(curGallery.find('.photo-gallery-item').eq(1).find('.photo-gallery-item-title span').html());
        });

        $('.photo-gallery-next').click(function(e) {
            var curGallery = $('.photo-gallery');
            var curIndex = curGallery.data('curIndex');
            curIndex++;
            if (curIndex > curGallery.find('.photo-gallery-item').length - 1) {
                curIndex = 0;
            }
            curGallery.data('curIndex', curIndex);
            curGallery.find('.photo-gallery-item.active').removeClass('active');
            curGallery.find('.photo-gallery-item').eq(curIndex).addClass('active');

            var nextIndex = curIndex + 1;
            if (nextIndex > curGallery.find('.photo-gallery-item').length - 1) {
                nextIndex = 0;
            }

            var prevIndex = curIndex - 1;
            if (prevIndex < 0) {
                prevIndex = curGallery.find('.photo-gallery-item').length - 1;
            }

            curGallery.find('.photo-gallery-prev').html(curGallery.find('.photo-gallery-item').eq(prevIndex).find('.photo-gallery-item-title span').html());
            curGallery.find('.photo-gallery-next').html(curGallery.find('.photo-gallery-item').eq(nextIndex).find('.photo-gallery-item-title span').html());

            e.preventDefault();
        });

        $('.photo-gallery-prev').click(function(e) {
            var curGallery = $('.photo-gallery');
            var curIndex = curGallery.data('curIndex');
            curIndex--;
            if (curIndex < 0) {
                curIndex = curGallery.find('.photo-gallery-item').length - 1;
            }
            curGallery.data('curIndex', curIndex);
            curGallery.find('.photo-gallery-item.active').removeClass('active');
            curGallery.find('.photo-gallery-item').eq(curIndex).addClass('active');

            var nextIndex = curIndex + 1;
            if (nextIndex > curGallery.find('.photo-gallery-item').length - 1) {
                nextIndex = 0;
            }

            var prevIndex = curIndex - 1;
            if (prevIndex < 0) {
                prevIndex = curGallery.find('.photo-gallery-item').length - 1;
            }

            curGallery.find('.photo-gallery-prev').html(curGallery.find('.photo-gallery-item').eq(prevIndex).find('.photo-gallery-item-title span').html());
            curGallery.find('.photo-gallery-next').html(curGallery.find('.photo-gallery-item').eq(nextIndex).find('.photo-gallery-item-title span').html());

            e.preventDefault();
        });

        $('.mortgage-menu-list-inner').slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: false,
            dots: true
        });

        $('body').on('click', '.mortgage-menu-item a', function(e) {
            var curLink = $(this);
            var curItem = curLink.parent().parent();
            if (!curItem.hasClass('active')) {
                $('.mortgage-menu-item.active').removeClass('active');
                curItem.addClass('active');

                $('.mortgage-content').html('<div class="loading"><div class="loading-text">Загрузка данных</div></div>').show();
                $.ajax({
                    type: 'POST',
                    url:  curLink.attr('href'),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $('.mortgage-content').html(html);

                    $('.mortgage-results-form input.maskPhone').mask('+7 (999) 999-99-99');

                    $('.mortgage-results-form form').each(function() {
                        $(this).validate({
                            ignore: '',
                            submitHandler: function(form) {
                                $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                                $.ajax({
                                    type: 'POST',
                                    url: $(form).attr('action'),
                                    data: $(form).serialize() + '&' + $('.mortgage-params form').serialize(),
                                    dataType: 'html',
                                    cache: false
                                }).done(function(html) {
                                    $(form).find('.loading').remove();
                                    $(form).append(html);
                                });
                            }
                        });
                    });
                });
            } else {
                curItem.removeClass('active');

                $('.mortgage-content').html('').hide();
            }
            e.preventDefault();
        });

        $('body').on('click', '.mortgage-results-form .detail-link', function(e) {
            var curBlock = $(this).parent();
            if (curBlock.hasClass('open')) {
                curBlock.removeClass('open');
            } else {
                $('.mortgage-results-form.open').removeClass('open');
                curBlock.addClass('open');
                curBlock.find('.message-success').remove();
            }
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.mortgage-results-form').length == 0) {
                $('.mortgage-results-form.open').removeClass('open');
            }
        });

        $('body').on('click', '.mortgage-results-form-close, .mortgage-results-form-close-link', function(e) {
            $('.mortgage-results-form.open').removeClass('open');
            e.preventDefault();
        });

        $('.infrastructure-map').maphilight();

        $('body').on('mouseover', '.infrastructure-container area', function(e) {
            var curIndex = $('.infrastructure-container area').index($(this));
            var curLeft = e.pageX - $('.infrastructure-container').offset().left;
            var curTop = e.pageY - $('.infrastructure-container').offset().top;
            $('.infrastructure-map-section-list').eq(curIndex).show().css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mousemove', '.infrastructure-container area', function(e) {
            var curIndex = $('.infrastructure-container area').index($(this));
            var curLeft = e.pageX - $('.infrastructure-container').offset().left;
            var curTop = e.pageY - $('.infrastructure-container').offset().top;
            $('.infrastructure-map-section-list').eq(curIndex).css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mouseout', '.infrastructure-container area', function(e) {
            $('.infrastructure-map-section-list').hide();
        });

        $('.infrastructure-map-section-list-progress').each(function() {
            var curBlock = $(this);
            var curMax = Number(curBlock.find('.infrastructure-map-section-list-progress-max').html());
            var curCurrent = Number(curBlock.find('.infrastructure-map-section-list-progress-current').html());
            var curLimit = Number(curBlock.find('.infrastructure-map-section-list-progress-limit').html());
            var curProcent = curCurrent / curMax * 100;
            curBlock.find('.infrastructure-map-section-list-progress-text span').html(curCurrent);
            curBlock.find('.infrastructure-map-section-list-progress-bar-status').width(curProcent + '%');

            if (curProcent < curLimit) {
                curBlock.find('.infrastructure-map-section-list-progress-bar').addClass('red');
            }
        });

        $('body').on('mouseover', '.infrastructure-queue-item span', function() {
            var builds = $(this).data('builds').split(',');
            for (var i = 0; i < builds.length; i++) {
                var curIndex = -1;
                $('.infrastructure-map-section-number').each(function() {
                    if ($(this).html() == builds[i]) {
                        curIndex = $('.infrastructure-map-section-number').index($(this));
                    }
                });
                if (curIndex > -1) {
                    $('.infrastructure-map-section-number').eq(curIndex).addClass('hover');
                    $('.infrastructure-container area').each(function() {
                        var curArea = $(this);
                        if (curArea.data('build') == builds[i]) {
                            curArea.data('maphilight', {"stroke":false, "fillColor":"fff000", "fillOpacity":0.6, "alwaysOn":true});
                        }
                    });
                }
            }
            $('.infrastructure-map').maphilight();
        });

        $('body').on('mouseout', '.infrastructure-queue-item span', function() {
            $('.infrastructure-map-section-number').removeClass('hover');
            $('.infrastructure-container area').data('maphilight', {"stroke":false, "fillColor":"fff000", "fillOpacity":0.6});
            $('.infrastructure-map').maphilight();
        });

        $('body').on('mouseover', '.choose-wrap area', function(e) {
            var curIndex = $('.choose-wrap area').index($(this));
            var curLeft = e.pageX - $(window).scrollLeft();
            var curTop = e.pageY - $(window).scrollTop();
            $('.infrastructure-map-section-list').eq(curIndex).removeClass('infrastructure-map-section-list-right').show().css({'left': curLeft, 'top': curTop});
            if ($('.infrastructure-map-section-list-wrap').eq(curIndex).offset().left + $('.infrastructure-map-section-list-wrap').eq(curIndex).outerWidth() > $(window).width()) {
                $('.infrastructure-map-section-list').eq(curIndex).addClass('infrastructure-map-section-list-right');
            }
        });

        $('body').on('mousemove', '.choose-wrap area', function(e) {
            var curIndex = $('.choose-wrap area').index($(this));
            var curLeft = e.pageX - $(window).scrollLeft();
            var curTop = e.pageY - $(window).scrollTop();
            $('.infrastructure-map-section-list').eq(curIndex).removeClass('infrastructure-map-section-list-right').css({'left': curLeft, 'top': curTop});
            if ($('.infrastructure-map-section-list-wrap').eq(curIndex).offset().left + $('.infrastructure-map-section-list-wrap').eq(curIndex).outerWidth() > $(window).width()) {
                $('.infrastructure-map-section-list').eq(curIndex).addClass('infrastructure-map-section-list-right');
            }
        });

        $('body').on('mouseout', '.choose-wrap area', function(e) {
            $('.infrastructure-map-section-list').hide();
        });

        $('.rules-item a').click(function(e) {
            var curBlock = $($(this).attr('href'));
            if (curBlock.length > 0) {
                if (curBlock.hasClass('active')) {
                    curBlock.removeClass('active');
                    $('.rules-item a').removeClass('active');
                } else {
                    $('.rules-detail.active').removeClass('active');
                    curBlock.addClass('active');
                    $('.rules-item a.active').removeClass('active');
                    $(this).addClass('active');
                }
                e.preventDefault();
            }
        });

    });

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        $('body').css({'margin-top': -curScrollTop});
        $('body').data('scrollTop', curScrollTop);
        $('body').css({'margin-left': -curScrollLeft});
        $('body').data('scrollLeft', curScrollLeft);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').load(function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-loading').remove();
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-loading').remove();
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close, .window-close-bottom').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);

        $('.window input.maskPhone').mask('+7 (999) 999-99-99');

        $('.window form').validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();

                $('.form-checkbox').each(function() {
                    var curField = $(this);
                    if (curField.find('input.error').length > 0) {
                        curField.addClass('error');
                    } else {
                        curField.removeClass('error');
                    }
                });
            },
            submitHandler: function(form) {
                $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: $(form).serialize(),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $(form).find('.loading').remove();
                    $(form).append(html);
                });
            }
        });

    }

    function windowPosition() {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'left': 20, 'margin-left': 0});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
            $('.window-overlay').width('100%');
        }

        if ($('.window-container').height() > windowHeight - 40) {
            $('.window-overlay').height($('.window-container').height() + 40);
            $('.window-container').css({'top': 20, 'margin-top': 0});
        } else {
            $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2});
            $('.window-overlay').height('100%');
        }
    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
        $(window).scrollTop($('body').data('scrollTop'));
        $(window).scrollLeft($('body').data('scrollLeft'));
    }

    $(window).resize(function() {
        if ($('.window').length > 0) {
            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').data('scrollTop', 0);
            $('body').data('scrollLeft', 0);

            windowPosition();
        }
    });

    $(window).bind('load resize', function() {
        resizeVideo();

        $('.infrastructure-detail').each(function() {
            $(this).css({'height': $(window).height()});
            if ($('#map').length > 0) {
                if (myMap) {
                    myMap.container.fitToViewport();
                }
            }
        });

        $('.photo-gallery-item').each(function() {
            var curSlider = $(this);
            curSlider.find('.photo-gallery-content li:first').css({'margin-left': 0});
            curSlider.find('.photo-gallery-ctrl a').removeClass('active');
            curSlider.find('.photo-gallery-ctrl a:first').addClass('active');
        });

    });

    function resizeVideo() {
        $('.slider').each(function() {
            var maxHeight = $(window).height() * .75;
            if (maxHeight < 680) {
                maxHeight = 680;
            }
            $('.slider').css({'padding-top': maxHeight + 'px'});

            var curWidth = $('.slider').width() + 20;
            var curHeight = curWidth * .5625;
            if (curHeight < maxHeight) {
                curHeight = maxHeight;
                curWidth = curHeight / .5625;
            }
            $('.slider video').css({'width': curWidth, 'height': curHeight, 'left': '50%', 'top': '50%', 'margin-left': -curWidth / 2, 'margin-top': -curHeight / 2});
        });
    }

    $(window).bind('load resize scroll', function() {
        if (!stopUserVideo && !stopScrollGallery) {
            if ($(window).scrollTop() > $('.slider').outerHeight() - 300) {
                stopScrollVideo = true;
                $('.slider-preview ul li.play a').click();
            } else {
                if (stopScrollVideo && !stopUserVideo) {
                    stopScrollVideo = false;
                    $('.slider-preview ul li.active a').click();
                }
            }
        }

        $('.flat-header').each(function() {
            if ($('.footer-inner').offset()) {
                var curHeight = $('.footer-inner').offset().top - $(window).height() - $(window).scrollTop();
                if (curHeight < 0) {
                    $(this).css({'bottom': -curHeight});
                } else {
                    $(this).css({'bottom': 0});
                }
            }
        });
    });

})(jQuery);

function initForm() {
    $('input.maskPhone').mask('+7 (999) 999-99-99');

    $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    $(window).resize(function() {
        $('.form-select select').chosen('destroy');
        $('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    });

    $('.form-checkbox span input:checked').parent().parent().addClass('checked');
    $('.form-checkbox').click(function() {
        $(this).toggleClass('checked');
        $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
    });

    $('.form-radio span input:checked').parent().parent().addClass('checked');
    $('.form-radio').click(function() {
        var curName = $(this).find('input').attr('name');
        $('.form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
        $(this).addClass('checked');
        $(this).find('input').prop('checked', true).trigger('change');
    });

    $('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    $('form').each(function() {
        if ($(this).hasClass('ajaxForm')) {
            $(this).validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();

                    $('.form-checkbox, .form-file').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });
                },
                submitHandler: function(form) {
                    $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: $(form).serialize(),
                        dataType: 'html',
                        cache: false
                    }).done(function(html) {
                        $(form).find('.loading').remove();
                        $(form).append(html);
                    });
                }
            });
        } else {
            $(this).validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();

                    $('.form-checkbox, .form-file').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });
                }
            });
        }
    });
}

function initChoose() {
    $('.choose-map').maphilight();
}