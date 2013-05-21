/**
 * Created by JetBrains WebStorm.
 * User: mosson
 * Date: 11/11/14
 * Time: 11:48
 * To change this template use File | Settings | File Templates.
 */

var Fourdigit = {

};



Fourdigit.utils = {
    translate3d: function(elem, x, y, z){
        if( elem == undefined ) return;

//	    elem.style.webkitTransformStyle = "preserve-3d";
        var str = elem.style.webkitTransform.match(/^translate3d\(([-.0-9]+)([^\,]*)\,\s([-.0-9]+)([^,]*)\,\s([-.0-9]+)([^,]*).*\)/);
        if( str == null ) str = ["", "0", "", "0", "", "0", ""];

        var cx = parseFloat( str[1] );
        var ax = str[2];
        var cy = parseFloat( str[3] );
        var ay = str[4];
        var cz = parseFloat( str[5] );
        var az = str[6];

        var dx, dy, dz;
        if( x != undefined && x) dx = x
        else dx = cx + ax;

        if( y != undefined && y) dy = y
        else dy = cy + ay;

        if( z != undefined && z) dz = z
        else dz = cz + az;
        
        elem.style.webkitTransform = "translate3d(" + [dx, dy, dz].join(",") + ")";
        return [dx, dy, dz];
    },

	backgroundCallBack: function( $elem, f ){

		var matches = $elem.css("background-image").match(/url\((.+?)\)/);

		if( matches && matches[1] ){
			var src = matches[1].replace(/\"/g, "");

			var image = new Image();
			image.src = src;

			if( image.complete || image.readyState == "complete" || image.readyState == 4 ){
				f();
			}else{
				$(image).one("load", function(){
					f();
				});
			}
			$(image).attr("src", src);
		}
	},

    uniq: function( arr ) {
        var o = {},r = [];
        for (var i = 0;i < arr.length;i++) if (arr[i] in o? false: o[arr[i]] = true) r.push(arr[i]);
        return r;
    },

	shuffle: function( arr ) {
		var i = arr.length;
		while(i){
			var j = Math.floor(Math.random()*i);
			var t = arr[--i];
			arr[i] = arr[j];
			arr[j] = t;
		}
		return arr;
	},

	realSize: function( src, fn ){
		var pic_real_width, pic_real_height;
		$("<img/>")
			.attr("src", src )
			.load(function() {
				pic_real_width = this.width;
				pic_real_height = this.height;
				fn( pic_real_width, pic_real_height );
			});
	},

	getImageSize:function(image) {
		var w = image.width;
		var h = image.height;

		if ( typeof image.naturalWidth !== 'undefined' ) {  // for Firefox, Safari, Chrome
			w = image.naturalWidth;
			h = image.naturalHeight;

		} else if ( typeof image.runtimeStyle !== 'undefined' ) {    // for IE
			var run = image.runtimeStyle;
			var mem = { w: run.width, h: run.height };  // keep runtimeStyle
			run.width  = "auto";
			run.height = "auto";
			w = image.width;
			h = image.height;
			run.width  = mem.w;
			run.height = mem.h;

		} else {         // for Opera
			var mem = { w: image.width, h: image.height };  // keep original style
			image.removeAttribute("width");
			image.removeAttribute("height");
			w = image.width;
			h = image.height;
			image.width  = mem.w;
			image.height = mem.h;
		}

		return {width:w, height:h};
	}
};