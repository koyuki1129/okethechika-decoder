/* ======================================
   おけてちか解読ツール
   ====================================== */


/* ======================================
   保存場所
   ====================================== */

const dictionaryKey =
  "oketechika_dictionary";


/* ======================================
   篇・旁
   ====================================== */

const henCount = 20;
const bouCount = 70;


/* ======================================
   現在選択されている篇・旁
   ====================================== */

let selectedHen = "";
let selectedBou = "";


/* ======================================
   文章
   ====================================== */

let sentenceCharacters = [];


/* ======================================
   辞書を読み込む
   ====================================== */

function loadDictionary() {

  const saved =
    localStorage.getItem(dictionaryKey);

  if (!saved) {
    return {};
  }

  try {

    return JSON.parse(saved);

  } catch (error) {

    console.error(error);

    return {};
  }
}


/* ======================================
   辞書を保存する
   ====================================== */

function saveDictionary(dictionary) {

  localStorage.setItem(
    dictionaryKey,
    JSON.stringify(dictionary)
  );
}


/* ======================================
   組み合わせのキー
   ====================================== */

function makeKey(hen, bou) {

  return hen + ":" + bou;
}


/* ======================================
   画像ファイル名
   ====================================== */

function henImage(number) {

  return "images/hen" +
    String(number).padStart(2, "0") +
    ".jpg";
}


function bouImage(number) {

  return "images/bou" +
    String(number).padStart(2, "0") +
    ".jpg";
}


/* ======================================
   篇画像を作る
   ====================================== */

function createHenGrid() {

  const container =
    document.getElementById("henGrid");

  for (let i = 1; i <= henCount; i++) {

    const button =
      document.createElement("button");

    button.className =
      "image-button";

    button.type = "button";


    const image =
      document.createElement("img");

    image.src =
      henImage(i);

    image.alt =
      "篇 " + i;


    const number =
      document.createElement("div");

    number.className =
      "image-number";

    number.textContent =
      "篇 " + i;


    button.appendChild(image);

    button.appendChild(number);


    button.addEventListener(
      "click",
      function() {

        selectedHen =
          String(i);

        updateSelectedImages();

        updateHenSelection();

      }
    );


    container.appendChild(button);
  }
}


/* ======================================
   旁画像を作る
   ====================================== */

function createBouGrid() {

  const container =
    document.getElementById("bouGrid");

  for (let i = 1; i <= bouCount; i++) {

    const button =
      document.createElement("button");

    button.className =
      "image-button";

    button.type = "button";


    const image =
      document.createElement("img");

    image.src =
      bouImage(i);

    image.alt =
      "旁 " + i;


    const number =
      document.createElement("div");

    number.className =
      "image-number";

    number.textContent =
      "旁 " + i;


    button.appendChild(image);

    button.appendChild(number);


    button.addEventListener(
      "click",
      function() {

        selectedBou =
          String(i);

        updateSelectedImages();

        updateBouSelection();

      }
    );


    container.appendChild(button);
  }
}


/* ======================================
   選択中の画像を表示
   ====================================== */

function updateSelectedImages() {

  const henArea =
    document.getElementById("selectedHen");

  const bouArea =
    document.getElementById("selectedBou");


  henArea.innerHTML = "";

  bouArea.innerHTML = "";


  if (selectedHen) {

    const image =
      document.createElement("img");

    image.src =
      henImage(selectedHen);

    henArea.appendChild(image);

  } else {

    henArea.textContent =
      "まだ選択されていません";
  }


  if (selectedBou) {

    const image =
      document.createElement("img");

    image.src =
      bouImage(selectedBou);

    bouArea.appendChild(image);

  } else {

    bouArea.textContent =
      "まだ選択されていません";
  }
}


/* ======================================
   篇の選択状態
   ====================================== */

function updateHenSelection() {

  const buttons =
    document.querySelectorAll(
      "#henGrid .image-button"
    );


  buttons.forEach(
    function(button, index) {

      const number =
        String(index + 1);

      button.classList.toggle(
        "selected",
        number === selectedHen
      );

    }
  );
}


/* ======================================
   旁の選択状態
   ====================================== */

