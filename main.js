const heads = ["sigma","donald","terminator","gros","militaire","natha"];
const arrows = ["↑","↓","←","→"]
// const buttonTest = document.

const cible = document.getElementById("cible");
const pvEnnemi = document.getElementById("pvEnnemi");
const sigma = document.getElementById("sigma");
const donald = document.getElementById("donald");
const terminator = document.getElementById("terminator");
const gros = document.getElementById("gros");
const militaire = document.getElementById("militaire");
const natha = document.getElementById("natha");
const hitZone = document.getElementById("hitZone");
const hitBar = document.getElementById("barre");
const hitCursor = document.getElementById("hitCursor")
const pvsMis = document.getElementById("pvsInfliges")
const timeBar = document.getElementById("time");
const arrow = document.getElementById("arrow");
const caseV = document.getElementById("case");
const pvPlayer = document.getElementById("pvPlayer");
const game = document.getElementById("game");
const pvsPris = document.getElementById("pvsPris");
const points = document.getElementById("points");
const annonce = document.getElementById("annonce");
const voile = document.getElementById("voile");

const WIDTH=1300;
const HEIGHT=700;

const URL = "https://dyerjiadwfpzowmvuyog.supabase.co";
const KEY = "sb_publishable_do03ceyJONWVwZz73reeAA_phr9tPHc";

const client = supabase.createClient(URL,KEY);
const channel = client.channel("jeuPerso",{config:{private:false}});

channel.subscribe((status)=>{if(status==="SUBSCRIBED"){console.log("connecté")}})

voile.style.left="0px";
voile.style.top="0px";
voile.style.width=WIDTH+"px";
voile.style.height=HEIGHT+"px";

// donald.style.visibility="visible";


let pvsEnnemi = 100;
let cibleX = 600;
let cibleY = 200;
let speedH = 0;
let speedV = 0;
const speed = .075;
const maxSpeed = 4;
const minSpeed = .5;
let spaceAuto = true;
let spaceCount = 0;
let moveCible=true;
let hitMove=false;
let hitR = true;
let cursorSpeed = 1.5;
let cursorX = 0;
let pvsInfliges = 0;
let hidCount=0;
let didHit=false;
let timeCount=200;
let ennemiTurn=false;
let arrowX=0;
let pvsPlayer=150;
let currentArrow=0;
let didPunched=false;
let playerPoints = 0;

sigma.style.visibility = "visible";
sigma.style.left = "500px";
hitCursor.style.top = "451px";

cible.style.width="100px";
cible.style.height="100px";

let keys = {};
document.addEventListener("keydown",(event) => {keys[event.key] = true});
document.addEventListener("keyup",(event)=>{keys[event.key]=false});


// let currentHead = Math.floor(Math.random()*6);
let currentHead = 0;

let zoneX=0;
let zoneY=0;
let zoneSize=0;

function defineZone(){
if (currentHead===0){
let side =Math.floor(Math.random()*2);
zoneSize = Math.floor(Math.random()*15)+10;
if (side === 1){
    zoneX = Math.floor(Math.random()*80)+625;
    zoneY = Math.floor(Math.random()*50)+250;
}
else{
    zoneX = Math.floor(Math.random()*60)+625
    zoneY = Math.floor(Math.random()*50)+300
}
}
hitZone.style.left=zoneX+"px";
hitZone.style.top=zoneY+"px";
hitZone.style.width=zoneSize+"px";
hitZone.style.height = zoneSize+"px";
hitZone.style.visibility="visible";
}

function resizeGame(){
    let scaleX = window.innerWidth/WIDTH;
    let scaleY = window.innerHeight/HEIGHT;
    let scale = Math.min(scaleX,scaleY);
    game.style.transform=`translate(-50%, -50%) scale(${scale})`
} 
window.addEventListener("resize",resizeGame);
resizeGame();

function limitSpeed(speed){
    if (speed > 0 && speed<minSpeed){
        return minSpeed;
    }
    else if (speed < 0 && speed>minSpeed){
        return -minSpeed
    }
    return speed;
}
defineZone();

function hit(cibleX,cibleY){
    let realPosCursor = cursorX-75
    let power = 80-Math.abs(realPosCursor)
    let realPosX = cibleX+50;
    let realPosY = cibleY+50;
    let centerX = zoneX+zoneSize/2
    let centerY = zoneY+zoneSize/2
    if (zoneX<realPosX && realPosX<zoneX+zoneSize && zoneY<realPosY && realPosY<zoneY+zoneSize){
        pvsInfliges = Math.abs(power*.75+10)
    }
    else{
        let dist = Math.sqrt((Math.abs(centerX-realPosX)**2)+(Math.abs(centerY-realPosY)**2))
        pvsInfliges = Math.abs((power*.75)/(dist/15))
    }
    pvsEnnemi-=pvsInfliges;
    pvsMis.textContent=Math.floor(pvsInfliges);
    pvsMis.style.left=zoneX+zoneSize+40+"px";
    pvsMis.style.top=zoneY-20+"px";
    pvsMis.style.visibility="visible";
}

function prendDegat(){
    let degatsSubis = Math.abs((arrowX+150)-600)/5+10;
    pvsPlayer -=degatsSubis;
    return degatsSubis;
}

