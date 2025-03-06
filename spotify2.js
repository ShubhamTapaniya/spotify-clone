let currentFolder;
let songsarr =[];// to get array of songs
let yourfavoritesongs = [];
async function getsongs(){
    try{
        console.log(currentFolder);
        let a = await fetch(`http://127.0.0.1:5500/spotify/songs/${currentFolder}/`);
        let response = await a.text();
        let div = document.createElement('div');
        div.innerHTML = response;
        let att = div.getElementsByTagName('a');
        for(let i=0;i<att.length;i++){
            let element = att[i];
            if(element.href.endsWith('.mp3')){
                songsarr.push(element.href);
            }
        }
        return songsarr;
    }
    catch(err){
        console.log('here is this error',err);
    }
}
let addsongname = document.querySelector('.create_playlist ul');

async function loadsonglist(folder) {
    currentFolder = folder;
    let songs = await getsongs(); // Fetch song list
    for (const song of songs) {
        let temp = song.split(`songs/${currentFolder}/`)[1].replaceAll('%20',' '); // Extract song name
        let newlist = document.createElement('li');

        newlist.innerHTML += `
            <div style="display:flex;">
                <div style="display: flex;">
                    <div style="align-self: center; height: auto; width: 3rem;">
                        <i style="fill: white; padding-left: 0.6rem;" class='bx bx-music'></i>
                    </div>
                    <div style="align-self: center; max-width: 120px;">
                        <p id="songstring" style="font-weight: 400; font-size: 12px; line-height: 15px; padding-left:1rem;">
                            ${temp.replaceAll('%20',' ')}
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; margin-left: auto;">
                    <div style="align-self: center; font-weight: 400; padding-right: 1rem; font-size: 15px;">
                        playnow
                    </div>
                    <div>
                        <button style="background: transparent;" onclick="playsongs('${encodeURIComponent(song)}')">
                            <img src="playicon.png" alt="play" height="50px" style="cursor: pointer;"/>
                        </button>
                    </div>
                </div>
            </div>`;

        addsongname.appendChild(newlist);
    }
}

let newfavlist;
function loadfavsonglist(folder) {
    currentFolder = nuk=;
    let addfavsongs = document.querySelector('.favorite_songs ul');
    addfavsongs.innerHTML = ''; // Clear list to avoid duplicate songs
    for (const song of yourfavoritesongs) {
        let temp = song.split(`songs/${currentFolder}/`)[1].replaceAll('%20',' '); // Extract song name
        newfavlist = document.createElement('li');
        newfavlist.innerHTML = `
            <div style="display:flex;">
                <div style="display: flex;">
                    <div style="align-self: center; height: auto; width: 3rem;">
                        <i style="fill: white; padding-left: 0.6rem;" class='bx bx-music'></i>
                    </div>
                    <div style="align-self: center; max-width: 120px;">
                        <p id="songstring" style="font-weight: 400; font-size: 12px; line-height: 15px; padding-left:1rem;">
                            ${temp.replaceAll('%20',' ')}
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; margin-left: auto;">
                    <div style="align-self: center; font-weight: 400; padding-right: 1rem; font-size: 15px;">
                        playnow
                    </div>
                    <div>
                        <button style="background: transparent;" onclick="playsongs('${encodeURIComponent(song)}')">
                            <img src="playicon.png" alt="play" height="50px" style="cursor: pointer;"/>
                        </button>
                    </div>
                </div>
            </div>`;

        addfavsongs.appendChild(newfavlist);
    }
}

// function setimages(){
//     console.log('images');
// }

let currentsongname = document.querySelector('.music_name');

const currentsong = new Audio();//once only declared....otherwise every time playsong() called 
                                // then new song variable created and song will play without letting one sing to end

function playsongs(track) {
    currentsong.src = decodeURIComponent(track);//Decode the encoded URL before playing
    currentsong.play();
    currentsongname.innerText = currentsong.src.split(`songs/${currentFolder}/`)[1].replaceAll('%20',' ');//set current song name
    document.querySelector(".feather").setAttribute('id','null');//set favorite reset every time
    // setimages();
}

let playimg = document.querySelector('#playbutton>img');
let playbutton = document.querySelector('#playbutton');

playbutton.addEventListener('click',()=>{//pause and play
    if(currentsong.paused){
        currentsong.play();
        playimg.src='playicon.png';
    }else{
        currentsong.pause();
        playimg.src = 'pauseicon.png';
    }
})

document.querySelector('#previousbtn').addEventListener("click",()=>{
    let index = songsarr.indexOf(currentsong.src); // Find current song index
    if(index>0){
        index=index-1;
        currentsong.src = songsarr[index];
    }else{
        index = songsarr.length-1;//for nagative index
    }
    currentsong.src = songsarr[index];
    currentsong.play();
    currentsongname.innerText = currentsong.src.split(`songs/${currentFolder}/`)[1].replaceAll("%20"," ");//set current song name
})