function updateBouSelection() {

  const buttons =
    document.querySelectorAll(
      "#bouGrid .image-button"
    );


  buttons.forEach(
    function(button, index) {

      const number =
        String(index + 1);

      button.classList.toggle(
        "selected",
        number === selectedBou
      );

    }
  );
}


/* ======================================
   セレクトボックス
   ====================================== */

function setupSelect(
  selectId,
  count,
  label
) {

  const select =
    document.getElementById(selectId);


  for (let i = 1; i <= count; i++) {

    const option =
      document.createElement("option");

    option.value =
      String(i);

    option.textContent =
      label + i;

    select.appendChild(option);
  }
}


/* ======================================
   登録
   ====================================== */

document
  .getElementById("registerButton")
  .addEventListener(
    "click",
    function() {

      if (!selectedHen) {

        document.getElementById(
          "registerResult"
        ).textContent =
          "篇を選択してください。";

        return;
      }


      if (!selectedBou) {

        document.getElementById(
          "registerResult"
        ).textContent =
          "旁を選択してください。";

        return;
      }


      const translation =
        document
          .getElementById("translation")
          .value
          .trim();


      if (!translation) {

        document.getElementById(
          "registerResult"
        ).textContent =
          "対応する日本語を入力してください。";

        return;
      }


      const dictionary =
        loadDictionary();


      const key =
        makeKey(
          selectedHen,
          selectedBou
        );


      dictionary[key] =
        translation;


      saveDictionary(dictionary);


      document.getElementById(
        "registerResult"
      ).textContent =
        "登録しました！\n" +
        "篇 " + selectedHen +
        " ＋ 旁 " + selectedBou +
        " → " + translation;


      document.getElementById(
        "translation"
      ).value = "";


      updateDictionaryList();

    }
  );


/* ======================================
   検索
   ====================================== */

document
  .getElementById("searchButton")
  .addEventListener(
    "click",
    function() {

      const hen =
        document.getElementById(
          "searchHen"
        ).value;


      const bou =
        document.getElementById(
          "searchBou"
        ).value;


      const result =
        document.getElementById(
          "searchResult"
        );


      if (!hen || !bou) {

        result.textContent =
          "篇と旁を選択してください。";

        return;
      }


      const dictionary =
        loadDictionary();


      const key =
        makeKey(hen, bou);


      if (dictionary[key]) {

        result.textContent =
          "対応する日本語： " +
          dictionary[key];

      } else {

        result.textContent =
          "まだ登録されていません。";
      }

    }
  );


/* ======================================
   文章に文字を追加
   ====================================== */

document
  .getElementById("addCharacterButton")
  .addEventListener(
    "click",
    function() {

      const hen =
        document.getElementById(
          "sentenceHen"
        ).value;


      const bou =
        document.getElementById(
          "sentenceBou"
        ).value;


      if (!hen || !bou) {

        alert(
          "篇と旁を選択してください。"
        );

        return;
      }


      sentenceCharacters.push({

        hen: hen,

        bou: bou

      });


      updateSentence();

    }
  );


/* ======================================
   空白を追加
   ====================================== */

document
  .getElementById("addSpaceButton")
  .addEventListener(
    "click",
    function() {

      sentenceCharacters.push({
        space: true
      });

      updateSentence();

    }
  );


/* ======================================
   文章をクリア
   ====================================== */

document
  .getElementById("clearSentenceButton")
  .addEventListener(
    "click",
    function() {

      sentenceCharacters = [];

      updateSentence();

    }
  );


/* ======================================
   文章を表示
   ====================================== */

