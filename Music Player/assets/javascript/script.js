console.log("Let's Start JavaScript");

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/Music%20Player/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
    // Adjust the path to your songs folder
    let audio = new Audio("http://127.0.0.1:3000/Music%20Player/songs/" + track);
    audio.play();
}


async function main() {
  let songs = await getSongs();
  let currentSong;



  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML += `<li>
      <img class="invert" src="assets/image/music.svg" alt="">
      <div class="info">
          <div>${song.replaceAll("%20", " ").replace("[SPOTIFY-DOWNLOADER.COM]", "")}</div>
          <div>Artist Name</div>
      </div>
      <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="assets/image/play.svg" alt="play">
      </div>
    </li>`; // Use backticks for proper interpolation
  }
   Array.from (document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    })
    
   })
}
main();