document.querySelector('#nextbtn').addEventListener("click",()=>{
    let index = songsarr.indexOf(currentsong.src); // Find current song index
    if(index==songsarr.length-1){
        index=0;
    }else{
        index = index+1;//for nagative index
    }
    currentsong.src = songsarr[index];
    currentsong.play();
    currentsongname.innerText = currentsong.src.split(`songs/${currentFolder}/`)[1].replaceAll("%20"," ");//set current song name
})


document.addEventListener('keydown',(event)=>{//playwith keybord
    if(event.code == "Space"){
        if(currentsong.paused){
            currentsong.play();
            playimg.src='playicon.png';
        }else{
            currentsong.pause();
            playimg.src = 'pauseicon.png';
        }
    }
})

let heart = document.querySelector('#heart');

heart.addEventListener("click", () => {
    if (!(yourfavoritesongs.includes(currentsong.src))) { // If song is not already in favorites
        yourfavoritesongs.push(currentsong.src);
        loadfavsonglist('songs'); // Use the stored folder name
        document.querySelector(".feather").setAttribute('id', 'fillgreen'); // Highlight favorite icon
    } else {
        document.querySelector(".feather").setAttribute('id', 'null'); // Unfavorite
        yourfavoritesongs.splice(yourfavoritesongs.indexOf(currentsong.src),1);//remove frome favorite
        loadfavsonglist('songs');
    }
});


let timmer = document.querySelector(".start_time");
let endTime = document.querySelector(".end_time");
let seekbarthumb = document.querySelector("#music_bar");

currentsong.onloadedmetadata = () => {//set total time value
    if (!isNaN(currentsong.duration)) {
        let totalMin = Math.floor(currentsong.duration / 60);
        let totalSec = Math.floor(currentsong.duration % 60);
        endTime.innerText = `${totalMin}:${totalSec < 10 ? '0' : ''}${totalSec}`;
    }
};

currentsong.ontimeupdate = () => {//change time every sec
    let min = Math.floor(currentsong.currentTime / 60);
    let sec = Math.floor(currentsong.currentTime % 60);
    timmer.innerText = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    let percentage = (seekbarthumb.value / seekbarthumb.max) * 100;
    seekbarthumb.style.setProperty('--progress', `${percentage}%`);//set progress variable for css
    seekbarthumb.value = (currentsong.currentTime/currentsong.duration)*100;//set current position of thumb
};

seekbarthumb.addEventListener("input", (e) => {// Jump to selected time
    let seekTime = (parseFloat(seekbarthumb.value) / 100) * currentsong.duration; // Convert % to seconds because .value will give in %
    currentsong.currentTime = seekTime;
});

let volumebtn = document.querySelector(".volumebtn");
let volumebar = document.querySelector("#volume_bar");


volumebar.addEventListener('input',(e)=>{
    currentsong.volume = parseInt(e.target.value)/100;
    let percentage = (volumebar.value / volumebar.max) * 100;
    volumebar.style.setProperty('--volume', `${percentage}%`);//set progress variable for css
})


let loopmusic = document.querySelector('.loopbtn');
let isLooping = false;

loopmusic.addEventListener('click', () => {
    isLooping = !isLooping; // Toggle loop state
    currentsong.loop = isLooping; // Use built-in looping
    document.querySelector('#loopsvg').style.fill = isLooping ? '#1bd760' : 'white';
});

let volumelevel = 1;//full

volumebtn.addEventListener('click',()=>{
    volumelevel = !volumelevel;//mute
    currentsong.volume = volumelevel ? 1 : 0;
    document.querySelector("#volumefull").classList.toggle('hidden');
    document.querySelector("#volumemute").classList.toggle('hidden');
})

document.addEventListener('keydown',(event)=>{//mute with keybord
    if(event.code == "KeyM"){
        volumelevel = !volumelevel;//mute
        currentsong.volume = volumelevel ? 1 : 0;
        document.querySelector("#volumefull").classList.toggle('hidden');
        document.querySelector("#volumemute").classList.toggle('hidden');
    }
})


let hoverbuttonArray = Array.from(document.querySelectorAll('.hover_play_btn button'));

hoverbuttonArray.forEach(element => {
    element.addEventListener("click",(e)=>{
        let folder = e.target.dataset.folder; // Get folder name dynamically
        songsarr=[];// to cleare all previous songs then only load to avoid old songs being undefind
        addsongname.innerHTML ="";
        loadsonglist(folder);
    })
});
