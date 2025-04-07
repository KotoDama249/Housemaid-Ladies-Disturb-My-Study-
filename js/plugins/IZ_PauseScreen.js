//=============================================================================
// IZ_PauseScreen.js 
//=============================================================================


/*:ja
 * @plugindesc v1.1メニュー画面の情報を減らしてポーズ画面に変更
 * このプラグインはAltScreenMenu3をもとに作成しました。
 * 
 * 更新記録
 * v1.1 - プラグインパラメータが適用されないエラーを修正しました。(2016/1/22)
 *
 * @author いず
 *
 * @param numCommandRows
 * @desc コマンドウィンドウの行数です。
 * ※現在このパラメーターをいじってもウィンドウの縦幅は変わりません。
 * @default 2
 *
 * @param bgPauseScreen
 * @desc メニュー背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 *
 */

(function() {

    var parameters = PluginManager.parameters('IZ_PauseScreen');
    var numCommandRows = Number(parameters['numCommandRows'] || 2);
    var bgPauseScreen = parameters['bgPauseScreen'] || '';
        
   //
   //■コマンドウィンドウの位置調整
   //
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this._statusWindow.x = Graphics.boxWidth + this._statusWindow.width;//画面の外に消えてもらってます。本当は読み込み自体をなくしたい。。。
        this._statusWindow.y = this._commandWindow.height;//
        this._goldWindow.x = Graphics.boxWidth + this._goldWindow.width;//
        this._commandWindow.x = 0.5 * Graphics.boxWidth - 0.5 * this._commandWindow.width; //コマンドウィンドウを画面中央に移動X
        this._commandWindow.y = 0.5 * Graphics.boxHeight - 0.5 * this._commandWindow.height; //コマンドウィンドウを画面中央に移動Y
    };
   
    //
    //■背景を黒くせずにマップ画面を保持、その上にPNG画像を載せる
    //
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if (bgPauseScreen) {
            //マップ画像を保持
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
            //PNG画像を重ねる
            this._backgroundSprite2 = new Sprite();
            this._backgroundSprite2.bitmap =
             ImageManager.loadPicture(bgPauseScreen);
            this.addChild(this._backgroundSprite2);
            return;
        }
        //PNG画像がない場合は通常のプロセス
        _Scene_Menu_createBackground.call(this);
    };
  
    
    //
    //■コマンドウィンドウの幅などをいじりたい方はここから先を改造してください。
    //

    Window_MenuCommand.prototype.windowWidth = function() {
        return 200;
    };

    Window_MenuCommand.prototype.maxCols = function() {
        return 1;
    };

    Window_MenuCommand.prototype.numVisibleRows = function() {
        return numCommandRows;
    };

    Window_MenuStatus.prototype.windowWidth = function() {
        return 0;//ウィンドウ幅を０にすることで、見た目だけ消えてもらってます。
    };
    

})();
