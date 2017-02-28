jQuery(document).ready(function(event){
	/* MENU */
	var projectsContainer = $('.cd-projects-container'),
		triggerNav = $('.cd-3d-nav-trigger'),
		logo = $('.cd-logo');
		/* NAVIGATION */
		//toggle 3d navigation
		$('.cd-3d-nav-trigger').on('click', function(){

			toggle3dBlock(!$('.cd-header').hasClass('nav-is-visible'));
		});
		// Hover items //
		$('.cd-3d-nav').on('mouseover','a',function(){
			var hover = $(this);
			hover.parent('li').addClass('cd-hover').siblings('li').removeClass('cd-hover');
			updateHoverNav();
		});
		//select a new item from the 3d navigation
		$('.cd-3d-nav').on('click', 'a', function(){
			var selected = $(this);
			selected.parent('li').addClass('cd-selected').siblings('li').removeClass('cd-selected');
			updateSelectedNav('close');
			//close navigation
			triggerNav.add(projectsContainer).removeClass('nav-open');


		});

		$(window).on('resize', function(){
			window.requestAnimationFrame(updateSelectedNav);
		});

		function toggle3dBlock(addOrRemove) {
			if(typeof(addOrRemove)==='undefined') addOrRemove = true;
			$('.cd-header').toggleClass('nav-is-visible nav-open', addOrRemove);
			$('.cd-3d-nav-container').toggleClass('nav-is-visible', addOrRemove);

		}
		//this function update the .cd-marker position on hover
		function updateHoverNav() {
			var hoverItem = $('.cd-hover'),
				hoverItemPosition = hoverItem.index() + 1,
				leftPosition = hoverItem.offset().left,
				backgroundColor = hoverItem.data('color'),
				marker = $('.cd-marker');

			marker.removeClassPrefix('color').addClass('color-'+ hoverItemPosition).css({
				'left': leftPosition,
			});

		}
		//this function update the .cd-marker position
		function updateSelectedNav(type) {
			var selectedItem = $('.cd-selected'),
				selectedItemPosition = selectedItem.index() + 1,
				leftPosition = selectedItem.offset().left,
				backgroundColor = selectedItem.data('color'),
				marker = $('.cd-marker');



			if( type == 'close') {
				$('.nav-is-visible').removeClass('nav-is-visible');

				marker.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					toggle3dBlock(false);
				});
			}
		}

		$.fn.removeClassPrefix = function(prefix) {
				this.each(function(i, el) {
						var classes = el.className.split(" ").filter(function(c) {
								return c.lastIndexOf(prefix, 0) !== 0;
						});
						el.className = $.trim(classes.join(" "));
				});
				return this;
		};
	triggerNav.on('click', function(){
		if( triggerNav.hasClass('project-open') ) {
			//close project
			projectsContainer.removeClass('project-open').find('.selected').removeClass('selected').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$(this).children('.cd-project-info').scrollTop(0).removeClass('has-boxshadow');

			});
			triggerNav.add(logo).removeClass('project-open');
			// close design project
			singleProjectContent.removeClass('is-visible');

		} else {

			//trigger navigation visibility
			triggerNav.add(projectsContainer).toggleClass('nav-open');
			triggerNav.add(gallery).toggleClass('nav-open');

		}
	});
	/* Page url switch  on nav*/

		$('.pf-design-button').on('click',function(){
			window.setTimeout(function(){
			document.location.href='design.html';
		},500);
		});
		$('.pf-about-button').on('click',function(){
			window.setTimeout(function(){
			document.location.href='about.html';
		},500);
		});
		$('.pf-project-button').on('click',function(){
			window.setTimeout(function(){
			document.location.href='project.html';
		},500);
		});




	/* DEESIGN PAGES */

	var url      = window.location.href;
	var pathname = window.location.pathname; // Returns path only
	console.log(pathname);
	if(url=='file:///C:/Users/Hizary/Desktop/project-cards-template/design.html' || url=='file:///C:/Users/Hizary/Desktop/project-cards-template/design.html#0') {
	var
		projectsContainer = $('.cd-projects-wrapper'),
		projectsSlider = projectsContainer.children('.cd-slider'),
		singleProjectContent = $('.cd-project-content'),
		sliderNav = $('.cd-slider-navigation');

	var resizing = false;

	//if on desktop - set a width for the projectsSlider element
	setSliderContainer();
	$(window).on('resize', function(){
		//on resize - update projectsSlider width and translate value
		if( !resizing ) {
			(!window.requestAnimationFrame) ? setSliderContainer() : window.requestAnimationFrame(setSliderContainer);
			resizing = true;
		}
	});



		projectsContainer.addClass('projects-visible');
		//animate single project - entrance animation
		setTimeout(function(){
			showProjectPreview(projectsSlider.children('li').eq(0));
		}, 200);




	//select a single project - open project-content panel
	projectsContainer.on('click', '.cd-slider a', function(event) {
		var mq = checkMQ();
		event.preventDefault();
		if( $(this).parent('li').next('li').is('.current') && (mq == 'desktop') ) {
			prevSides(projectsSlider);
		} else if ( $(this).parent('li').prev('li').prev('li').prev('li').is('.current')  && (mq == 'desktop') ) {
			nextSides(projectsSlider);
		} else {
			singleProjectContent.addClass('is-visible');
			triggerNav.addClass('project-open').removeClass('nav-open');
			$('.cd-header').addClass('nav-is-visible').removeClass('nav-open');
			$('.cd-3d-nav-container').removeClass('nav-is-visible');
			$('.cd-logo').addClass('project-open');

		}
	});

	//close single project content
	singleProjectContent.on('click', '.close', function(event){
		event.preventDefault();
		singleProjectContent.removeClass('is-visible');
	});

	//go to next/pre slide - clicking on the next/prev arrow
	sliderNav.on('click', '.next', function(){
		nextSides(projectsSlider);
	});
	sliderNav.on('click', '.prev', function(){
		prevSides(projectsSlider);
	});

	//go to next/pre slide - keyboard navigation
	$(document).keyup(function(event){
		var mq = checkMQ();
		if(event.which=='37' &&  intro.hasClass('projects-visible') && !(sliderNav.find('.prev').hasClass('inactive')) && (mq == 'desktop') ) {
			prevSides(projectsSlider);
		} else if( event.which=='39' &&  intro.hasClass('projects-visible') && !(sliderNav.find('.next').hasClass('inactive')) && (mq == 'desktop') ) {
			nextSides(projectsSlider);
		} else if(event.which=='27' && singleProjectContent.hasClass('is-visible')) {
			singleProjectContent.removeClass('is-visible');
		}
	});

	projectsSlider.on('swipeleft', function(){
		var mq = checkMQ();
		if( !(sliderNav.find('.next').hasClass('inactive')) && (mq == 'desktop') ) nextSides(projectsSlider);
	});

	projectsSlider.on('swiperight', function(){
		var mq = checkMQ();
		if ( !(sliderNav.find('.prev').hasClass('inactive')) && (mq == 'desktop') ) prevSides(projectsSlider);
	});

	function showProjectPreview(project) {
		if(project.length > 0 ) {
			setTimeout(function(){
				project.addClass('slides-in');
				showProjectPreview(project.next());
			}, 50);
		}
	}

	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.cd-projects-wrapper'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}

	function setSliderContainer() {
		var mq = checkMQ();
		if(mq == 'desktop') {
			var	slides = projectsSlider.children('li'),
				slideWidth = slides.eq(0).width(),
				marginLeft = Number(projectsSlider.children('li').eq(1).css('margin-left').replace('px', '')),
				sliderWidth = ( slideWidth + marginLeft )*( slides.length + 1 ) + 'px',
				slideCurrentIndex = projectsSlider.children('li.current').index();
			projectsSlider.css('width', sliderWidth);
			( slideCurrentIndex != 0 ) && setTranslateValue(projectsSlider, (  slideCurrentIndex * (slideWidth + marginLeft) + 'px'));
		} else {
			projectsSlider.css('width', '');
			setTranslateValue(projectsSlider, 0);
		}
		resizing = false;
	}

	function nextSides(slider) {
		var actual = slider.children('.current'),
			index = actual.index(),
			following = actual.nextAll('li').length,
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		index = (following > 4 ) ? index + 3 : index + following - 2;
		//calculate the translate value of the slider container
		translate = index * (width + marginLeft) + 'px';

		slider.addClass('next');
		setTranslateValue(slider, translate);
		slider.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			updateSlider('next', actual, slider, following);
		});

		if( $('.no-csstransitions').length > 0 ) updateSlider('next', actual, slider, following);
	}

	function prevSides(slider) {
		var actual = slider.children('.previous'),
			index = actual.index(),
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		translate = index * (width + marginLeft) + 'px';

		slider.addClass('prev');
		setTranslateValue(slider, translate);
		slider.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			updateSlider('prev', actual, slider);
		});

		if( $('.no-csstransitions').length > 0 ) updateSlider('prev', actual, slider);
	}

	function updateSlider(direction, actual, slider, numerFollowing) {
		if( direction == 'next' ) {

			slider.removeClass('next').find('.previous').removeClass('previous');
			actual.removeClass('current');
			if( numerFollowing > 4 ) {
				actual.addClass('previous').next('li').next('li').next('li').addClass('current');
			} else if ( numerFollowing == 4 ) {
				actual.next('li').next('li').addClass('current').prev('li').prev('li').addClass('previous');
			} else {
				actual.next('li').addClass('current').end().addClass('previous');
			}
		} else {

			slider.removeClass('prev').find('.current').removeClass('current');
			actual.removeClass('previous').addClass('current');
			if(actual.prevAll('li').length > 2 ) {
				actual.prev('li').prev('li').prev('li').addClass('previous');
			} else {
				( !slider.children('li').eq(0).hasClass('current') ) && slider.children('li').eq(0).addClass('previous');
			}
		}

		updateNavigation();
	}

	function updateNavigation() {
		//update visibility of next/prev buttons according to the visible slides
		var current = projectsContainer.find('li.current');
		console.log(current,(current.is(':first-child')));
		(current.is(':first-child')) ? sliderNav.find('.prev').addClass('inactive') : sliderNav.find('.prev').removeClass('inactive');
		(current.nextAll('li').length < 3 ) ? sliderNav.find('.next').addClass('inactive') : sliderNav.find('.next').removeClass('inactive');
	}

	function setTranslateValue(item, translate) {
		item.css({
				'-moz-transform': 'translateX(-' + translate + ')',
				'-webkit-transform': 'translateX(-' + translate + ')',
			'-ms-transform': 'translateX(-' + translate + ')',
			'-o-transform': 'translateX(-' + translate + ')',
			'transform': 'translateX(-' + translate + ')',
		});
	}



	/* END DESIGN PAGES */
}
else if (url=='file:///C:/Users/Hizary/Desktop/project-cards-template/project.html' || url=='file:///C:/Users/Hizary/Desktop/project-cards-template/project.html#0') {



	projectsContainer.on('click', '.single-project', function(){
		var selectedProject = $(this);
		if( projectsContainer.hasClass('nav-open') ) {
			$('.cd-3d-nav-container').removeClass('nav-is-visible');
			//open project
			selectedProject.addClass('selected');
			$('.cd-header').removeClass('nav-open');
			projectsContainer.add(triggerNav).add(logo).addClass('project-open').removeClass('nav-open');

		} else {
			//open project
			selectedProject.addClass('selected');
			$('.cd-header').addClass('nav-is-visible');
			projectsContainer.add(triggerNav).add(logo).addClass('project-open');
		}
	});

	projectsContainer.on('click', '.cd-scroll', function(){
		//scroll down when clicking on the .cd-scroll arrow
		var visibleProjectContent =  projectsContainer.find('.selected').children('.cd-project-info'),
			windowHeight = $(window).height();

		visibleProjectContent.animate({'scrollTop': windowHeight}, 300);
	});

	//add/remove the .has-boxshadow to the project content while scrolling
	var scrolling = false;
	projectsContainer.find('.cd-project-info').on('scroll', function(){
		if( !scrolling ) {
		 	(!window.requestAnimationFrame) ? setTimeout(updateProjectContent, 300) : window.requestAnimationFrame(updateProjectContent);
		 	scrolling = true;
		}
	});

	function updateProjectContent() {
		var visibleProject = projectsContainer.find('.selected').children('.cd-project-info'),
			scrollTop = visibleProject.scrollTop();
		( scrollTop > 0 ) ? visibleProject.addClass('has-boxshadow') : visibleProject.removeClass('has-boxshadow');
		scrolling = false;
	}



}
else {
/* ABOUT PAGE */
var gallery = $('.cd-gallery'),
	foldingPanel = $('.cd-folding-panel'),
	mainContent = $('.cd-main');



/* open folding content */
gallery.on('click', 'a', function(event){
	event.preventDefault();
	openItemInfo($(this).attr('href'));
});

/* close folding content */
foldingPanel.on('click', '.cd-close', function(event){
	event.preventDefault();
	toggleContent('', false);
});
gallery.on('click', function(event){
	/* detect click on .cd-gallery::before when the .cd-folding-panel is open */
	if($(event.target).is('.cd-gallery') && $('.fold-is-open').length > 0 ) toggleContent('', false);
});

function openItemInfo(url) {
	var mq = viewportSize();
	if( gallery.offset().top > $(window).scrollTop() && mq != 'mobile') {
		/* if content is visible above the .cd-gallery - scroll before opening the folding panel */
		$('body,html').animate({
			'scrollTop': gallery.offset().top
		}, 100, function(){
						toggleContent(url, true);
				});
		} else if( gallery.offset().top + gallery.height() < $(window).scrollTop() + $(window).height()  && mq != 'mobile' ) {
		/* if content is visible below the .cd-gallery - scroll before opening the folding panel */
		$('body,html').animate({
			'scrollTop': gallery.offset().top + gallery.height() - $(window).height()
		}, 100, function(){
						toggleContent(url, true);
				});
	} else {
		toggleContent(url, true);
	}
}

function toggleContent(url, bool) {
	if( bool ) {
		/* load and show new content */
		var foldingContent = foldingPanel.find('.cd-fold-content');
		foldingContent.load(url+' .cd-fold-content > *', function(event){
			setTimeout(function(){
				$('body').addClass('overflow-hidden');
				foldingPanel.addClass('is-open');
				mainContent.addClass('fold-is-open');
			}, 100);

		});
	} else {
		/* close the folding panel */
		var mq = viewportSize();
		foldingPanel.removeClass('is-open');
		mainContent.removeClass('fold-is-open');

		(mq == 'mobile' || $('.no-csstransitions').length > 0 )
			/* according to the mq, immediately remove the .overflow-hidden or wait for the end of the animation */
			? $('body').removeClass('overflow-hidden')

			: mainContent.find('.cd-item').eq(0).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
				mainContent.find('.cd-item').eq(0).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			});
	}

}

	function viewportSize() {
		/* retrieve the content value of .cd-main::before to check the actua mq */
		return window.getComputedStyle(document.querySelector('.cd-main'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}
}
/* END ABOUT PAGE */
});
