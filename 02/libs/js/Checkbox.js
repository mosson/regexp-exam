/**
 * Created by JetBrains WebStorm.
 * User: mosson
 * Date: 12/05/24
 * Time: 12:05
 * To change this template use File | Settings | File Templates.
 */

/* usage */
/*

$("label").each(function(){ new Checkbox($(this)) });

default:
<label onclick="">
	<input type="radio"> something
</label>

onclickはios4以下のバグフィックス　
+
body { -webkit-animation: bugfix infinite 1s; }
@-webkit-keyframes bugfix { from { padding: 0; } to { padding: 0; } }
を記述すること

checked:
<label onclick="" class="checked">
	<input type="radio" checked="checked"> something
</label>

*/
/*********/

var Checkbox = defineClass({
	name: "Checkbox",
	construct: function( $source ){
		this.$source = $source;
		this.init();
	},
	methods:{
		$source: null,
		inited: false,
		statics: {
			chain: {}
		},
		init: function(){
			var self = this;

			if( this.inited ) return;
			this.inited = true;

			// radio chain
			var $target = self.$source.find("input:first");
			if( $target.is(":radio") ){
				if( !Checkbox[$target.attr("name")] ) Checkbox[$target.attr("name")] = [];
				Checkbox[$target.attr("name")].push( self );
			}

			// ie fix : input, has style "display none", cannot link label
			if( $("body").hasClass("ie6") || $("body").hasClass("ie7") || $("body").hasClass("ie8") ){

				this.$source.on(
					"click",
					{self: self},
					self.bugfixClick
				);

			}


			//accessibility
			this.$source.on( "mouseover", function(e){ self.$source.addClass("hover"); } );
			this.$source.on( "mouseout", function(e){ self.$source.removeClass("hover"); } );
			this.$source.on( document.ontouchstart !== undefined ? "touchstart" : "mousedown", function(){ self.$source.addClass("down"); } );
			this.$source.on( document.ontouchstart !== undefined ? "touchend" : "mouseup", function(){ self.$source.removeClass("down"); } );

			//toggle event
			this.$source.find("input").on( "change", {self: self}, self.changeHdl );

			//initial call
			self.$source.find("input").trigger("change");

		},

		bugfixClick: function(e){
			var self = e.data.self;

			e.preventDefault();
			e.stopPropagation();

			self.$source.find("input").prop(
				"checked",
				!self.$source.find("input").prop("checked")
			);

			self.$source.find("input").trigger("change");
		},

		changeHdl: function(e){
			var self = e.data.self;

			if( $(e.currentTarget).is(":radio") ){
				for( var i = 0; i < Checkbox[$(e.currentTarget).attr("name")].length; i++ ){
					var checkbox = Checkbox[$(e.currentTarget).attr("name")][i];
					self.toggleCheck( checkbox );
				};
			}else{
				var checkbox = self;
				self.toggleCheck( checkbox );
			}
		},

		toggleCheck: function( checkbox ){
			var $box = checkbox.$source;
			if( $box.find("input:first").prop("checked") ) $box.addClass("checked")
			else $box.removeClass("checked");
		}
	}
});