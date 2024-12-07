let currentSong = new Audio();
let songs;

function SecondsToMinuteSecond(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds to always show two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5501/songs/");
  let response = await a.text();
  console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as)
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
  // console.log(songs)
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs"+ track)
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function main() {
  songs = await getSongs();
  playMusic(songs[0], true);
  //   console.log(songs);

  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
        <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div class="song-artist">Aman</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
        </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((ev) => {
    ev.addEventListener("click", (element) => {
      console.log(ev.querySelector(".info").firstElementChild.innerHTML);
      playMusic(ev.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //Attach an event listerner to play next and previous song
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "pause.svg";
      play.src = "play.svg";
    }
  });

  //listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${SecondsToMinuteSecond(
      currentSong.currentTime
    )}:
    ${SecondsToMinuteSecond(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  let hlw = document.querySelector(".hlw");
  hlw.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(songs.length)
    // console.log(index)
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //play the first song
  // var audio = new Audio(songs[0]);
  // audio.play();
  // audio.addEventListener("loadeddata",()=>{
  //     let duration = audio.duration;
  //     console.log(duration)
  // })
}
main();
