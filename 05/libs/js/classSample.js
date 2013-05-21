/**
 * Created by JetBrains WebStorm.
 * User: mosson
 * Date: 12/05/22
 * Time: 18:24
 * To change this template use File | Settings | File Templates.
 */

var A = defineClass({
	name: "A",
	methods: {
		a: "abc",
		method: function(){
			console.log("A");
		}
	}
});

var a = new A();
a.method();

var B = defineClass({
	name: "B",
	extend: A,
	methods: {
		method: function(){

			console.log( this.a );

			var tmpsuper = this.superclass;
			var f = this.superclass.prototype.method;
			this.superclass = this.superclass.prototype.superclass;
			f.apply(this, arguments);
			this.superclass = tmpsuper;

			console.log("B");
		}
	}
});

var b = new B();
b.method();

var C = defineClass({
	name: "C",
	extend: B,
	methods: {
		method: function(){

			console.log( this.a );
			var tmpsuper = this.superclass;
			var f = this.superclass.prototype.method;
			this.superclass = this.superclass.prototype.superclass;
			f.apply(this, arguments);
			this.superclass = tmpsuper;

			console.log("C");
		}
	}
});

var c = new C();
c.method();