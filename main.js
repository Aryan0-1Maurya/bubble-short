/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

let c, ctx, W, H
let gamePlay = true
let dots = [], booms = [], same = []
let rad, diam
let colors = ['#FF1818', '#F4E104', '#029DFF','#E018FF']
let player, colorPlayer, nbrPlayer = 0
let mouse, touch
let lastTimeCalled
let countPoints = 0, lineEndY = 0, nbrBallsLevel = 4, progress = 0
let checkBoxAudio = false, effetBigBoom = false, move = false
const srcSoundSelect = "https://lolofra.github.io/balls/audio/selected.mp3"
const srcSoundBoom = "https://lolofra.github.io/balls/audio/sbomb.mp3"
const srcSoundEnd = "https://lolofra.github.io/balls/audio/end.mp3"
const srcSoundBigBoom = "https://lolofra.github.io/balls/audio/bigBoom.mp3"

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const calcFPS = () => {
    let dt = performance.now() - lastTimeCalled;
    lastTimeCalled = performance.now()
    Fps.innerText = "fps: " + Math.round(1000 / dt);
}

class DotS{
    constructor(x,y,rad,mq){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.mq = mq;
    }
}

class Dot extends DotS{
    constructor(x,y,rad,mq,boom) {
        super(x,y,rad,mq);
        this.c = colors[mq]
        this.boom = boom || false
        this.nextY = y
        this.isolate = false
        this.speed = 0.5
    }
    fall() {
        if(this.y<=this.nextY)this.y += this.speed
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle =  this.color
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()     
    }
    update() {
        this.color = radColor(this.x,  this.y-rad/2, 0, this.x,  this.y, diam, this.c)
        this.fall()
        this.draw()
    }
}

