console.log("Let's Start JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const song of songs) {
    songul.innerHTML += `<li>
    <img class="invert" src="assets/image/music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>Artist Name</div>
    </div>
    <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="assets/image/play.svg" alt="play">
    </div>
  </li>`; // Use backticks for proper interpolation
  }
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs; 
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/image/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardcontainer");

  // Mapping of folder names to cover image filenames and formats
  const folderCovers = {
    ab: { filename: "cover1.avif", format: "avif" },
    cs: { filename: "cover2.png", format: "png" },
    ncs: { filename: "cover3.jpg", format: "jpg" },
    // Add more folder mappings as needed
  };

  for (let index = 0; index < anchors.length; index++) {
    const e = anchors[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0]; // Extract folder name
      console.log(folder);
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`); // Use folder name in URL
      let response = await a.json();
      console.log(response);

      // Get cover image details for the current folder
      let folderCover = folderCovers[folder];
      let imgSrc = folderCover ? `/songs/${folder}/${folderCover.filename}` : "";

      // Dynamically generate card HTML content
      cardcontainer.innerHTML += `
        <div data-folder="${folder}" class="card">
          <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="lightblue" /> <!-- Background circle -->
              <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5" />
              <path
                d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </div>
          <img src="${imgSrc}" alt="">
          <h3>${response.title}</h3>
          <p>${response.discription}</p>
        </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/image/pause.svg";
    } else {
      currentSong.pause();
      play.src = "assets/image/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime =
      (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("mute.svg", "volume.svg");
      }
    });

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
      if(e.target.src.includes("volume.svg")){
          e.target.src = e.target.src.replace("volume.svg", "mute.svg")
          currentSong.volume = 0;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
          e.target.src = e.target.src.replace("mute.svg", "volume.svg")
          currentSong.volume = .10;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      }

  })
}

main();
