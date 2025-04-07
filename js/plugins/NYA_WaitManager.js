//=============================================================================
// NYA_WaitManager.js
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/03 初版
//=============================================================================
 
/*:
 * @plugindesc v1.0.0 ウェイトを制御するプラグイン
 * @author にゃたま
 * @help
 * 概要:
 * ツクール標準のウェイトを制御するプラグインです。
 *
 *
 * プラグインコマンド:
 *   NYA_WaitManager add 10          # ウェイトを指定秒数増加させる
 *   NYA_WaitManager sub 10          # ウェイトを指定秒数減少させる
 *   NYA_WaitManager stop            # ウェイトを停止させる
 *   NYA_WaitManager restart         # ウェイトを再開させる
 * 
 * ※このプラグインでは、以下を書き換えていますので、本体アップデートや競合に注意してください。
 *    Game_Interpreter.prototype.updateWaitCount
 *
 * プラグインコマンド:
 *   ありません
 * 
 * 
 * ライセンス:
 * このプラグインは以下のライセンスのもと、使用することができます。 
 *   Copyright (c) 2016 nyatama
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 */

(function() {

    var pluginName = 'NYA_WaitManager';
    var parameters = PluginManager.parameters(pluginName);
    var _waitStop = false;
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toUpperCase() === 'NYA_WAITMANAGER') {
            switch (args[0].toLocaleUpperCase()) {
            case 'ADD':
                this.addCounts(eval(args[1]));
                break;
            case 'SUB':
                this.subCounts(eval(args[1]));
                break;
            case 'STOP':
                this.stop();
                break;
            case 'RESTART':
                this.start();
                break;
            }
        }
    };
    
    Game_Interpreter.prototype.updateWaitCount = function() {
        if (this._waitCount > 0) {
            if(!_waitStop){
                this._waitCount--;
                //console.log("waitCount:"+this._waitCount);
            }
            return true;
        }
        return false;
    };
    
    // Game_Interpreter に addCounts を追加
    Game_Interpreter.prototype.addCounts = function(count) {
        this._waitCount += count;
    };

    // Game_Interpreter に subCounts を追加
    Game_Interpreter.prototype.subCounts = function(count) {
        this._waitCount -= count;
        if (this._waitCount < 0) {
            this._waitCount = 0;
        }
    };
    
     // Game_Interpreter に stop を追加
    Game_Interpreter.prototype.stop = function() {
        _waitStop = true;
    };

    // Game_Interpreter に start を追加
    Game_Interpreter.prototype.start = function() {
        _waitStop = false;
    };

})();