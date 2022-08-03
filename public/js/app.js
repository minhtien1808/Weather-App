const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = document.querySelector(".info-txt"),
  inputField = document.querySelector("input"),
  locationBtn = document.querySelector("button"),
  weatherPart = document.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i"),
  wBackGround = document.querySelector("body");
let api;
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});
const requestApi = (city) => {
  api = `https://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=73d7da466864c2ec63803168528382e9`;
  fetchData();
};
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation api ");
  }
});
const onSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}139&appid=73d7da466864c2ec63803168528382e9&units=metric`;
  fetchData();
};
const onError = (error) => {
  infoTxt.innerHTML = error.message;
  infoTxt.classList.add("error");
};
function fetchData() {
  infoTxt.innerHTML = "Getting weather data...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      weatherDetails(result);
    })
    .catch(() => {
      infoTxt.innerHTML = "Something went wrong! please try again";
      infoTxt.classList.replace("pending", "error");
    });
}
const weatherDetails = (info) => {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;

    if (id == 800) {
      wIcon.src = "../public/icon/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "../public/icon/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "../public/icon/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "../public/icon/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "../public/icon/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "../public/icon/rain.svg";
    }
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
    wBackGround.classList.add("change-background");
  }
};
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  wBackGround.classList.remove("change-background");
});