function updateSentence() {

  const area =
    document.getElementById(
      "sentenceArea"
    );


  const decoded =
    document.getElementById(
      "decodedSentence"
    );


  const details =
    document.getElementById(
      "sentenceDetails"
    );


  area.innerHTML = "";

  details.innerHTML = "";


  const dictionary =
    loadDictionary();


  let decodedText = "";


  if (sentenceCharacters.length === 0) {

    area.textContent =
      "まだ文字がありません。";

    decoded.textContent =
      "まだ文字がありません。";

    return;
  }


  sentenceCharacters.forEach(
    function(character) {

      /* 空白 */

      if (character.space) {

        const space =
          document.createElement("div");

        space.className =
          "sentence-space";

        area.appendChild(space);

        decodedText += " ";

        return;
      }


      const key =
        makeKey(
          character.hen,
          character.bou
        );


      const translation =
        dictionary[key] || "□";


      /* ------------------------------
         文章上の元画像
         ------------------------------ */

      const characterBox =
        document.createElement("div");

      characterBox.className =
        "sentence-character";


      const images =
        document.createElement("div");

      images.className =
        "sentence-character-images";


      const henImg =
        document.createElement("img");

      henImg.src =
        henImage(character.hen);


      const bouImg =
        document.createElement("img");

      bouImg.src =
        bouImage(character.bou);


      images.appendChild(henImg);

      images.appendChild(bouImg);


      const translationElement =
        document.createElement("div");

      translationElement.className =
        "sentence-translation";

      translationElement.textContent =
        translation;


      characterBox.appendChild(images);

      characterBox.appendChild(
        translationElement
      );


      area.appendChild(characterBox);


      /* ------------------------------
         日本語
         ------------------------------ */

      decodedText += translation;


      /* ------------------------------
         対応表示
         ------------------------------ */

      const detail =
        document.createElement("div");

      detail.className =
        "detail-item";


      const detailImages =
        document.createElement("div");

      detailImages.className =
        "detail-images";


      const detailHen =
        document.createElement("img");

      detailHen.src =
        henImage(character.hen);


      const detailBou =
        document.createElement("img");

      detailBou.src =
        bouImage(character.bou);


      detailImages.appendChild(
        detailHen
      );

      detailImages.appendChild(
        detailBou
      );


      const arrow =
        document.createElement("div");

      arrow.className =
        "detail-arrow";

      arrow.textContent =
        "→";


      const detailTranslation =
        document.createElement("div");

      detailTranslation.className =
        "detail-translation";

      detailTranslation.textContent =
        translation;


      detail.appendChild(
        detailImages
      );

      detail.appendChild(arrow);

      detail.appendChild(
        detailTranslation
      );


      details.appendChild(detail);

    }
  );


  decoded.textContent =
    decodedText;
}


/* ======================================
   登録済み一覧
   ====================================== */

function updateDictionaryList() {

  const container =
    document.getElementById(
      "dictionaryList"
    );


  const dictionary =
    loadDictionary();


  container.innerHTML = "";


  const keys =
    Object.keys(dictionary);


  if (keys.length === 0) {

    const empty =
      document.createElement("p");

    empty.className =
      "empty";

    empty.textContent =
      "まだ文字が登録されていません。";

    container.appendChild(empty);

    return;
  }


  keys.sort(
    function(a, b) {

      const [aHen, aBou] =
        a.split(":").map(Number);

      const [bHen, bBou] =
        b.split(":").map(Number);


      if (aHen !== bHen) {

        return aHen - bHen;

      }


      return aBou - bBou;

    }
  );


  keys.forEach(
    function(key) {

      const [hen, bou] =
        key.split(":");


      const item =
        document.createElement("div");

      item.className =
        "dictionary-item";


      const images =
        document.createElement("div");

      images.className =
        "dictionary-images";


      const henImg =
        document.createElement("img");

      henImg.src =
        henImage(hen);


      const bouImg =
        document.createElement("img");

      bouImg.src =
        bouImage(bou);


      images.appendChild(henImg);

      images.appendChild(bouImg);


      const translation =
        document.createElement("div");

      translation.className =
        "dictionary-translation";

      translation.textContent =
        "篇 " + hen +
        " ＋ 旁 " + bou +
        " → " +
        dictionary[key];


      item.appendChild(images);

      item.appendChild(translation);


      container.appendChild(item);

    }
  );
}


/* ======================================
   初期設定
   ====================================== */

createHenGrid();

createBouGrid();


setupSelect(
  "searchHen",
  henCount,
  "篇 "
);

setupSelect(
  "searchBou",
  bouCount,
  "旁 "
);


setupSelect(
  "sentenceHen",
  henCount,
  "篇 "
);

setupSelect(
  "sentenceBou",
  bouCount,
  "旁 "
);


updateDictionaryList();

updateSentence();
