/**
 * Created by JetBrains WebStorm.
 * User: mosson
 * Date: 12/02/23
 * Time: 15:48
 * To change this template use File | Settings | File Templates.
 */

// utils
$.extend({
	liveOver: function(){
		$(document).on(
			"mouseover",
			".ahover:not(.death), .ahoverArea img:not(.death), .ahoverdown:not(.death)",
			this.liveOverHdl
		);
		$(document).on(
			"mouseout",
			".ahover:not(.death), .ahoverArea img:not(.death), .ahoverdown:not(.death)",
			this.liveOutHdl
		);
		$(document).on(
			"mousedown",
			".ahoverdown:not(.death)",
			this.liveDownHdl
		);
		$(document).on(
			"mouseup",
			".ahoverdown:not(.death)",
			this.liveUpHdl
		);
	},
	deathOver: function(target){
		$(target).trigger("mouseout");
		$(target).addClass("death");
	},
	reviveOver: function(target){
		$(target).removeClass("death");
	},
	liveOverHdl: function(e){
		if( !$( e.currentTarget ).is("img") ) return;
		if( $( e.currentTarget ).hasClass("off") ) return;

		if( !$(e.currentTarget).data("osrc") ){
			var src = $(e.currentTarget).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(e.currentTarget).data("dsrc", fname+ext);
			$(e.currentTarget).data("osrc", fname+"_ov"+ext);
			$(e.currentTarget).data("fsrc", fname+"_off"+ext);
			$(e.currentTarget).data("gsrc", fname+"_down"+ext);
			$(e.currentTarget).data("ssrc", fname+"_sending"+ext);
			$(e.currentTarget).data("isPNG", ext == ".png");
		}

		$(e.currentTarget).attr("src", $(e.currentTarget).data("osrc"));
	},

	liveOutHdl: function(e){
		if( !$( e.currentTarget ).is("img") ) return;
		if( $( e.currentTarget ).hasClass("off") ) return;

		if( !$(e.currentTarget).data("dsrc") ){
			var src = $(e.currentTarget).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(e.currentTarget).data("dsrc", fname+ext);
			$(e.currentTarget).data("osrc", fname+"_ov"+ext);
			$(e.currentTarget).data("fsrc", fname+"_off"+ext);
			$(e.currentTarget).data("gsrc", fname+"_down"+ext);
			$(e.currentTarget).data("ssrc", fname+"_sending"+ext);
			$(e.currentTarget).data("isPNG", ext == ".png");
		}
		$(e.currentTarget).attr("src", $(e.currentTarget).data("dsrc"));
	},

	liveDownHdl: function(e){
		if( !$( e.currentTarget ).is("img") ) return;
		if( $( e.currentTarget ).hasClass("off") ) return;

		if( !$(e.currentTarget).data("dsrc") ){
			var src = $(e.currentTarget).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(e.currentTarget).data("dsrc", fname+ext);
			$(e.currentTarget).data("osrc", fname+"_ov"+ext);
			$(e.currentTarget).data("fsrc", fname+"_off"+ext);
			$(e.currentTarget).data("gsrc", fname+"_down"+ext);
			$(e.currentTarget).data("ssrc", fname+"_sending"+ext);
			$(e.currentTarget).data("isPNG", ext == ".png");
		}
		$(e.currentTarget).attr("src", $(e.currentTarget).data("gsrc"));
	},
	liveUpHdl: function(e){
		if( !$( e.currentTarget ).is("img") ) return;
		if( $( e.currentTarget ).hasClass("off") ) return;

		if( !$(e.currentTarget).data("dsrc") ){
			var src = $(e.currentTarget).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(e.currentTarget).data("dsrc", fname+ext);
			$(e.currentTarget).data("osrc", fname+"_ov"+ext);
			$(e.currentTarget).data("fsrc", fname+"_off"+ext);
			$(e.currentTarget).data("gsrc", fname+"_down"+ext);
			$(e.currentTarget).data("ssrc", fname+"_sending"+ext);
			$(e.currentTarget).data("isPNG", ext == ".png");
		}
		$(e.currentTarget).attr("src", $(e.currentTarget).data("dsrc"));
	}


});

$.fn.extend({
	disableOver: function(){
		if( !$(this).is("img") ) return;
		if( $(this).hasClass("off") ) return;


		if( !$(this).data("osrc") ){
			var src = $(this).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(this).data("dsrc", fname+ext);
			$(this).data("osrc", fname+"_ov"+ext);
			$(this).data("fsrc", fname+"_off"+ext);
			$(this).data("ssrc", fname+"_snding"+ext);
			$(this).data("ssrc", fname+"_sending"+ext);
			$(this).data("isPNG", ext == ".png" );
		}

		$(this).addClass("off");
		$(this).attr("src", $(this).data("fsrc"));

		if( Conductor.ie <= 6 && $(this).data("isPNG") ){
			var el = $(this)[0];
			if( el.vml )
				el.vml.image.fill.setAttribute("src", $(el).data("fsrc"));
		}

	},

	enableOver: function(){
		if( !$(this).is("img") ) return;
		if( !$(this).hasClass("off") ) return;

		if( !$(this).data("osrc") ){
			var src = $(this).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(this).data("dsrc", fname+ext);
			$(this).data("osrc", fname+"_ov"+ext);
			$(this).data("fsrc", fname+"_off"+ext);
			$(this).data("ssrc", fname+"_snding"+ext);
			$(this).data("isPNG", ext == ".png");
		}

		$(this).removeClass("off");
		$(this).attr("src", $(this).data("dsrc"));

		if( Conductor.ie <= 6 && $(this).data("isPNG") ){
			var el = $(this)[0];
			if (el.vml)
				el.vml.image.fill.setAttribute("src", $(el).data("dsrc"));
		}
	},

	fixPngAndLiveOver: function(){
		$(this).fixPng();

		var el = $(this)[0];
		if( !$(el).data("dsrc") ){
			var src = $(el).attr("src");
			var fname = src.substr(0, src.lastIndexOf("."));
			var ext = src.substr( src.lastIndexOf("."));
			$(el).data("dsrc", fname+ext);
			$(el).data("osrc", fname+"_ov"+ext);
			$(el).data("fsrc", fname+"_off"+ext);
		}

        el.vml.image.shape.attachEvent('onmouseenter', function() {
            var image = el.vml.image.fill;
            image.setAttribute("src", $(el).data("osrc"));
        });
        el.vml.image.shape.attachEvent('onmouseleave', function() {
            var image = el.vml.image.fill;
            image.setAttribute("src", $(el).data("dsrc"));
        });

	}
});