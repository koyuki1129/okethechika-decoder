// ========================================
// おけてちか解読ツール
// ========================================

// 篇と旁の数
const HEN_COUNT = 20;
const BOU_COUNT = 70;

// localStorageに保存するときの名前
const dictionaryKey = "oketechika_dictionary";

// 現在選択されている篇・旁
let selectedHen = null;
let selectedBou = null;

// 文章
let sentence = [];


// ========================================
// 画像の場所
// ========================================

function imagePath(type, number) {

  const num = String(number).padStart(2, "0");

  if (type === "hen") {
    return `images/hen${num}.jpg`;
  }

  return `images/bou${num}.jpg`;
}


// ========================================
// 辞書を読み込む
// ========================================

function loadDictionary() {

  try {

    const saved = localStorage.getItem(dictionaryKey);

    if (!saved) {
      return {};
    }

    return JSON.parse(saved);

  } catch (error) {

    console.error("辞書の読み込みに失敗しました。", error);

    return {};
  }
}


// ========================================
// 辞書を保存する
// ========================================

function saveDictionary(dictionary) {

  localStorage.setItem(
    dictionaryKey,
    JSON.stringify(dictionary)
  );
}


// ========================================
// 篇＋旁の組み合わせをキーにする
// ========================================

function makeKey(hen, bou) {

  return `${hen}:${bou}`;
}


// ========================================
// 篇の画像を作る
// ========================================

function createHenButtons() {
  const grid = document.getElementById("henGrid");

  // 「なし」ボタン
  const noneButton = document.createElement("button");
  noneButton.className = "image-button none-button";
  noneButton.type = "button";
  noneButton.dataset.number = "0";

  const noneText = document.createElement("span");
  noneText.textContent = "なし";

  noneButton.appendChild(noneText);
  noneButton.addEventListener("click", () => selectHen(0, noneButton));

  grid.appendChild(noneButton);

  // 篇1～20
  for (let i = 1; i <= HEN_COUNT; i++) {
    const button = document.createElement("button");

    button.className = "image-button";
    button.type = "button";
    button.dataset.number = i;

    const image = document.createElement("img");
    image.src = imagePath("hen", i);
    image.alt = `篇 ${i}`;

    const number = document.createElement("span");
    number.textContent = i;

    button.appendChild(image);
    button.appendChild(number);

    button.addEventListener("click", () => selectHen(i, button));

    grid.appendChild(button);
  }
}

    


// ========================================
// 旁の画像を作る
// ========================================

function createBouButtons() {

  const grid = document.getElementById("bouGrid");

  for (let i = 1; i <= BOU_COUNT; i++) {

    const button = document.createElement("button");

    button.className = "image-button";
    button.type = "button";

    button.dataset.number = i;

    const image = document.createElement("img");

    image.src = imagePath("bou", i);
    image.alt = `旁 ${i}`;

    const number = document.createElement("span");

    number.textContent = i;

    button.appendChild(image);
    button.appendChild(number);

    button.addEventListener("click", function () {

      selectBou(i, button);

    });

    grid.appendChild(button);
  }
}


// ========================================
// 篇を選択
// ========================================

function selectHen(number, button) {
  selectedHen = number;

  document
    .querySelectorAll("#henGrid .image-button")
    .forEach(item => item.classList.remove("selected"));

  button.classList.add("selected");

  if (number === 0) {
    document.getElementById("selectedHenText").textContent = "篇：なし";
  } else {
    document.getElementById("selectedHenText").textContent = `篇：${number}`;
  }

  updatePairPreview();
}


// ========================================
// 旁を選択
// ========================================

function selectBou(number, button) {

  selectedBou = number;

  document
    .querySelectorAll("#bouGrid .image-button")
    .forEach(function (item) {

      item.classList.remove("selected");

    });

  button.classList.add("selected");

  document.getElementById("selectedBouText").textContent =
    `旁：${number}`;

  updatePairPreview();
}