function mainLoop(){
    if (pvsPlayer>0){
    if (moveCible===true){
        if (keys["ArrowUp"]){
            if (speedH>-maxSpeed){
                speedH-=limitSpeed(speed);
            }
        }
        if (keys["ArrowDown"]){
            if (speedH<maxSpeed){
                speedH+=limitSpeed(speed);
            }
        }
        if (keys["ArrowLeft"]){
            if (speedV>-maxSpeed){
                    speedV-=limitSpeed(speed);
                }
        }
        if (keys["ArrowRight"]){
                if (speedV<maxSpeed){
                    speedV+=limitSpeed(speed);
                }
        }
        speedH=Math.max(-maxSpeed,Math.min(maxSpeed,speedH));
        speedV=Math.max(-maxSpeed,Math.min(maxSpeed,speedV));
        if (timeCount>0){
            timeCount-=1;
        }
        else{
            timeCount=200;
            moveCible=false;
            hitMove=true;
            hitBar.style.visibility="visible";
            hitCursor.style.visibility="visible";
            cursorSpeed=1.5;
            cursorX=0;
            hitCursor.style.left="562px";
            cible.style.visibility="hide";
            spaceAuto = false;
        }
    }
    if (keys[" "]){
        if (moveCible===true){
            if (spaceAuto === true){
                moveCible=false;
                hitMove=true;
                hitBar.style.visibility="visible";
                hitCursor.style.visibility="visible";
                cible.style.visibility="hide";
                spaceAuto = false;
            }   
        
        }
        else if (hitMove===true &&spaceAuto===true){
            hit(cibleX,cibleY);
            hitMove=false;
            didHit=true;
        }
    }
    if (spaceAuto===false){
        spaceCount+=1;
        if (spaceCount===20){
            spaceAuto=true;
            spaceCount=0;
        }
    }
    if (didHit===true &&hidCount<100){
        hidCount+=1;
    }
    if (hidCount===100&&didHit===true){
        didHit=false;
        hidCount=0;
        cible.style.visibility="hidden";
        barre.style.visibility="hidden";
        hitCursor.style.visibility="hidden";
        hitZone.style.visibility="hidden";
        pvsMis.style.visibility="hidden";
        ennemiTurn=true;
        currentArrow = Math.floor(Math.random()*4);
        arrow.textContent=arrows[currentArrow];
        arrow.style.left="50px";
        arrowX=0;
        arrow.style.visibility="visible";
        caseV.style.visibility="visible";
        
    }
    if (hitMove===true){
        if (hitR===true){
            cursorX+=cursorSpeed;
        }
        else{
            cursorX-=cursorSpeed;
        }
        cursorSpeed+=.005;
        if (cursorX>=145-cursorSpeed/2){
            hitR=false;
        }
        else if (cursorX<=0+cursorSpeed/2){
            hitR=true;
        }
        hitCursor.style.left=cursorX+560+"px";
    }
    if (moveCible===true){
        cibleX+=speedV;
        cibleY+=speedH;
        cible.style.left = cibleX + "px";
    cible.style.top = cibleY + "px";
    timeBar.style.height=timeCount+"px";
    timeBar.style.top=(200-timeCount)+202+"px";
}

if (ennemiTurn===true){
        if (keys["ArrowUp"]){
            if (pvsPlayer>0){
                ennemiTurn=false;
                if (currentArrow===0){
                    pvsPris.textContent=prendDegat();
                }
                else{
                    pvsPlayer-=75;
                    pvsPris.textContent=75;
                }
                pvsPris.style.visibility="visible";
                didPunched=true;
            }
        }
        if (keys["ArrowDown"]){
            if (pvsPlayer>0){
                ennemiTurn=false;
            if (currentArrow===1){
                pvsPris.textContent=prendDegat();
            }
            else{
                pvsPlayer-=75;
                pvsPris.textContent=75;
            }
            pvsPris.style.visibility="visible";
            didPunched=true;
        }
    }
        if (keys["ArrowLeft"]){
            if (pvsPlayer>0){
                ennemiTurn=false;
                if (currentArrow===2){
                    pvsPris.textContent=prendDegat();
            }
            else{
                pvsPlayer-=75;
                pvsPris.textContent=75;
            }
            pvsPris.style.visibility="visible";
            didPunched=true;
        }
        }
        if (keys["ArrowRight"]){
            if (pvsPlayer>0){
                ennemiTurn=false;
            if (currentArrow===3){
                pvsPris.textContent=prendDegat();
            }
            else{
                pvsPlayer-=75;
                pvsPris.textContent=75;
            }
            pvsPris.style.visibility="visible";
            didPunched=true;
        }
        }
        if (arrowX<500){
            arrowX+=10;
        }
        else{
            arrow.style.visibility="hidden";
            ennemiTurn=false;
            arrowX=0;
            pvsPlayer-=30;
            pvsPris.textContent=30;
            pvsPris.style.visibility="visible";
            didPunched=true;
        }
    }
    if (didPunched===true && hidCount<100){
        hidCount+=1
    }
    if (hidCount===100&&didPunched===true){
        hidCount=0;
        didPunched=false;
        defineZone();
        moveCible=true;
        timeCount=200;
        arrow.style.left="50px";
        cible.style.left="100px";
        speedH=0;
        speedV=0;
        cible.style.visibility="visible";
        caseV.style.visibility="hidden";
        arrow.style.visibility="hidden";
        pvsPris.style.visibility='hidden';
    }
    if (pvsEnnemi<0){
        pvsEnnemi=100;
        playerPoints+=100;
    }
    if (pvsPlayer<=0){

        annonce.textContent="PERDU";
        annonce.style.visibility="visible";
        pvPlayer.style.width="0px";
        voile.style.visibility="visible";
    }
    arrow.style.left=(arrowX+150)+"px";
}
points.textContent=playerPoints+" pts";
points.style.visibility="visible";
requestAnimationFrame(mainLoop);
pvEnnemi.style.width=pvsEnnemi + "px";
pvPlayer.style.width=((pvsPlayer*600)/150)+"px";
}
mainLoop();
