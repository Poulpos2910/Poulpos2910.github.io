let heads = ["sigma","donald","terminator","gros","militaire","natha"];
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

let pvsEnnemi = 100
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

sigma.style.visibility = "visible";
sigma.style.left = "500px";
hitCursor.style.top = "451px";

cible.style.width="100px";
cible.style.height="100px";

let keys = {};
document.addEventListener("keydown",(event) => {keys[event.key] = true});
document.addEventListener("keyup",(event)=>{keys[event.key]=false});

// let currentHead = Math.floor(Math.random()*6);
// console.log(currentHead , heads[currentHead]);
let currentHead = 0;

let zoneX=0;
let zoneY=0;
let zoneSize=0;
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

function limitSpeed(speed){
    if (speed > 0 && speed<minSpeed){
        return minSpeed;
    }
    else if (speed < 0 && speed>minSpeed){
        return -minSpeed
    }
    return speed;
}

function hit(cibleX,cibleY){
    let realPosCursor = cursorX-75
    let power = 80-Math.abs(realPosCursor)
    let realPosX = cibleX+50;
    let realPosY = cibleY+50;
    let centerX = zoneX+zoneSize/2
    let centerY = zoneY+zoneSize/2
    console.log(realPosX,realPosY,zoneX,zoneY,zoneSize)
    if (zoneX<realPosX && realPosX<zoneX+zoneSize && zoneY<realPosY && realPosY<zoneY+zoneSize){
        console.log("perfect "+power+" "+cursorX)
        pvsInfliges = Math.abs(power*.75+10)
    }
    else{
        console.log("rate")
        let dist = Math.sqrt((Math.abs(centerX-realPosX)**2)+(Math.abs(centerY-realPosY)**2))
        console.log("distance : "+dist)
        pvsInfliges = Math.abs((power*.75)/(dist/10))
    }
    pvsEnnemi-=pvsInfliges;
    console.log("pvs " + pvsInfliges)
    pvEnnemi.style.width=pvsEnnemi + "px";
    pvsMis.textContent=Math.floor(pvsInfliges)
    pvsMis.style.left=zoneX+zoneSize+40+"px"
    pvsMis.style.top=zoneY-20+"px"
    pvsMis.style.visibility="visible";
}

function mainLoop(){
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
            cible.style.visibility="hide";
            spaceAuto = false;
        }
    }
    if (keys[" "]){
        if (moveCible===true){
            if (pvsEnnemi>0 && spaceAuto === true){
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
    if (hidCount===100){
        didHit=false;
        hidCount=0;
        cible.style.visibility="hidden";
        barre.style.visibility="hidden";
        hitCursor.style.visibility="hidden";
        hitZone.style.visibility="hidden";
        pvsMis.style.visibility="hidden";
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
    requestAnimationFrame(mainLoop);
}
mainLoop();