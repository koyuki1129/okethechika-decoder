// ========================================
// おけてちか解読ツール
// 解読データ管理プログラム
// ========================================

// 篇は20種類
const HEN_COUNT = 20;

// 旁は70種類
const TSUKURI_COUNT = 70;


// ========================================
// 解読データ
// ========================================
//
// 形式：
// "篇番号-旁番号": "現代語の文字"
//
// 例：
// "1-1": "あ"
// なら「篇1＋旁1」は「あ」を意味する。
//

let dictionary = {};


// ========================================
// 篇・旁のIDを作る
// ========================================

function makeKey(hen, tsukuri) {
    return `${hen}-${tsukuri}`;
}


// ========================================
// 解読結果を登録する
// ========================================

function addTranslation(hen, tsukuri, translation) {
    const key = makeKey(hen, tsukuri);

    // 篇・旁の番号が正しいか確認
    if (hen < 1 || hen > HEN_COUNT) {
        throw new Error("篇の番号は1〜20で指定してください。");
    }

    if (tsukuri < 1 || tsukuri > TSUKURI_COUNT) {
        throw new Error("旁の番号は1〜70で指定してください。");
    }

    if (!translation || translation.trim() === "") {
        throw new Error("訳を入力してください。");
    }

    dictionary[key] = translation.trim();

    saveDictionary();
}


// ========================================
// 登録されている訳を取得する
// ========================================

function getTranslation(hen, tsukuri) {
    const key = makeKey(hen, tsukuri);

    return dictionary[key] || null;
}


// ========================================
// 登録済みか確認する
// ========================================

function hasTranslation(hen, tsukuri) {
    return getTranslation(hen, tsukuri) !== null;
}


// ========================================
// 未解読文字を現代語に変換する
// ========================================
//
// 例：
//
// [
//     { hen: 1, tsukuri: 3 },
//     { hen: 4, tsukuri: 12 },
//     { hen: 2, tsukuri: 8 }
// ]
//
// ↓
//
// "あいう"
//

function translateCharacters(characters) {
    return characters.map(character => {

        const translation = getTranslation(
            character.hen,
            character.tsukuri
        );

        // まだ解読されていない文字
        if (translation === null) {
            return "□";
        }

        return translation;

    }).join("");
}


// ========================================
// データをブラウザに保存
// ========================================

function saveDictionary() {
    localStorage.setItem(
        "okethechika_dictionary",
        JSON.stringify(dictionary)
    );
}


// ========================================
// 保存されているデータを読み込む
// ========================================

function loadDictionary() {

    const savedData =
        localStorage.getItem("okethechika_dictionary");

    if (savedData) {

        try {
            dictionary = JSON.parse(savedData);

        } catch (error) {

            console.error(
                "解読データの読み込みに失敗しました。",
                error
            );

            dictionary = {};
        }
    }
}


// ========================================
// 解読データをJSONとして書き出す
// ========================================

function exportDictionary() {

    const data = JSON.stringify(
        dictionary,
        null,
        2
    );

    return data;
}


// ========================================
// JSONから解読データを読み込む
// ========================================

function importDictionary(jsonData) {

    try {

        const importedData =
            JSON.parse(jsonData);

        if (
            typeof importedData !== "object" ||
            importedData === null ||
            Array.isArray(importedData)
        ) {
            throw new Error(
                "正しい解読データではありません。"
            );
        }

        dictionary = importedData;

        saveDictionary();

        return true;

    } catch (error) {

        console.error(
            "解読データの読み込みに失敗しました。",
            error
        );

        return false;
    }
}


// ========================================
// 登録されている文字数を取得
// ========================================

function getDictionaryCount() {
    return Object.keys(dictionary).length;
}


// ========================================
// 現在の解読データを取得
// ========================================

function getDictionary() {
    return { ...dictionary };
}


// ========================================
// 起動時に保存データを読み込む
// ========================================

loadDictionary();


// ========================================
// 開発用テスト
// ========================================
//
// 以下は仕組みの確認用。
// 後で削除してもOK。
//

// addTranslation(1, 1, "あ");

// console.log(
//     getTranslation(1, 1)
// );

// console.log(
//     getDictionaryCount()
// );
