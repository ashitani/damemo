'use strict';
import * as vscode from 'vscode';

function getDateText(mode: number): string {
    // ファイル名などに使う日付テキストを返す
    var date = new Date();
    var date_txt: string;

    if (mode == 0) {
        date_txt = date.getFullYear() +
            ("0" + date.getMonth()).slice(-2) +
            ("0" + date.getDate()).slice(-2);
    } else {
        date_txt = date.getFullYear() + "/" +
            ("0" + date.getMonth()).slice(-2) + "/" +
            ("0" + date.getDate()).slice(-2);
    }
    return date_txt;
}

export function activate(context: vscode.ExtensionContext) {

    console.log('"damemo" is now active.');
    var memo_name: string = "";
    var filepath: string = "";

    // ファイルが開いたら表示するイベント
    const openedEvent = vscode.workspace.onDidOpenTextDocument(
        (document: vscode.TextDocument) => {
            if (document.fileName == filepath) {

                var editor = vscode.window.activeTextEditor;
                vscode.window.showTextDocument(document, editor).then(
                    e => {
                        var len = e.document.getText().length;
                        if (len == 0) {
                            // 冒頭にメモ名を記述する。
                            var memo_text = "<!-- " + getDateText(1) + " " + memo_name + " -->\n\n"
                            e.edit(edit => {
                                edit.insert(new vscode.Position(0, 0), memo_text);
                            });
                        }
                    });
            }
        });

    // コマンド起動
    let disposable = vscode.commands.registerCommand('extension.createMemo', () => {

        // 設定読み込み        
        const config = vscode.workspace.getConfiguration('damemo');
        const rootpath: string = config.get<string>('rootpath');

        //        vscode.window.showInformationMessage(rootpath);

        // ドキュメントの名前を入力させる
        vscode.window.showInputBox({ prompt: 'Memo Name?' })
            .then(
            val => {
                memo_name = val;

                // 新しいドキュメントを作成する
                var date_txt_org = getDateText(0);
                filepath = rootpath + "/" + date_txt_org + "_" + val + ".md";
                var uri = vscode.Uri.parse("untitled://" + filepath);
                var doc = vscode.workspace.openTextDocument(uri);

            });
        context.subscriptions.push(openedEvent);
    });


    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}