class Player extends DotS{
    constructor(x,y,rad,mq,boom) {
        super(x,y,rad,mq);
        this.c = colors[mq]
        this.play = false
        this.run = false
        this.t = 0
    }
    update() {
        this.color = radColor(this.x,  this.y-rad/2, 0, this.x,  this.y, diam, this.c)
        ctx.beginPath()
        ctx.fillStyle =  this.color
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
}
class Boom {
    constructor(x,y,rad,color) {
        this.x = x
        this.y = y
        this.rad = rad
        this.color = color
        this.a = random(2*Math.PI)
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle =  this.color
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()     
    }
    update() {
        this.x += 2*Math.cos(this.a)
        this.y += 2*Math.sin(this.a)
        this.draw()
    }
}
const eventsListener = () => {
    mouse = {
        x: null,
        y: null
    };
     touch = {
        x: null,
        y: null
    };
    c.addEventListener("mousemove", function(event){
        event.preventDefault();
        if(move){
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        }
        else{
            mouse.x = null;
            mouse.y = null;
        }
    });
    c.addEventListener("mousedown", function(event){
        move=true;
        mouse.x = event.clientX;
        mouse.y = event.clientY;

    });
    c.addEventListener("mouseup", function(){          
        if(player.play == false&&mouse.y<H-rad*2.5){
            player.run = true  
            player.play = true
            let dx = player.x - mouse.x;
            let dy = player.y - mouse.y;
            let t = Math.atan2(-dy, -dx); 
            player.t = t
        }
        move=false;
        mouse.x = null;
        mouse.y = null;

        
    });
    c.addEventListener("touchstart", function(event){
        let touch = event.changedTouches[0];
        let touchX = parseInt(touch.clientX);
        let touchY = parseInt(touch.clientY);
        mouse.x = touchX-c.offsetLeft;
        mouse.y = touchY-c.offsetTop;
        move=true;
    });
    c.addEventListener("touchmove", function(event){
        if(move){
            let touch = event.changedTouches[0];
            let touchX = parseInt(touch.clientX);
            let touchY = parseInt(touch.clientY);
            mouse.x = touchX-c.offsetLeft;
            mouse.y = touchY-c.offsetTop;
        }
    });
    c.addEventListener("touchend", function(){
        if(player.play == false&&mouse.y<H-rad*2.5){
            player.run = true  
            player.play = true
            let dx = player.x - mouse.x;
            let dy = player.y - mouse.y;
            let t = Math.atan2(-dy, -dx); 
            player.t = t
        }
        mouse.x = null;
        mouse.y = null;
        move=false;  
    });
    checkbowaudio.addEventListener("click", function(){
        checkBoxAudio = checkBoxAudio ? false: true
        if(checkBoxAudio){
            checkbowaudio.innerHTML = `<i class="fas fa-volume-up"></i>`
        }
        else{
            checkbowaudio.innerHTML = `<i class="fas fa-volume-mute"></i>`
        }
    });
};

const radColor = (x0, y0, r0, x1, y1, r1, c) => {
    let NG = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        NG.addColorStop(0, c);
        NG.addColorStop(0.9, 'black');
        NG.addColorStop(1, 'black');
    return NG;
};


const checkColor = () => {
    for(let i = 0; i<same.length; i++){
        for(let j = 0; j<dots.length; j++){
            if(same[i]!=dots[j] && same[i].mq == dots[j].mq && dots[j].boom == false){
                let d0 = Math.hypot(same[i].x - dots[j].x, same[i].y - dots[j].y )
                if(d0<diam*1.4+1){
                    dots[j].boom = true
                    same.push(dots[j])
                    checkColor()
                    break
                }                              
            }           
        }
    }    
}

const checkPlayer = () => {
    checkEndGame()    
    if(player.run){
        if (player.y<rad){
            player.run = false
            let arr = []
            for(let x=-rad*5+nextRow; x<W-rad;x+=diam+1){
                if(x>rad)arr.push(x)
            }
            for(let n=0;n<arr.length;n++){
                let d = Math.abs(arr[n] - player.x)
                if(d<rad)player.x = arr[n]
            }    
            dots.push(new Dot(player.x, rad+2,rad,player.mq, true))
            player.y = -H/2
            setTimeout(()=>{
                newPlayer()
                nbrPlayer++
            },15)            
        }
        for(let i = 0; i <dots.length; i++){
            same = []        
            dots[i].boom = false
            let d0 = Math.hypot(player.x - dots[i].x, player.y - dots[i].y ) 
            
            if(d0<diam+2&&!dots[i].isolate){
                player.run = false
                let dx = player.x - dots[i].x;
                let dy = player.y - dots[i].y;
                let t = Math.atan2(-dy, -dx); 
                player.x = dots[i].x - (diam+2)*Math.cos(t) 
                player.y = dots[i].y - (diam+2)*Math.sin(t)
                
                //setTimeout(()=>{    
                    if(dots[i]){        
                        dots.push(new Dot(player.x, player.y,rad,player.mq, true))
                        player.y = -H/2
                        same.push(dots[dots.length-1])                       
                        checkColor()
                
                        let cpt = 0
                        for(let d = 0; d<dots.length; d++){
                            if(dots[d].boom == true)cpt++    
                        }
                        if(cpt<3&&checkBoxAudio){
                            createjs.Sound.play('soundball')    
                        }

                        if(cpt>2){
                            for(let b = dots.length-1; b>=0; b--){
                                if(dots[b].boom == true){
                                    for(let n=0;n<10;n++){
                                        booms.push(new Boom(dots[b].x, dots[b].y, dots[b].rad/2, colors[dots[b].mq]  ))
                                    }                                      
                                    dots.splice(dots.indexOf(dots[b]), 1);
                                    countPoints++
                                    info.innerText = countPoints
                                    info.style.fontSize = '2em'
                                }                                     
                            }    

                            checkDotsIsolate(false)
                            checkDotsIsolate(true)

                            info.style.color = '#29F000'
                            setTimeout(()=>{
                                info.style.color = 'white'
                                info.style.fontSize = '1.5em'
                            },20)

                            if(cpt>6){
                                effetBigBoom = true
                                countPoints+=10
                                info.innerText = countPoints
                                setTimeout(()=>{
                                    effetBigBoom = false    
                                    progress = 0                                      
                                },1000)        
                                if(checkBoxAudio)createjs.Sound.play('soundbigboom')    
                            }
                            else{
                                if(checkBoxAudio)createjs.Sound.play('soundboom')             
                            }
                                               
                        }
                        if(countPoints>100)nbrBallsLevel = 3
                        //if(countPoints>200)nbrBallsLevel = 2
                        //if(countPoints>300)nbrBallsLevel = 1
                         
                    }                                                            
                //},10)

                if(nbrPlayer>=nbrBallsLevel){
                    setTimeout(()=>{
                        newRow()
                        for(let f=0;f<dots.length;f++){
                            if(!dots[f].isolate)dots[f].nextY = dots[f].y+diam-2
                        }        
                    },15)

                    setTimeout(()=>{
                        newPlayer()
                        nbrPlayer=0                                                              
                    },2000)
                }
                else{
                    setTimeout(()=>{
                        newPlayer()
                        nbrPlayer++
                    },150)
                }
                break                               
            }              
        }    
    }
    if(player.run){
        if(player.x<rad||player.x>W-rad) player.t = Math.PI-player.t  
        player.x = player.x + 10*Math.cos(player.t) 
        player.y = player.y + 10*Math.sin(player.t) 
    }
    
}

let nextRow = 0
const newRow = () => {
    for(let x=-rad*5+nextRow; x<W-rad;x+=diam+1){
        let px = x+(diam+1)*Math.cos(Math.PI*1.66)
        let y = rad+(diam+1)*Math.sin(Math.PI*1.66)
        let nC = ~~random(colors.length)            
        if(px>rad&&px<W-rad)dots.push(new Dot(px,y,rad,nC))
    }    
    nextRow = nextRow == 0? rad : 0
}

const drawLineShoot = () => {
    if(move&&!player.run&&!player.play&&mouse.y<H-rad*2.5){
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'
        ctx.lineWidth = 1
        ctx.moveTo(player.x, player.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
        ctx.closePath()
    }
}

const drawLineEnd = () =>{
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = 2
    ctx.moveTo(0,lineEndY)
    ctx.lineTo(W, lineEndY)
    ctx.stroke()
    ctx.closePath()
}
const blastRings = (x, y, radius, lw, color) => {
    if(radius < 0) radius = 0;
    ctx.beginPath();
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.arc(x, y, radius + 30, 0, Math.PI * 2, false);
    ctx.stroke();
}

const blastStar = (x, y, sizeFont, a) => {
    this.x = x + progress/2 *Math.cos(a)
    this.y = y + progress/2 *Math.sin(a)
    ctx.beginPath();
    ctx.font = sizeFont + "px Arial";
    ctx.fillStyle = 'white'
    ctx.fillText('⭐️', this.x  ,this.y );
}

const createEffet = () => {
    progress+=15;
    blastRings(W/2, H/2, progress, 10, "white");
    blastRings(W/2, H/2, progress - 30, 15, "yellow");
    blastRings(W/2, H/2, progress - 50, 20, "orange");
    blastRings(W/2, H/2, progress - 100, 30, "red");
    for(let i=0;i<Math.PI*2;i+=Math.PI/8){
        blastStar(W/2, H/2, rad, i)
    }
}
const createBall = () => {        
    rad = W/16-0.01
    diam = rad*2  
    lineEndY = H-1.7*diam
    for(let x =-rad*5; x<W-rad;x+=diam+1){
        let nC = ~~random(colors.length)    
        if(x>rad&&x<W-rad)dots.push(new Dot(x,rad,rad,nC))
        let y = 0
        for(n=1;n<4;n++){                  
            let px = x+(diam+1)*n*Math.cos(Math.PI/3)
            y = rad+(diam+1)*n*Math.sin(Math.PI/3)
            nC = ~~random(colors.length)
            if(px>rad&&px<W-rad)dots.push(new Dot(px,y,rad,nC))
        }        
    }    
}
const newPlayer = () => {
    player = new Player(W/2,H-rad*2,rad,~~random(colors.length))
}

const animBooms = () => {
    for(let i = booms.length-1; i>=0; i--){
        booms[i].update()
        booms[i].rad-=0.5
        if(booms[i].rad <=0.6)booms.splice(i, 1);                                    
    } 
}

const checkDotsIsolate = (counter) => {
    for(let i = 0; i<dots.length; i++){
        let countCol = 0
        let arr = []
        for(let j = 0; j<dots.length; j++){
            let d = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y )     
            if(i!=j&&d<diam*1.2){
                countCol++
                arr = []
                arr.push(j)
            }                
        } 
        if(countCol==1){
            let countCol2 = 0 
            for(let j = 0; j<dots.length; j++){
                let d = Math.hypot(dots[arr[0]].x - dots[j].x, dots[arr[0]].y - dots[j].y )                         
                if(j!=arr[0] && j!=i && d<diam*1.2) countCol2++                 
            } 
            if(countCol2==0&&dots[arr[0]].y>rad*1.5){
                dots[arr[0]].isolate = true     
            }        
        } 
        if(countCol==0&&dots[i].y>rad*1.5){
            dots[i].isolate = true     
        }                       
    } 

    for(let i = 0; i<dots.length; i++){
        if(dots[i].isolate == true){
            dots[i].nextY = H
            dots[i].speed = 7
            if(counter)countPoints++
        }                                      
    }
    info.innerText = countPoints 
}

const checkEndGame = () => {
    for(let i = 0; i <dots.length; i++){
        if(dots[i].y+rad>=lineEndY&&!dots[i].isolate){
            gamePlay = false
            endGame()
            break
        }
        if(dots[i].y+rad>=lineEndY&&dots[i].isolate){
            dots.splice(i, 1);             
        }    
    }
}

const endGame = () => { 
    if(checkBoxAudio)createjs.Sound.play('soundend') 
    endgame.style.display =  "flex" 
    score.innerText = "score : " + countPoints
    setTimeout(()=>{
        endgame.style.display =  "none"
        newGame()
        gamePlay = true
    },3000)
}

const newGame = () => {
    dots = []
    nbrPlayer = 0
    countPoints = 0
    info.innerText = countPoints
    newPlayer()
    createBall()
}

const animate = () => {
    if(gamePlay){
        ctx.clearRect(0,0,W,H)
        calcFPS()
        drawLineEnd()
        dots.map(x=>x.update())
        drawLineShoot()
        checkPlayer()    
        player.update()
        animBooms()
        if(effetBigBoom)createEffet()
    }
    requestAnimationFrame(animate)    
}

const loadAudio = () => {
    createjs.Sound.registerSound(srcSoundSelect, 'soundball');
    createjs.Sound.registerSound(srcSoundBoom, 'soundboom');
    createjs.Sound.registerSound(srcSoundEnd, 'soundend');
    createjs.Sound.registerSound(srcSoundBigBoom, 'soundbigboom');
}

const initWidthHeight = () => {
    c.width = W = innerWidth 
    c.height = H = innerHeight
    if(innerWidth > innerHeight){
            c.width = W = innerHeight*0.6
            container.style.width = W + "px"
        }
}

const init = () => {
    c = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    initWidthHeight()    
    loadAudio()
    createBall()
    eventsListener()
    newPlayer()    
    requestAnimationFrame(animate)
}

window.onload = init


/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/