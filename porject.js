const ul = document.querySelector(".list");
const changeCard = document.querySelector("#changeCard");

const url = "https://pokeapi.co/api/v2/pokemon/";
const fewACard = 4; // 카드 몇 장
const species = 151; // 1세대 포켓몬 종류

const randomIndexArray = [];
for (let i = 0; i < fewACard; i++) {
  const randomNum = Math.floor(Math.random() * species) + 1;
  randomIndexArray.push(randomNum);
}
const randomIndex = randomIndexArray.concat(randomIndexArray);
const numMix = randomIndex.sort(() => Math.random() - 0.5);

let clickable = false;

// 태그 생성
const tagElement = function (data) {
  const li = document.createElement("li");
  ul.append(li);
  li.classList.add("item");

  // 카드 감싸기
  const card = document.createElement("div");
  li.append(card);
  card.classList.add("card");

  // 카드 뒷면
  const back = document.createElement("div");
  card.append(back);
  back.classList.add("back");

  const backButton = document.createElement("button");
  back.append(backButton);
  backButton.classList.add("btn-click");
  backButton.name = data.name;

  const backImg = document.createElement("img");
  backButton.append(backImg);
  backImg.classList.add("poke-img");
  backImg.src = data.sprites.front_default;
  backImg.alt = data.name;

  const backP = document.createElement("p");
  backButton.append(backP);
  backP.classList.add("poke-name");
  backP.innerText = data.name;

  // 카드 앞면
  const front = document.createElement("div");
  card.append(front);
  front.classList.add("front");

  const frontButton = document.createElement("button");
  front.append(frontButton);
  frontButton.classList.add("btn-click");

  const frontImg = document.createElement("img");
  frontButton.append(frontImg);
  frontImg.classList.add("poke-img");
  frontImg.src = "./card.png";
  frontImg.width = 300;
};

// 짝 맞추는 기능
const card = function () {
  const cards = document.querySelectorAll(".card");
  let cardClicks = [];
  let pokemonBall = [];

  for (const card of cards) {
    card.addEventListener("click", function () {
      if (!clickable || pokemonBall.includes(this) || cardClicks[0] === this) {
        return;
      }

      cardClicks.push(this);
      const cardClicked = this.querySelector(".front");
      cardClicked.classList.toggle("rotate");

      if (cardClicks.length !== 2) {
        return;
      }

      const firstName = cardClicks[0].querySelector(".btn-click").name;
      const lastName = cardClicks[1].querySelector(".btn-click").name;

      if (firstName === lastName) {
        pokemonBall.push(cardClicks[0]);
        pokemonBall.push(cardClicks[1]);
        cardClicks = [];

        if (pokemonBall.length !== randomIndex.length) {
          return;
        }
        setTimeout(() => {
          alert("축하합니다.");
        }, 0);
        return;
      }

      clickable = false;

      setTimeout(() => {
        const front = cardClicks[0].querySelector(".front");
        front.classList.remove("rotate");
        const last = cardClicks[1].querySelector(".front");
        last.classList.remove("rotate");
        cardClicks = [];
        clickable = true;
      }, 500);
    });
  }
};

const pokeApi = async () => {
  clickable = true;
  for await (const item of numMix) {
    try {
      const res = await fetch(`${url}${item}`, { method: "GET" });
      const data = await res.json();
      tagElement(data);
    } catch (error) {
      console.log("에러", error);
    }
  }
  card();
};

pokeApi();
