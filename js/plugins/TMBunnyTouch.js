//=============================================================================
// TMPlugin - バニータッチ
// バージョン: 1.0.0
// 最終更新日: 2018/02/19
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2018 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 数字を順番にタッチしていくミニゲームを追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param characterName
 * @type file
 * @desc バニーとして使用する歩行画像のファイル名
 * 初期値: People2
 * @default People2
 * @require 1
 * @dir img/characters/
 * 
 * @param characterIndex
 * @type number
 * @desc バニーとして使用する歩行画像のインデックス
 * 初期値: 7
 * @default 7
 * 
 * @param numberColor
 * @desc バニーに描画する数字の色
 * 初期値: #000000
 * @default #000000
 * 
 * @param numberOutlineColor
 * @desc バニーに描画する数字の縁の色
 * 初期値: #ffffff
 * @default #ffffff
 * 
 * @param helpLines
 * @number
 * @desc ヘルプテキストを表示するウィンドウの行数
 * 初期値: 2
 * @default 2
 * 
 * @param helpTexts
 * @type struct<HelpText>
 * @desc ヘルプテキストの表示内容
 * @default {"prestart":"数字が小さい順にタッチしてね!!\\n(クリック or タップ でタッチ開始)","end":"\\C[2]タッチ完了!!\\C[0]\\n所要時間: %1秒 (ミス%2回 × %3秒)", "timeup":"\\C[2]時間切れ!!\\C[0]\\n成功タッチ: %1回 (ミス%2回 × %3秒)"}
 * 
 * @param penalty
 * @type number
 * @desc ミスタッチのペナルティ時間 (ミリ秒)
 * 初期値: 1000
 * @default 1000
 * 
 * @param vnResultTime
 * @type variable
 * @desc 結果（所要時間）を代入するゲーム変数
 * 初期値: 1
 * @default 1
 * 
 * @param vnResultSuccess
 * @type variable
 * @desc 結果（成功タッチ）を代入するゲーム変数
 * 初期値: 2
 * @default 2
 * 
 * @param seTouchSuccess
 * @type struct<SoundEffect>
 * @desc 成功タッチの効果音
 * @default {"name":"Item3","volume":"90","pitch":"150","pan":"0"}
 *
 * @param seTouchMiss
 * @type struct<SoundEffect>
 * @desc ミスタッチの効果音
 * @default {"name":"Buzzer2","volume":"90","pitch":"100","pan":"0"}
 *
 * @param seTouchStart
 * @type struct<SoundEffect>
 * @desc バニータッチ開始の効果音
 * @default {"name":"Magic3","volume":"90","pitch":"120","pan":"0"}
 *
 * @param seTouchEnd
 * @type struct<SoundEffect>
 * @desc バニータッチ終了の効果音
 * @default {"name":"Applause1","volume":"90","pitch":"100","pan":"0"}
 *
 * @param seTimeup
 * @type struct<SoundEffect>
 * @desc タイムアップの効果音
 * @default {"name":"Applause2","volume":"90","pitch":"80","pan":"0"}
 *
 * @help
 * TMPlugin - バニータッチ ver1.0.0
 *
 * 使い方:
 *
 *   イベントコマンド『プラグインコマンド』で startBunnyTouch を
 *   実行するとバニータッチゲームが起動します。
 * 
 *   バニータッチが終わると結果がゲーム変数に代入されます、
 *   この値で条件分岐させることで、結果に応じた処理が作れます。
 *   初期設定では1番に所要時間、2番に成功タッチ数が代入されます。
 *   時間切れの場合は所要時間に -1 が代入されます。
 * 
 *   BGMを再生する機能はありません、バニータッチ起動直前に
 *   イベントコマンドで好きなBGMを流してください。
 *
 *   このプラグインは RPGツクールMV Version 1.5.1 で動作確認をしています。
 * 
 *   このプラグインはMITライセンスのもとに配布しています、商用利用、
 *   改造、再配布など、自由にお使いいただけます。
 * 
 * 
 * プラグインコマンド:
 * 
 *   startBunnyTouch 5 3 2 10 1.0
 *     バニータッチを開始します。
 *     数値は順に バニーの数、列数、行数、制限時間、拡大率 となります。
 *     上記の例は、横3マス×縦2マスの場に5人のバニーさんが配置され、
 *     制限時間は10秒という設定になっています。
 *     制限時間に 0 を設定すると、制限時間がなくなります。
 * 
 *     場が狭く、画面の余白が広くなってしまう場合は、拡大率の値を
 *     大きく設定することで、場を拡大表示することができます。
 * 
 *     また、下記のようにオプション値を付けることもできます。
 *     startBunnyTouch 5 3 2 10 1.0 rm
 *     r = 数字が連続しなくなる
 *     m = 数字が左右反転する
 *     rm なら両方のオプションが有効になります。
 * 
 * 
 * プラグインパラメータ補足:
 * 
 *   helpTexts
 *     \C[n] や \} などの制御文字も利用できます、改行したい場合は
 *     \n で改行することができます。
 */
