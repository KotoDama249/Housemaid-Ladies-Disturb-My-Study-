//=============================================================================
// MPP_Patch.js
//=============================================================================

/*:
 * @plugindesc 【2017/12/17】不具合修正プラグイン
 * @author 木星ペンギン
 *
 * @help 1.ダメージスプライトの更新が２度行われている不具合の修正
 * 2.画面スクロール中、マップとキャラクターの同期がとれていない不具合の修正
 * 3.サイドビュー戦闘でアクターがステートの変化によって、
 *   防御中が解除されない不具合の修正
 * 4.[文章の表示]などで改行時に行の高さの計算が間違っている不具合の修正
 * 5.グラフィックが設定されていないイベントの基準パターンを1番に変更
 * 6.[文章の表示]でウェイト中にもスキップが行える機能の追加と
 *   スキップ中はウェイトをしない機能の追加
 * 7.モバイルデバイスで色調変更やブレンドする色を変更した際、
 *   極端に処理が重くなる仕様への対処
 * 8.一部のカーソルを非表示にする処理で、カーソルSEが鳴らないように修正
 * 9.移動ルートの実行を可能な限り１フレーム以内に行うように修正
 * 10.[選択肢の表示]で文字の大きさを変更した際、
 *    次の項目の位置がずれる不具合の修正
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Patch1 enabled?
 * @type boolean
 * @desc 修正内容1番の有効/無効
 * @default true
 * 
 * @param Patch2 enabled?
 * @type boolean
 * @desc 修正内容2番の有効/無効
 * @default true
 * 
 * @param Patch3 enabled?
 * @type boolean
 * @desc 修正内容3番の有効/無効
 * @default true
 * 
 * @param Patch4 enabled?
 * @type boolean
 * @desc 修正内容4番の有効/無効
 * @default true
 * 
 * @param Patch5 enabled?
 * @type boolean
 * @desc 修正内容5番の有効/無効
 * @default true
 * 
 * @param Patch6 enabled?
 * @type boolean
 * @desc 修正内容6番の有効/無効
 * @default true
 * 
 * @param Patch7 enabled?
 * @type boolean
 * @desc 修正内容7番の有効/無効
 * @default true
 * 
 * @param Patch8 enabled?
 * @type boolean
 * @desc 修正内容8番の有効/無効
 * @default true
 * 
 * @param Patch9 enabled?
 * @type boolean
 * @desc 修正内容9番の有効/無効
 * @default true
 * 
 * @param Patch10 enabled?
 * @type boolean
 * @desc 修正内容10番の有効/無効
 * @default true
 * 
 */

(function() {

var parameters = PluginManager.parameters('MPP_Patch');
var MPPlugin = {
    patch1enabled:!!eval(parameters['Patch1 enabled?']),
    patch2enabled:!!eval(parameters['Patch2 enabled?']),
    patch3enabled:!!eval(parameters['Patch3 enabled?']),
    patch4enabled:!!eval(parameters['Patch4 enabled?']),
    patch5enabled:!!eval(parameters['Patch5 enabled?']),
    patch6enabled:!!eval(parameters['Patch6 enabled?']),
    patch7enabled:!!eval(parameters['Patch7 enabled?']),
    patch8enabled:!!eval(parameters['Patch8 enabled?']),
    patch9enabled:!!eval(parameters['Patch9 enabled?']),
    patch10enabled:!!eval(parameters['Patch10 enabled?']),
};

var Alias = {};

// 1.ダメージスプライトの更新が２度行われている不具合の修正
if (MPPlugin.patch1enabled) {
Sprite_Battler.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
//        for (var i = 0; i < this._damages.length; i++) {
//            this._damages[i].update();
//        }
        if (!this._damages[0].isPlaying()) {
            this.parent.removeChild(this._damages[0]);
            this._damages.shift();
        }
    }
};
}

// 2.画面スクロール中、タイルマップとキャラクターの座標が同期できていない不具合の修正
if (MPPlugin.patch2enabled) {
Spriteset_Map.prototype.updateTilemap = function() {
    this._tilemap.origin.x = Math.round($gameMap.displayX() * $gameMap.tileWidth());
    this._tilemap.origin.y = Math.round($gameMap.displayY() * $gameMap.tileHeight());
};
}

// 3.サイドビュー戦闘でアクターがステートの変化によって、
//   防御中が解除されない不具合の修正
if (MPPlugin.patch3enabled) {

Alias.GaBa_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    Alias.GaBa_initMembers.call(this);
    this._forceMotionRefresh = false;
};

Game_Battler.prototype.requestForceMotionRefresh = function() {
    this.requestMotionRefresh();
    this._forceMotionRefresh = true;
};

Alias.WiBaLo_displayAffectedStatus = Window_BattleLog.prototype.displayAffectedStatus;
Window_BattleLog.prototype.displayAffectedStatus = function(target) {
    Alias.WiBaLo_displayAffectedStatus.call(this, target);
    if (target.result().isStatusAffected() && !target.motionType()) {
        this.push('requestForceMotionRefresh', target);
    }
};

Window_BattleLog.prototype.requestForceMotionRefresh = function(target) {
    target.requestForceMotionRefresh();
};

Alias.SpAc_refreshMotion = Sprite_Actor.prototype.refreshMotion;
Sprite_Actor.prototype.refreshMotion = function() {
    var actor = this._actor;
    if (actor) {
        if (actor._forceMotionRefresh) {
            this._motion = null;
            actor._forceMotionRefresh = false;
        }
    }
    Alias.SpAc_refreshMotion.call(this);
};

}

