/* ========================================================
*
* MVP Ready - Lightweight & Responsive Admin Template
*
* ========================================================
*
* File: mvpready-admin.js
* Theme Version: 1.1.0
* Bootstrap Version: 3.1.1
* Author: Jumpstart Themes
* Website: http://mvpready.com
*
* ======================================================== */

var mvpready_admin = function () {

	"use strict"

	var initLayoutToggles = function () {
		$('.navbar-toggle, .mainnav-toggle').click (function (e) {
			$(this).toggleClass ('is-open')
		})
	}

	var initNoticeBar = function () {
		$('.noticebar > li > a').click (function (e) {
			if (mvpready_core.isLayoutCollapsed ()) {
				window.location = $(this).prop ('href')
			}
		})
	}

	return {
		init: function () {
			// Layouts
			mvpready_core.navEnhancedInit ()
			mvpready_core.navHoverInit ({ delay: { show: 250, hide: 350 } })      
			initLayoutToggles ()
			initNoticeBar ()

			// Components
			mvpready_core.initAccordions ()		
			mvpready_core.initFormValidation ()
			mvpready_core.initTooltips ()
			mvpready_core.initBackToTop ()		
			mvpready_core.initLightbox ()
		}
	}

}()

/*$(function () {
	mvpready_admin.init ()
})

$(document).ready(function() {
    mvpready_admin.init();
})*/