// ========================================
// 篇＋旁のプレビュー
// ========================================

function updatePairPreview() {

  const area = document.getElementById("pairPreview");

  if (selectedHen === null || selectedBou === null) {

    area.innerHTML =
      "<p>篇と旁の両方を選択してください。</p>";

    return;
  }


  const image2 = imagePath("bou", selectedBou);


  // 篇なしの場合
  if (selectedHen === 0) {

    area.innerHTML = `

      <div class="pair-images">

        <div>
          <p>篇</p>
          <div class="none-preview">なし</div>
        </div>

        <div class="plus">＋</div>

        <div>
          <p>旁</p>
          <img src="${image2}" alt="選択した旁">
        </div>

      </div>

      <p class="pair-number">
        篇なし ＋ 旁 ${selectedBou}
      </p>
    `;

    return;
  }


  // 通常の篇＋旁
  const image1 = imagePath("hen", selectedHen);

  area.innerHTML = `

    <div class="pair-images">

      <div>
        <p>篇</p>
        <img src="${image1}" alt="選択した篇">
      </div>

      <div class="plus">＋</div>

      <div>
        <p>旁</p>
        <img src="${image2}" alt="選択した旁">
      </div>

    </div>

    <p class="pair-number">
      篇 ${selectedHen} ＋ 旁 ${selectedBou}
    </p>
  `;
}


// ========================================
// 日本語を登録
// ========================================

function registerCharacter() {

  const message = document.getElementById("registerMessage");

  if (selectedHen === null || selectedBou === null) {

    message.textContent =
      "先に篇と旁の両方を選択してください。";

    return;
  }


  const input =
    document.getElementById("translationInput");

  const translation = input.value.trim();


  if (!translation) {

    message.textContent =
      "日本語を1文字入力してください。";

    return;
  }


  // 日本語1文字だけ許可
  const characters = [...translation];

  if (characters.length !== 1) {

    message.textContent =
      "ひらがな・漢字などを1文字だけ入力してください。";

    return;
  }


  const dictionary = loadDictionary();

  const key = makeKey(
    selectedHen,
    selectedBou
  );

  const alreadyExists =
    Object.prototype.hasOwnProperty.call(
      dictionary,
      key
    );


  dictionary[key] = translation;

  saveDictionary(dictionary);

  input.value = "";


  if (alreadyExists) {

    message.textContent =
      `登録を更新しました：${translation}`;

  } else {

    message.textContent =
      `登録しました：${translation}`;
  }


  updateDictionaryList();
  updateSentenceDisplay();
}


// ========================================
// 検索
// ========================================

function searchCharacter() {

  const result =
    document.getElementById("searchResult");


  if (selectedHen === null || selectedBou === null) {

    result.textContent =
      "先に篇と旁を選択してください。";

    return;
  }


  const dictionary = loadDictionary();

  const key = makeKey(
    selectedHen,
    selectedBou
  );


  if (dictionary[key]) {

    result.textContent =
      `この文字は「${dictionary[key]}」です。`;

  } else {

    result.textContent =
      "まだ登録されていません。";
  }
}


// ========================================
// 文章に現在の文字を追加
// ========================================

function addToSentence() {

  if (selectedHen === null || selectedBou === null) {

    alert("先に篇と旁を選択してください。");

    return;
  }


  sentence.push({

    hen: selectedHen,
    bou: selectedBou

  });


  updateSentenceDisplay();
}


// ========================================
// スペースを追加
// ========================================

function addSpace() {

  sentence.push({
    space: true
  });

  updateSentenceDisplay();
}


// ========================================
// 文章をクリア
// ========================================

function clearSentence() {

  sentence = [];

  updateSentenceDisplay();
}


// ========================================
// 文章を表示
// ========================================