// 4.[文章の表示]などで改行時に行の高さの計算が間違っている不具合の修正
if (MPPlugin.patch4enabled) {
Window_Base.prototype.processNewLine = function(textState) {
    textState.x = textState.left;
    textState.y += textState.height;
    textState.index++;
    textState.height = this.calcTextHeight(textState, false);
};
}

// 5.グラフィックが設定されていないイベントの基準パターンを1番に変更
if (MPPlugin.patch5enabled) {
Alias.GaEv_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
    Alias.GaEv_setupPageSettings.call(this);
    if (this._tileId === 0 && !this._characterName) {
        this._originalPattern = 1;
        this.setPattern(1);
    }
};
}

// 6.[文章の表示]でウェイト中にもスキップが行える機能の追加と
//   スキップ中はウェイトをしない機能の追加
if (MPPlugin.patch6enabled) {
//125
Alias.WiMe_updateWait = Window_Message.prototype.updateWait;
Window_Message.prototype.updateWait = function() {
    if (!Alias.WiMe_updateWait.call(this)) return false;
    this.updateShowFast();
    return !this._showFast;
};

//291
Alias.WiMe_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case '.':
        if (!this._showFast) this.startWait(15);
        break;
    case '|':
        if (!this._showFast) this.startWait(60);
        break;
    default:
        Alias.WiMe_processEscapeCharacter.call(this, code, textState);
        break;
    }
};
}

// 7.アニメーション処理の軽量化
if (MPPlugin.patch7enabled) {
//76
Alias.SpPi_updateTone = Sprite_Picture.prototype.updateTone;
Sprite_Picture.prototype.updateTone = function() {
    if (Utils.isMobileDevice()) {
        var picture = this.picture();
        if (picture.tone()) {
            if (Graphics.frameCount % 4 === 0) this.setColorTone(picture.tone());
        } else {
            this.setColorTone([0, 0, 0, 0]);
        }
    } else {
        Alias.SpPi_updateTone.call(this);
    }
};

//214
Alias.SpEn_updateWhiten = Sprite_Enemy.prototype.updateWhiten;
Sprite_Enemy.prototype.updateWhiten = function() {
    if (Utils.isMobileDevice()) {
        var alpha = 128 - Math.ceil((16 - this._effectDuration) / 4) * 40;
        this.setBlendColor([255, 255, 255, alpha]);
    } else {
        Alias.SpEn_updateWhiten.call(this);
    }
};

//237
Alias.SpEn_updateBossCollapse = Sprite_Enemy.prototype.updateBossCollapse;
Sprite_Enemy.prototype.updateBossCollapse = function() {
    if (Utils.isMobileDevice()) {
        this._shake = this._effectDuration % 2 * 4 - 2;
        this.blendMode = Graphics.BLEND_ADD;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        if (this._effectDuration % 4 === 0) {
            this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        }
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    } else {
        Alias.SpEn_updateBossCollapse.call(this);
    }
};

//80
Alias.SpAn_updateFlash = Sprite_Animation.prototype.updateFlash;
Sprite_Animation.prototype.updateFlash = function() {
    if (Utils.isMobileDevice()) {
        if (this._flashDuration > 0) {
            var d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            if (d % this._rate === 0 || this._flashDuration === 0) {
                this._target.setBlendColor(this._flashColor);
            }
        }
    } else {
        Alias.SpAn_updateFlash.call(this);
    }
};

//93
Alias.SpDa_updateChild = Sprite_Damage.prototype.updateChild;
Sprite_Damage.prototype.updateChild = function(sprite) {
    if (Utils.isMobileDevice()) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        if (Graphics.frameCount % 4 === 0) {
            sprite.setBlendColor(this._flashColor);
        }
    } else {
        Alias.SpDa_updateChild.call(this, sprite);
    }
};
}


// 8.不自然なカーソルSEへの対処
if (MPPlugin.patch8enabled) {
//368
Window_Selectable.prototype.onTouch = function(triggered) {
    var lastIndex = this.index();
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x, y);
    if (hitIndex >= 0) {
        if (hitIndex === this.index()) {
            if (triggered && this.isTouchOkEnabled()) {
                this.processOk();
                return; // カーソルSEが鳴らないように処理終了
            }
        } else if (this.isCursorMovable()) {
            this.select(hitIndex);
        }
    } else if (this._stayCount >= 10) {
        if (y < this.padding) {
            this.cursorUp();
        } else if (y >= this.height - this.padding) {
            this.cursorDown();
        }
    }
    if (this.index() !== lastIndex) {
        SoundManager.playCursor();
    }
};
}

// 9.移動ルートの実行を可能な限り１フレーム以内に行うように修正
if (MPPlugin.patch9enabled) {
//112
Alias.GaCh_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        if (this._waitCount > 0) {
            return;
        }
    }
    Alias.GaCh_updateRoutineMove.call(this);
    if (this._moveRouteForcing && this.isMovementSucceeded() &&
            this.isStopping() && this._waitCount === 0 &&
            this._moveRouteIndex >= 0) {
        this.updateRoutineMove();
    }
};

//125
Alias.GaCh_processMoveCommand = Game_Character.prototype.processMoveCommand;
Game_Character.prototype.processMoveCommand = function(command) {
    if (command.code === Game_Character.ROUTE_WAIT) {
        this._waitCount = command.parameters[0];
        return;
    }
    Alias.GaCh_processMoveCommand.call(this, command);
};
}

// 10.[選択肢の表示]で文字の大きさを変更した際、次の項目の位置がずれる不具合の修正
if (MPPlugin.patch10enabled) {
//110
Alias.WiChLi_drawItem = Window_ChoiceList.prototype.drawItem;
Window_ChoiceList.prototype.drawItem = function(index) {
    this.resetFontSettings();
    Alias.WiChLi_drawItem.call(this, index);
};
}





})();
