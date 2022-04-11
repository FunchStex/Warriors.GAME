var clock=null;
var start = false;

function bool(){
    document.getElementById("startbutton").classList.remove('bottone');
    document.getElementById("startbutton").classList.add('bottonen');
    console.log("bottone rimosso");

    init();
}

let scene, camera, point, point2, renderer, tastiera, acc = 0.02, dec = 0.0001;
var tasto, posizione=[0,0], velocity=[0,0], velocity2=[0,0], posizione2=[0,0];
var local= new Player();
local.id = Math.floor(Math.random()*50);
//var Per=new Player();

function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.TextureLoader().load('texture/bg.png');;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer(); //Imposto come motore di render il motore web
    renderer.setSize(window.innerWidth, window.innerHeight); //imposto la dimensione del render
    document.body.appendChild(renderer.domElement);

    texture = new THREE.TextureLoader().load('texture/textureFin2.png');
    pointGeo = new THREE.PlaneGeometry(0.1, 0.1);
    pointMaterial = new THREE.MeshBasicMaterial({map: texture});

    point = new THREE.Mesh(pointGeo, pointMaterial);
    point2 = new THREE.Mesh(pointGeo, pointMaterial);
    
    //scene.add(point);
    //scene.add(point2);
    console.log("punto aggiunto");

    point.position.set(1, 0, -1);
    point2.position.set(-1, 0 ,-1);

    local.posizione = [point.position.x, point.position.y];
    posizione2 = [point2.position.x, point2.position.y];

    render();
}      

function render(){
    movement();
    collider();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    if(clock==null)
        clock=setTimeout(call,100);
    //point2.position.set(-1,0,-1);
}

function movement(){
    //campo
    if(local.posizione[0]< -2.7 || local.posizione[0]> 2.8){
        local.velocity[0]=0;
        local.velocity[1]=0;
        if(local.posizione[0]< -2.7){
            local.velocity[0] += acc;
        }
        else{
            local.velocity[0] -= acc;
        }
    };
    if(local.posizione[1]< -1.25 || local.posizione[1]> 1.1){
        local.velocity[0]=0; 
        local.velocity[1]=0;
        if(local.posizione[1]< -1.2){
            local.velocity[1] += acc;
        }
        else{
            local.velocity[1] -= acc;
        }
    };
    //direzione
    document.onkeydown = function(tastiera){
        tasto=tastiera.keyCode;
        switch(tastiera.keyCode){
            case 87:
                local.velocity[1] += acc;
                break;
            case 83:
                local.velocity[1] -= acc;
                break;
            case 65: 
                local.velocity[0] -= acc;
                break;
            case 68: 
                local.velocity[0] += acc;
                break;
            case 81:
                local.velocity[0] -= acc/2;
                local.velocity[1] += acc/2;
                break;
            case 69:
                local.velocity[0] += acc/2;
                local.velocity[1] += acc/2;
                break;
            case 90:
                local.velocity[0] -= acc/2;
                local.velocity[1] -= acc/2;
                break;
            case 67:
                local.velocity[0] += acc/2;
                local.velocity[1] -= acc/2;
                break;
        }
        //console.log(velocity);
    }
    //movimento
    switch(tasto){
        case 87:
            local.velocity[0] = 0;
            local.posizione[1] += local.velocity[1];   
            if(local.velocity[1]>0){local.velocity[1] -= dec};
            if(local.velocity[1]<0.002 && local.velocity[1]>0){local.velocity[1]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
        case 83: 
            local.velocity[0] = 0;
            local.posizione[1] +=local.velocity[1];
            if(local.velocity[1]<0){local.velocity[1] += dec};
            if(local.velocity[1]<0.002 && local.velocity[1]>0){local.velocity[1]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
        case 65:
            local.velocity[1] = 0; 
            local.posizione[0] += local.velocity[0];
            if(local.velocity[0]<0){local.velocity[0] += dec};
            if(local.velocity[0]<0.002 && local.velocity[0]>0){local.velocity[0]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
        case 68: 
            local.velocity[1] = 0;
            local.posizione[0] += local.velocity[0];
            if(local.velocity[0]>0){local.velocity[0] -= dec};
            if(local.velocity[0]<0.002 && local.velocity[0]>0){local.velocity[0]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            //funzione che aggiorna le variabili su host agg(poszione[],velocita[],player,life,)
            break;
        case 81:
            local.posizione[0] += local.velocity[0];
            local.posizione[1] += local.velocity[1];
            if(local.velocity[1]>0){local.velocity[1] -= dec};
            if(local.velocity[1]<0.002 && local.velocity[1]>0){local.velocity[1]=0};
            if(local.velocity[0]<0){local.velocity[0] += dec};
            if(local.velocity[0]<0.002 && local.velocity[0]>0){local.velocity[0]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
        case 69:
            local.posizione[0] +=local.velocity[0];
            local.posizione[1] += local.velocity[1];
            if(local.velocity[1]>0){local.velocity[1] -= dec};
            if(local.velocity[1]<0.002 && local.velocity[1]>0){local.velocity[1]=0};
            if(local.velocity[0]>0){local.velocity[0] -= dec};
            if(local.velocity[0]<0.002 && local.velocity[0]>0){local.velocity[0]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
        case 90:
            local.posizione[0] += local.velocity[0];
            local.posizione[1] += local.velocity[1];
            if(local.velocity[0]<0){local.velocity[0] += dec};
            if(local.velocity[0]<0.002 && local.velocity[0]>0){local.velocity[0]=0};
            if(local.velocity[1]<0){local.velocity[1] += dec};
            if(local.velocity[1]<0.002 && local.velocity[1]>0){local.velocity[1]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
        case 67:
            local.posizione[0] += local.velocity[0];
            local.posizione[1] += local.velocity[1];
            if(local.velocity[0]>0){local.velocity[0] -= dec};
            if(local.velocity[0]<0.002 && local.velocity[0]>0){local.velocity[0]=0};
            if(local.velocity[1]<0){local.velocity[1] += dec};
            if(local.velocity[1]<0.002 && local.velocity[1]>0){local.velocity[1]=0};
            point.position.set(local.posizione[0], local.posizione[1]);
            break;
    }
}

//Da aggiustare in alcuni casi non funziona devo ancora capire il perchè
function collider(){
    var dis = Math.sqrt(Math.pow(point.position.x-point2.position.x, 2)+Math.pow(point.position.y-point2.position.y, 2));

    if(dis < 0.05 && ((Math.abs(local.velocity[0]) > Math.abs(velocity2[0])) || (Math.abs(local.velocity[1]) > Math.abs(velocity2[1])))){
        scene.remove(point2);
        console.log("punto rimosso");
    }
    else if(dis < 0.05 && ((Math.abs(local.velocity[0]) < Math.abs(velocity2[0])) || (Math.abs(local.velocity[1]) < Math.abs(velocity2[1])))){
        scene.remove(point);
        console.log("punto rimosso");
            //funzione che aggiorna le variabili su host agg(poszione[],velocita[],player,!life,)if hasautorithy
    }
}
