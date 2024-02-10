console.log("Leggo!!!!!!")


let songs;

let currentSong = new Audio();

let currentFolder;


async function getSongs(folder){
    currentFolder = folder
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Adding list of songs into playlist
    let songUL = document.querySelectorAll(".songslist")[0]
    songUL.innerHTML = "" //clear the previous playlist songs
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="./assets/music.svg" alt="music" class="invert">
        <p class="info">${song.replaceAll("%20"," ")}</p>
        <img src="./assets/play.svg" alt="playsong" class="invert play">
    </li>`
    }

    // Attach event listener to each song
    let songitems = document.querySelector(".songslist").getElementsByTagName("li")
    Array.from(songitems).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").innerHTML)
            playMusic(e.querySelector(".info").innerHTML)
        })
    })

    return songs
}

const secondstominutes = (time) => {
    if (isNaN(time) || typeof time !== 'number') {
        return '0:00';
    }

    let minutes = Math.floor(time/60)
    let seconds = Math.floor(time%60)

    seconds = String(seconds).padStart(2,'0')

    return `${String(minutes)}:${seconds}`
}

const playMusic = (track, pause=false) => {
    // let track1 = new Audio("/songs/" + track)
    // track1.play() // multiple songs are playing at same time
    
    currentSong.src = `/${currentFolder}/` + track
    
    if(!pause){
        currentSong.play()
        playsong.src = "./assets/pause.svg"
    }

    // document.querySelector(".play").src = "./assets/pause.svg"

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00"

}

async function getAlbums(){
    let a = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let playlists = document.querySelector(".playlists")

    let array = Array.from(as)
    for(let index = 0; index < array.length; index++){
        const e = array[index];
        // console.log(e.href)
        if(e.href.includes("/songs/")){
            // console.log(e.href)
            let folder = e.href.split("/").slice(-1)[0]
            // console.log(folder)

            // Get metadata of the folders
            let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
            let response = await a.json()     
            // console.log(response)

            // Finally create them inside playlists
            playlists.innerHTML = playlists.innerHTML + `<div data-folder="${folder}" class="card border-rad p-1 bg-grey">
            <img src="/songs/${folder}/cover.jpg" alt="lofibeats" class="border-rad">
            <h5>${response.title}</h5>
            <p>${response.description}</p>
            <span class="playicon">
                <img src="./assets/playicon.svg" alt="playicon">
            </span>
        </div>`


        }
    }
    
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        // console.log(e)
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0],true)
        })
    })

}

async function main(){

    // Display all the albums
    await getAlbums()

    // Get list of all songs
    // songs = await getSongs("songs/lofibeats")
    // await getSongs("songs/chillout")
    // console.log(songs)

    // Play the first song
    // let track = new Audio(songs[0])
    // track.play()
    // playMusic(songs[0],true)



    // Attach event listener to each button prev,play,next
    // Play Button
    playsong.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play()
            playsong.src = "./assets/pause.svg"
            // document.querySelectorAll(".play").src = "./assets/pause.svg"
        }else{
            currentSong.pause()
            playsong.src = "./assets/play.svg"
            // document.querySelectorAll(".play").src = "./assets/play.svg" 
        }
    })

    // Previous Button
    prevsong.addEventListener("click", () => {
        let currentsrc = currentSong.src.split("/").slice(-1)[0]  // Remember to take [0]
        let index = songs.indexOf(currentsrc)
        // console.log(songs, currentsrc, index)
        if(index == 0){
            playMusic(songs[songs.length-1],false)
        }else{
            playMusic(songs[index-1],false)
        }
    })
    
    // Next Button
    nextsong.addEventListener("click", () => {
        let currentsrc = currentSong.src.split("/").slice(-1)[0]  // Remember to take [0]
        let index = songs.indexOf(currentsrc)
        // console.log(songs, currentsrc, index)
        if(index == songs.length-1){
            playMusic(songs[0],false)
        }else{
            playMusic(songs[index+1],false)
        }
    })
    
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        let time = secondstominutes(currentSong.currentTime)
        let duration = secondstominutes(currentSong.duration)
        
        document.querySelector(".songtime").innerHTML = `${time} / ${duration}`
        
        document.querySelector(".circle").style.left = 100*(currentSong.currentTime/currentSong.duration) + "%"
        
        document.querySelector(".line").style.width = 100*(currentSong.currentTime/currentSong.duration) + "%"
        
        let currentsrc = currentSong.src.split("/").slice(-1)[0]  // Remember to take [0]
        let index = songs.indexOf(currentsrc)

        if(currentSong.currentTime==currentSong.duration){
            currentSong.pause()
            playsong.src = "./assets/play.svg"
            if(index == songs.length-1){
                playMusic(songs[0],false)
            }else{
                playMusic(songs[index+1],false)
            }
        }
    })

    // Add an event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100
        
        document.querySelector(".circle").style.left = percent + "%"
        
        document.querySelector(".line").style.width = percent + "%"
        
        currentSong.currentTime = currentSong.duration * percent / 100
    })

    // Event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0%"
    })

    // Event listener for closing hamburger
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-100%"
    })

}

main()