/*~struct~SoundEffect:
 *
 * @param name
 * @type file
 * @dir audio/se/
 * @desc 効果音のファイル名
 * @default 
 * @require 1
 *
 * @param volume
 * @type number
 * @max 100
 * @desc 効果音の音量
 * 初期値: 90
 * @default 90
 *
 * @param pitch
 * @type number
 * @min 50
 * @max 150
 * @desc 効果音のピッチ
 * 初期値: 100
 * @default 100
 *
 * @param pan
 * @type number
 * @min -100
 * @max 100
 * @desc 効果音の位相
 * 初期値: 0
 * @default 0
 *
 */
/*~struct~HelpText:
 *
 * @param prestart
 * @desc バニータッチ開始前に表示するヘルプテキスト
 *
 * @param end
 * @desc バニータッチ終了時に表示するヘルプテキスト
 * (%1 = 所要時間 / %2 = ミス回数 / %3 = ペナルティ秒数)
 *
 * @param timeup
 * @desc 時間切れの際に表示するヘルプテキスト
 * (%1 = 成功タッチ / %2 = ミス回数 / %3 = ペナルティ秒数)
 *
 */

var Imported = Imported || {};
Imported.TMBunnyTouch = true;

(function() {

  var parameters = PluginManager.parameters('TMBunnyTouch');
  var characterName = parameters['characterName'] || 'People2';
  var characterIndex = +(parameters['characterIndex'] || 7);
  var numberColor = parameters['numberColor'] || '#000000';
  var numberOutlineColor = parameters['numberOutlineColor'] || '#ffffff';
  var helpLines = +(parameters['helpLines'] || 2);
  var helpTexts = JSON.parse(parameters['helpTexts'] || "{}");
  var penalty = +(parameters['penalty'] || 1000);
  var vnResultTime = +(parameters['vnResultTime'] || 1);
  var vnResultSuccess = +(parameters['vnResultSuccess'] || 2);
  var seTouchSuccess = JSON.parse(parameters['seTouchSuccess'] || "{}");
  var seTouchMiss = JSON.parse(parameters['seTouchMiss'] || "{}");
  var seTouchStart = JSON.parse(parameters['seTouchStart'] || "{}");
  var seTouchEnd = JSON.parse(parameters['seTouchEnd'] || "{}");
  var seTimeup = JSON.parse(parameters['seTimeup'] || "{}");

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'startBunnyTouch') {
      SceneManager.push(Scene_BunnyTouch);
      SceneManager.prepareNextScene.apply(SceneManager, args);
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_BunnyTouch
  //

  function Window_BunnyTouch() {
    this.initialize.apply(this, arguments);
  }

  Window_BunnyTouch.prototype = Object.create(Window_Base.prototype);
  Window_BunnyTouch.prototype.constructor = Window_BunnyTouch;

  Window_BunnyTouch.prototype.initialize = function(cellWidth, cellHeight, scale) {
    var width = cellWidth * 48 * scale + this.standardPadding() * 2;
    var height = cellHeight * 48 * scale + this.standardPadding() * 2;
    var x = (Graphics.width - width) / 2;
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this.refresh();
  };

  Window_BunnyTouch.prototype.refresh = function() {
    this.contents.clear();
  };

  //-----------------------------------------------------------------------------
  // Window_BunnyTimer
  //

  function Window_BunnyTimer() {
    this.initialize.apply(this, arguments);
  }

  Window_BunnyTimer.prototype = Object.create(Window_Base.prototype);
  Window_BunnyTimer.prototype.constructor = Window_BunnyTimer;

  Window_BunnyTimer.prototype.initialize = function(timeLimit) {
    var width = this.windowWidth();
    var height = this.fittingHeight(1);
    var x = (Graphics.width - width) / 2;
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this._timeLimit = timeLimit;
    this._time = 0;
    this._stop = true;
    this.refresh();
  };

  Window_BunnyTimer.prototype.windowWidth = function() {
    return 240;
  };

  Window_BunnyTimer.prototype.setTimeupHandler = function(method) {
    this._timeupHandler = method;
  };

  Window_BunnyTimer.prototype.isTimeup = function() {
    return this._timeLimit && this._time >= this._timeLimit;
  };

  Window_BunnyTimer.prototype.refresh = function() {
    this.contents.clear();
    var n = this._timeLimit ? Math.max(this._timeLimit - this._time, 0) : this._time;
    this.drawText((n / 1000).toFixed(3) + " 秒", 0, 0, this.contents.width, 'right');
  };

  Window_BunnyTimer.prototype.start = function() {
    this._stop = false;
    this._startTime = Date.now();
  };

  Window_BunnyTimer.prototype.stop = function() {
    this._stop = true;
    return this._time;
  };

  Window_BunnyTimer.prototype.applyPenalty = function() {
    this._startTime -= penalty;
  };

  Window_BunnyTimer.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (!this._stop) {
      this._time = Date.now() - this._startTime;
      if (this.isTimeup()) this._timeupHandler();
    }
    if (Graphics.frameCount % 4 === 0) {
      this.refresh();
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_BunnyTouch
  //

  function Sprite_BunnyTouch() {
    this.initialize.apply(this, arguments);
  }

  Sprite_BunnyTouch.prototype = Object.create(Sprite.prototype);
  Sprite_BunnyTouch.prototype.constructor = Sprite_BunnyTouch;

  Sprite_BunnyTouch.prototype.initialize = function(id, scale, mirror) {
    Sprite.prototype.initialize.call(this);
    this._id = id;
    this._mirror = mirror;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.setBitmap();
    this.drawNumber();
    this._active = true;
    this._touching = false;
    this._effectType = 0;
    this._effectDuration = 0;
    this._baseX = 0;
    this._baseY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._baseScale = scale;
    this._offsetScale = 1;
    this.updateScale();
  };

  Sprite_BunnyTouch.prototype.setBitmap = function() {
    var bitmap = ImageManager.loadCharacter(characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (this._isBigCharacter ? 3 : 12);
    var ph = bitmap.height / (this._isBigCharacter ? 4 : 8);
    this.bitmap = new Bitmap(pw, ph);
    var sx = (this.characterBlockX() + 1) * pw;
    var sy = (this.characterBlockY() + 0) * ph;
    this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
  };

  Sprite_BunnyTouch.prototype.characterBlockX = function() {
    return this._isBigCharacter ? 0 : characterIndex % 4 * 3;
  };

  Sprite_BunnyTouch.prototype.characterBlockY = function() {
    return this._isBigCharacter ? 0 : Math.floor(characterIndex / 4) * 4;
  };

  Sprite_BunnyTouch.prototype.drawNumber = function() {
    this.bitmap.textColor = numberColor;
    this.bitmap.outlineWidth = 8;
    this.bitmap.outlineColor = numberOutlineColor;
    this.bitmap.drawText(this._id, 0, 0, this.bitmap.width, this.bitmap.height, 'center');
  };

  Sprite_BunnyTouch.prototype.setBasePosition = function(x, y) {
    this._baseX = x;
    this._baseY = y;
    this.updatePosition();
  };

  Sprite_BunnyTouch.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updatePosition();
    this.updateScale();
    this.processTouch();
    this.updateEffect();
  };

  Sprite_BunnyTouch.prototype.updatePosition = function() {
    this.x = this._baseX + this._offsetX;
    this.y = this._baseY + this._offsetY;
  };

  Sprite_BunnyTouch.prototype.updateScale = function() {
    this.scale.y = this._baseScale * this._offsetScale;
    this.scale.x = this._mirror ? 0 - this.scale.y : this.scale.y;
  };

  Sprite_BunnyTouch.prototype.updateEffect = function() {
    if (this._effectDuration > 0) {
      this._effectDuration--;
      if (this._effectType === 1) {
        this.opacity -= 16;
        this._offsetScale += 0.03;
      } else if (this._effectType === 2) {
        if (this._effectDuration === 0) {
          this._offsetX = 0;
        } else {
          this._offsetX = Math.sin(this._effectDuration) * 8;
        }
      }
    }
  };

  Sprite_BunnyTouch.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
  };

  Sprite_BunnyTouch.prototype.callClickHandler = function() {
    if (this._clickHandler) {
      var result = this._clickHandler();
      if (result === 'success') {
        this.processSuccess();
      } else if (result === 'miss') {
        this.processMiss();
      }
    }
  };

  Sprite_BunnyTouch.prototype.processSuccess = function() {
    AudioManager.playSe(seTouchSuccess);
    this._effectType = 1;
    this._effectDuration = 16;
    this._offsetScale = 0.75;
    this._active = false;
  };

  Sprite_BunnyTouch.prototype.processMiss = function() {
    AudioManager.playSe(seTouchMiss);
    this._effectType = 2;
    this._effectDuration = 16;
  };
  
  Sprite_BunnyTouch.prototype.processTouch = function() {
    if (this._active) {
      if (TouchInput.isTriggered() && this.isTouched()) {
        this._touching = true;
      }
      if (this._touching) {
        if (TouchInput.isReleased() || !this.isTouched()) {
          this._touching = false;
          if (TouchInput.isReleased()) this.callClickHandler();
        }
      }
    } else {
      this._touching = false;
    }
  };

  Sprite_BunnyTouch.prototype.isTouched = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var w = this.width / 2 * this._baseScale;
    var h = this.height / 2 * this._baseScale;
    return x >= -w && y >= -h && x < w && y < h;
  };

  Sprite_BunnyTouch.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
      x -= node.x;
      node = node.parent;
    }
    return x;
  };

  Sprite_BunnyTouch.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
      y -= node.y;
      node = node.parent;
    }
    return y;
  };

  //-----------------------------------------------------------------------------
  // Scene_BunnyTouch
  //

  function Scene_BunnyTouch() {
    this.initialize.apply(this, arguments);
  }

  Scene_BunnyTouch.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_BunnyTouch.prototype.constructor = Scene_BunnyTouch;

  Scene_BunnyTouch.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    ImageManager.reserveCharacter('People2');
    this._sceneState = 0;
    this._waitCount = 0;
    this._missCount = 0;
    this._successCount = 0;
  };

  Scene_BunnyTouch.prototype.prepare = function(num, w, h, time, scale, options) {
    this._bunnyNum = +(num || 5);
    this._cellWidth = +(w || 3);
    this._cellHeight = +(h || 3);
    this._timeLimit = +(time || 0) * 1000;
    this._scale = +(scale || 1);
    this._random = options && options.indexOf('r') >= 0;
    this._mirror = options && options.indexOf('m') >= 0;
  };

  Scene_BunnyTouch.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createTimerWindow();
    this.createBunnyWindow();
    this.createHelpWindow(helpLines);
    this._helpWindow.setText(helpTexts.prestart.replace(/\\n/g, '\n'));
    this._helpWindow.openness = 0;
    this._helpWindow.open();
    this.setWindowPosition();
  };

  Scene_BunnyTouch.prototype.createTimerWindow = function() {
    this._timerWindow = new Window_BunnyTimer(this._timeLimit);
    this._timerWindow.setTimeupHandler(this.processEnd.bind(this));
    this.addWindow(this._timerWindow);
  };

  Scene_BunnyTouch.prototype.createBunnyWindow = function() {
    this._bunnyWindow = new Window_BunnyTouch(this._cellWidth, this._cellHeight, this._scale);
    this.addWindow(this._bunnyWindow);
  };

  Scene_BunnyTouch.prototype.setWindowPosition = function() {
    this._helpWindow.y = (Graphics.height - this._helpWindow.height) / 2;
    var wy = (Graphics.height - this._bunnyWindow.height) / 2;
    this._bunnyWindow.y = Math.max(wy, this._timerWindow.height);
    this._timerWindow.y = this._bunnyWindow.y - this._timerWindow.height;
  };

  Scene_BunnyTouch.prototype.createBunnySprites = function() {
    var ids = this.spriteIds();
    this._bunnySprites = [];
    for (var i = 0; i < this._bunnyNum; i++) {
      var sprite = new Sprite_BunnyTouch(ids[i], this._scale, this._mirror);
      sprite.setClickHandler(this.processMiss.bind(this));
      this._bunnySprites.unshift(sprite);
      this._bunnyWindow.addChild(sprite);
    }
    this.setSpritePosition();
    this.setNextTarget();
  };

  Scene_BunnyTouch.prototype.spriteIds = function() {
    var result = [];
    var n = 1;
    for (var i = 0; i < this._bunnyNum; i++) {
      result.unshift(n++);
      if (this._random) n += Math.randomInt(Math.randomInt(10) + 1);
    }
    return result;
  };

  Scene_BunnyTouch.prototype.setSpritePosition = function() {
    var points = [];
    for (var i = 0; i < this._cellWidth * this._cellHeight; i++) {
      points.push(i);
    }
    var len = points.length;
    var w = 48 * this._scale;
    var padding = this._bunnyWindow.standardPadding();
    for (var i = 0; i < this._bunnySprites.length; i++) {
      var r = Math.floor(Math.random() * len);
      var x = (points[r] % this._cellWidth) * w + w / 2;
      var y = Math.floor(points[r] / this._cellWidth) * w + w / 2;
      this._bunnySprites[i].setBasePosition(x + padding, y + padding);
      len--;
      points[r] = points[len];
    }
  };

  Scene_BunnyTouch.prototype.processSuccess = function() {
    if (this._sceneState !== 1) return;
    this._successCount++;
    this.setNextTarget();
    return 'success';
  };

  Scene_BunnyTouch.prototype.setNextTarget = function() {
    this._targetSprite = this._bunnySprites.shift();
    if (this._targetSprite) {
      this._targetSprite.setClickHandler(this.processSuccess.bind(this));
    } else {
      this.processEnd();
    }
  };

  Scene_BunnyTouch.prototype.processMiss = function() {
    if (this._sceneState !== 1) return;
    this._missCount++;
    this._timerWindow.applyPenalty();
    return 'miss';
  };

  Scene_BunnyTouch.prototype.processEnd = function() {
    $gameVariables.setValue(vnResultSuccess, this._successCount);
    this._resultTime = this._timerWindow.stop();
    if (this._timerWindow.isTimeup()) {
      AudioManager.playSe(seTimeup);
      $gameVariables.setValue(vnResultTime, -1);
      var text = helpTexts.timeup;
      var n = this._successCount;
    } else {
      AudioManager.playSe(seTouchEnd);
      $gameVariables.setValue(vnResultTime, this._resultTime);
      var text = helpTexts.end;
      var n = (this._resultTime / 1000).toFixed(3);
    }
    this._helpWindow.setText(text.replace(/\\n/g, '\n').format(n, this._missCount,
                             (penalty / 1000).toFixed(3)));
    this._helpWindow.open();
    this._sceneState = 2;
    this._waitCount = 0;
  };

  Scene_BunnyTouch.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    if (this._sceneState === 0) {
      this.updatePrestart();
    } else if (this._sceneState === 2) {
      this.updateEnding();
    }
  };

  Scene_BunnyTouch.prototype.updatePrestart = function() {
    if (TouchInput.isTriggered()) {
      AudioManager.playSe(seTouchStart);
      this._helpWindow.close();
      this.createBunnySprites();
      this._timerWindow.start();
      this._sceneState = 1;
    }
  }

  Scene_BunnyTouch.prototype.updateEnding = function() {
    this._waitCount++;
    if (this._waitCount >= 60) {
      if (TouchInput.isTriggered()) this.popScene();
    }
  }
  
})();