function updateSentenceDisplay() {

  const area =
    document.getElementById("sentenceArea");

  const japaneseArea =
    document.getElementById("sentenceJapanese");


  if (sentence.length === 0) {

    area.innerHTML =
      "まだ文字がありません。";

    japaneseArea.textContent =
      "解読結果：—";

    return;
  }


  const dictionary = loadDictionary();

  area.innerHTML = "";

  let japaneseText = "";


  sentence.forEach(function (item, index) {

    // スペース
    if (item.space) {

      const space = document.createElement("span");

      space.className = "sentence-space";
      space.textContent = " ";

      area.appendChild(space);

      japaneseText += " ";

      return;
    }


    // 篇＋旁
    const key = makeKey(
      item.hen,
      item.bou
    );

    const translation =
      dictionary[key] || "□";

    japaneseText += translation;


    const characterBox =
      document.createElement("div");

    characterBox.className =
      "sentence-character";


    characterBox.innerHTML = `

      <div class="sentence-images">

        <img
          src="${imagePath("hen", item.hen)}"
          alt="篇 ${item.hen}"
        >

        <span>＋</span>

        <img
          src="${imagePath("bou", item.bou)}"
          alt="旁 ${item.bou}"
        >

      </div>

      <div class="sentence-translation">
        ${translation}
      </div>

    `;


    area.appendChild(characterBox);

  });


  japaneseArea.textContent =
    `解読結果：${japaneseText}`;
}


// ========================================
// 登録済み一覧
// ========================================

function updateDictionaryList() {

  const area =
    document.getElementById("dictionaryList");

  const dictionary = loadDictionary();

  const keys = Object.keys(dictionary);


  if (keys.length === 0) {

    area.innerHTML =
      "まだ登録されていません。";

    return;
  }


  keys.sort(function (a, b) {

    const [aHen, aBou] = a.split(":").map(Number);
    const [bHen, bBou] = b.split(":").map(Number);

    if (aHen !== bHen) {
      return aHen - bHen;
    }

    return aBou - bBou;

  });


  area.innerHTML = "";


  keys.forEach(function (key) {

    const [hen, bou] =
      key.split(":").map(Number);

    const translation =
      dictionary[key];


    const item =
      document.createElement("div");

    item.className =
      "dictionary-item";


    item.innerHTML = `

      <div class="dictionary-images">

        <img
          src="${imagePath("hen", hen)}"
          alt="篇 ${hen}"
        >

        <span>＋</span>

        <img
          src="${imagePath("bou", bou)}"
          alt="旁 ${bou}"
        >

      </div>

      <div class="dictionary-info">

        <div>
          篇 ${hen} ＋ 旁 ${bou}
        </div>

        <strong>
          → ${translation}
        </strong>

      </div>

      <button
        class="delete-button"
        data-key="${key}"
      >
        削除
      </button>

    `;


    item
      .querySelector(".delete-button")
      .addEventListener("click", function () {

        deleteDictionaryItem(key);

      });


    area.appendChild(item);

  });
}


// ========================================
// 登録を削除
// ========================================

function deleteDictionaryItem(key) {

  const dictionary = loadDictionary();

  delete dictionary[key];

  saveDictionary(dictionary);

  updateDictionaryList();
  updateSentenceDisplay();
}


// ========================================
// ボタンを設定
// ========================================

document
  .getElementById("registerButton")
  .addEventListener(
    "click",
    registerCharacter
  );


document
  .getElementById("searchButton")
  .addEventListener(
    "click",
    searchCharacter
  );


document
  .getElementById("addToSentenceButton")
  .addEventListener(
    "click",
    addToSentence
  );


document
  .getElementById("addSpaceButton")
  .addEventListener(
    "click",
    addSpace
  );


document
  .getElementById("clearSentenceButton")
  .addEventListener(
    "click",
    clearSentence
  );


// ========================================
// 最初に画面を作る
// ========================================

createHenButtons();
createBouButtons();

updatePairPreview();
updateDictionaryList();
updateSentenceDisplay();
