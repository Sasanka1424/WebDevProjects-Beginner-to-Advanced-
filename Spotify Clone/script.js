console.log("Lets Write JavaScript");

async function getSongs() {
  try {
    let a = await fetch("http://127.0.0.1:3000/Spotify%20Clone/songs/");
    
    if (!a.ok) {
      throw new Error(`HTTP error! Status: ${a.status}`);
    }

    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = Array.from(div.getElementsByTagName("a"));
    let songs = as
      .filter(element => element.href.endsWith(".mp3"))
      .map(element => element.href);

    return songs;
  } catch (error) {
    console.error("Error:", error);
    return []; // Return an empty array in case of an error
  }
}

// async function main() {
//   let songs = await getSongs();
//   console.log(songs);

//   var audio = new Audio(songs[0]);
//   audio.play();


}



main();
