/**
 * defineClass() -- JavaScript のクラス定義用のユーティリティ関数
 *
 * この関数は、唯一の引数としてオブジェクトを一つ受け取る。オブジェクト中の
 * データを利用してJavaScriptクラスを定義し、このクラスのコンストラクタ関数を
 * 戻り値として返す。クラスを定義する場合に必要な手続きをこの関数が受け持つ。
 * 例えば、継承関係を構築する為のプロトタイプオブジェクトの設定や、他の
 * クラスのメソッドのコピー等。
 *
 * 引数として渡されるオブジェクトには、以下ののようなプロパティを一部または全部
 * 設定しておく。
 *
 *      name:   定義するクラスの名前。
 *              この値が指定されている場合は、プロトタイプオブジェクトの
 *              classnameプロパティに値を保存する。
 *
 *      extend: スーパークラスとなるクラスのコンストラクタ。省略された場合は、
 *              Object()コンストラクタが使われる。この値は、プロトタイプ
 *              オブジェクトのconstructorプロパティに値が保存される
 *
 *      construct:  このクラス用のコンストラクタ関数。省略された場合は、
 *                  空の関数が使われる。この値は、この関数の戻り値として使われ、
 *                  プロトタイプオブジェクトのconstructorプロパティに値が保存
 *                  される。
 *
 *      methods:    クラスのインスタンスメソッド（やほかの共有されるプロパティ）
 *                  を定義するオブジェクト。このオブジェクトのプロパティがクラスの
 *                  プロトタイプオブジェクトにコピーされる。省略した場合は、空の
 *                  オブジェクトが使われる。classname, superclass, constructorは
 *                  予約語なので、このオブジェクトで使うことはできない。
 *
 *      statics:    クラスの静的なメソッド（や他の静的なプロパティ）を定義する
 *                  オブジェクト。このオブジェクトのプロパティがコンストラクタ関数
 *                  のプロパティになる。省略した場合は、空のオブジェクトが使われる。
 *
 *      borrows:    コンストラクタ関数、または、コンストラクタ関数の配列。
 *                  指定されたクラスで定義されるインスタンスメソッドを借用し、新しい
 *                  クラスのプロトタイプオブジェクトにコピーする。コンストラクタは、
 *                  指定された順序で処理が行われる。配列の後方に配置されたクラスの
 *                  メソッドが、前方のクラスのメソッドを上書きする場合もある。
 *                  借用されたメソッドは、前述したmethodsプロパティよりも前に
 *                  プロトタイプオブジェクトに保存される。したがって、methodsオブジェクト
 *                  で指定したメソッドが借用したメソッドを上書きする場合もある。このプロパティ
 *                  が指定されていなければ、メソッドを借用しない。
 *
 *      provides:   コンストラクタ関数、または、コンストラクタ関数の配列。
 *                  オブジェクトが完全に初期化された後、この関数を使って、この
 *                  クラスで定義されたメソッドと同じ引数を持つメソッドを持って
 *                  いるかどうかを検証する。メソッドがコピーされる訳ではない。
 *                  単純に、このクラスが指定されたクラスの機能を「提供」するか
 *                  どうかを確認するだけ。提供していないと判断した場合は、
 *                  このメソッドは例外をスローする。例外がスローされなければ、
 *                  新しいクラスのインスタンスは（ダックタイピングを使って）ここで
 *                  指定した他のクラスのインスタンスと見なせることになる。
 *                  このプロパティが定義されていなければ、検証処理は行われない。
 *
 */

function defineClass(data){
	// 引数として渡されたオブジェクトから、使用するフィールドを抽出し、
	// デフォルト値を設定する。
	var classname = data.name;

	var superclass = data.extend || Object;
	var constructor = data.construct || function() {};
	var methods = data.methods || {};
	var statics = data.statics || {};
	var borrows;
	var provides;

	// borrowsはコンストラクタまたはコンストラクタの配列
	if( !data.borrows) borrows = [];
	else if (data.borrows instanceof Array ) borrows = data.borrows;
	else borrows = [ data.borrows ];

	// provides プロパティも同様。
	if( !data.provides ) provides = [];
	else if ( data.provides instanceof Array ) provides = data.provides;
	else provides = [ data.provides ];

	// クラスのプロトタイプになるオブジェクトを生成する。
	var proto = new superclass();

	// このプロトタイプオブジェクトに継承されたプロパティだけを残す。
	for( var p in proto )
		if( proto.hasOwnProperty(p) ) delete proto[p];

	// ミックスインクラスからメソッドをプロトタイプにコピーする。
	for( var i = 0; i < borrows.length; i++ ){
		var c = data.borrows[i];
		// メソッドを、cのプロトタイプから新しいクラスのプロトタイプにコピーする。
		for( var p in c.prototype ){
			if( typeof c.prototype[p] != "function" ) continue;
			proto[p] = c.prototype[p];
		}
	}

	// インスタンスをプロトタイプオブジェクトにコピーする。
	// ミックスインクラスのメソッドを上書きする場合もある。
	for( var p in methods ) proto[p] = methods[p];


	// プロトタイプに予約語のconstructor, superclass, classname
	// プロパティを設定する。
	proto.constructor = constructor;
	proto.superclass = superclass;
	// 名前が指定されている場合にのみ、classnameを設定する。
	if( classname ) proto.classname = classname;

	// 新しいプロトタイプが想定したメソッドをすべて提供しているかを検証する。
	for( var i = 0; i < provides.length; i++ ){ // クラグごとのループ
		c = provides[i];
		for( var p in c.prototype ){ // プロパティごとのループ
			if( typeof c.prototype[p] != "function" ) continue;// メソッドだけを調べる
			if( p == "constructor" || p == "superclass" ) continue;
			// 同じ名前のメソッドを餅、引数の数が同じかどうかをチェックする。
			// 同じ場合は処理を続ける。
			if( p in proto && typeof proto[p] == "function" && proto[p].length == c.prototype[p].length ) continue;
			// 異なる場合は例外をスローする
			throw new Error("Class " + classname + " does not provide method "+c.classname + "." + p);
		}
	}

	// プロトタイプオブジェクトをコンストラクタ関数と関連付ける。
	constructor.prototype = proto;

	// 静的なプロパティをコンストラクタにコピーする。
	for( var p in statics ) constructor[p] = data.statics[p];

	// 最後にコンストラクタ関数を返す。
	return constructor;
}
