/**
 * Created by JetBrains WebStorm.
 * User: mosson
 * Date: 12/02/15
 * Time: 15:52
 * To change this template use File | Settings | File Templates.
 */

function trace(str){
	try{
		console.log( str );
	}catch(e){

	}
}

function isArray( obj ){
	return /array/.test( Object.prototype.toString.call(obj).toLowerCase() );
}

function randobet(n, b) {
	b = b || '';
	var a = 'abcdefghijklmnopqrstuvwxyz'
		+ 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		+ '0123456789'
		+ b;
	a = a.split('');
	var s = '';
	for (var i = 0; i < n; i++) {
    	s += a[Math.floor(Math.random() * a.length)];
	}
	return s;
};

(function($){
	$(document).ready(function(){
		for( var i in window.question ){

			$("div").each(function(){
				if( $(this).hasClass(i) ){
					$(this).html(window.question[i]);
					return false;
				}
			});
		}

	    var startDate = new Date();
		var isFinish = false;
	    var tick = setInterval( function() {
			diffDate = new Date(new Date() - startDate); //現在時刻と開始時刻の差分を取る
			time = diffDate.toGMTString().replace(/.*(\d\d:\d+:\d+).*/, '$1'); //経過時刻を求める

		    $("#Container .t").html(time);
			if( isFinish ) clearInterval( tick );
	    }, 33 );

		$(document).on("click", "#Submit", function(){
			/**************************/

			var pattern;
			try{
				pattern = new RegExp( $("#Reg").val() );
			}catch(e){
				pattern = null;
			}
			if( !pattern ){
				alert("正規表現の書式が違うよ");
				return;
			}

			/**************************/

			var q = window.question.q;


			var answer;
			try{
				answer = q.match( pattern) || [];
			}catch(e){
				answer = [];
			}

			trace( answer );

			/**************************/

			var a = window.question.a;

			if( isArray(a) ){
				b = true;
				var missing = [];
				for( var i = 0; i < window.question.a.length; i++ ){
					if( answer.indexOf( a[i] ) < 0 ) {
						missing.push( a[i] );
						b = false;
					}
				}

				if( b ){
					isFinish = true;
					alert("正解");
				}else{
					alert("不正解" + "\r\n" +  "マッチしたもの : " + "[" + answer.join(",") + "]" + "\r\n" + "[" + missing.join(",") + "]" + "がマッチしていません" );
				}
			}else{
				if( answer.indexOf( a ) > -1 ){
					isFinish = true;
					alert("正解");
				}else{
					alert("不正解" + "\r\n" +  "マッチしたもの : " + "[" + answer.join(",") + "]");
				}
			}

		});
	});
})(jQuery);