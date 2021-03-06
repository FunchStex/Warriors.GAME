      //#region classi
      class Player {
        constructor(posizione, velocity, id, apple) {
          this.posizione = [0, 0];
          this.velocity = [0, 0];
          this.id;
          this.vivo = 2;
          this.apple=false;
        }
      }

      var appleGeometry, appleTexture, appleMaterial, apple, json, applex, aplley;

      //#endregion

      //#region variabili
      var oReq = null;
      var numPlayer;
      let texture, pointGeo, pointMaterial;
      texture = new THREE.TextureLoader().load("texture/textureFin2.png");
      pointGeo = new THREE.PlaneGeometry(0.1, 0.1);
      pointMaterial = new THREE.MeshBasicMaterial({ map: texture });

      appleTexture = new THREE.TextureLoader().load('texture/mela.png');
      appleGeometry = new THREE.PlaneGeometry(0.1, 0.1);
      appleMaterial = new THREE.MeshBasicMaterial({map:appleTexture, transparent: true, depthWrite: true});


      var point_=Array.of(new THREE.Mesh(pointGeo, pointMaterial));

 
      var apple = [new THREE.Mesh(appleGeometry, appleMaterial),
                    new THREE.Mesh(appleGeometry, appleMaterial),
                    new THREE.Mesh(appleGeometry, appleMaterial)];

      let scene,
        camera,
        point2,
        renderer,
        tastiera,
        acc = 0.02,
        dec = 0.0001;
      var tasto,
        posizione = [0, 0],
        velocity = [0, 0],
        velocity2 = [0, 0],
        posizione2 = [0, 0];
      var token = 200;
      var local = new Player();
      local.id = token;
      var clock = null;
      var start = false;
      var tick=true;
      var pers;
      var idp;
      var ricevuto=0;


      //#endregion

      //#region invia pachetto
      function call() {
        oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("POST", "http://192.168.100.73:8000/", true);
        oReq.setRequestHeader("Content-Type", "application/json");
        var _data = JSON.stringify(local);
        oReq.send(_data);
        clock = null;
      }

      function reqListener() {
        json = JSON.parse(oReq.response);
        //assegna token
        if (local.id == token) {
          ricevuto++;
          if(tick){
            local.id = json[token].persone;
            pers=json[token].persone
            ricevuto=true;
            idp=local.id;
            tick=false
          }
        }
        local.vivo=json[idp].vivo;
        //aggiungi persona 
        if(json[1]!==undefined){
          if(pers!=json[1].persone){
            addpoint(); 
          }
          if(json[1].persone>1)
            addpointIngame();
        }else addpointlocal();




        //cambia poszione
        for(var i=1;i<=pers;i++){
          point_[i-1].position.set(json[i].posizione[0],json[i].posizione[1],-1);
        }
        for(var i=1;i<=pers;i++){
          if(json[i].vivo <= 0){point_[i-1].position.set(100, 100, -1);scene.remove(point_[i-1])};
          if(local.vivo<=0){local.posizione[0]=100;local.posizione[1]=100}
          if(json[idp].vivo != local.vivo){local.vivo=json[idp].vivo};    
        }
        
        //aggiungi mele
        for(var i = 100; i<=102; i++){
          if(json[i]!==undefined){
            apple[i-100].position.set(json[i].posizione[0], json[i].posizione[1], -1);
            scene.add(apple[i-100]);
          }
        }

      }
      function playerPrediction(){
        for(var i=1;i<=pers+1;i++){
          if(i != idp&&json[i]!==undefined){
            point_[i-1].position.set(point_[i-1].position.x+json[i].velocity[0],point_[i-1].position.y+json[i].velocity[1],-1);
          }
        }
      }
    
    function addpoint(){

        for(var i=1;i<=json[1].persone;i++){
            point_.push(new THREE.Mesh(pointGeo, pointMaterial))
            point_[i-1].position.z=-1;
            scene.add(point_[i-1]);     
            pers=json[1].persone;      
          
        }
      }
      function addpointIngame(){
        for(var i=0;i<json[1].persone;i++){
          point_.push(new THREE.Mesh(pointGeo, pointMaterial))
          point_[i].position.z=-1;
          scene.add(point_[i]);     
        }
      }
      function addpointlocal(){
        for(var i=0;i<=pers;i++)point_.push(new THREE.Mesh(pointGeo, pointMaterial))
        point_[idp-1].position.z=-1;
        scene.add(point_[idp-1]);     
                  
      }
      //#endregion
      //#region set postion for all player

      //#endregion


            //#region avvia game
            function bool() {
                document.getElementById("startbutton").classList.remove("bottone");
                document.getElementById("startbutton").classList.add("bottonen");
                console.log("bottone rimosso");
                call();
                setTimeout(init, 1000);
              }
              //#endregion
        
              //#region init
              function init() {
                scene = new THREE.Scene();
                scene.background = new THREE.TextureLoader().load("texture/bg.png");
                camera = new THREE.PerspectiveCamera(
                  75,
                  window.innerWidth / window.innerHeight,
                  1,
                  1000
                );
                camera.position.z = 1;
        
                renderer = new THREE.WebGLRenderer(); //Imposto come motore di render il motore web
                renderer.setSize(window.innerWidth, window.innerHeight); //imposto la dimensione del render
                document.body.appendChild(renderer.domElement);
                point_.push(new THREE.Mesh(pointGeo, pointMaterial))
                point_[0].position.set(0, 0, -1);
        
                posizione2 = [point_[1].position.x, point_[1].position.y];
                addpointlocal();
                render();
              }
              //#endregion
        
              //#region render
              function render() {
                movement();
                renderer.render(scene, camera);
                if (clock == null){
                  clock = setTimeout(call, 50); 
                } 
        
                document.getElementById('vis_vite').innerHTML = "Vite: " + local.vivo;
        
        
                playerPrediction();
                requestAnimationFrame(render);
              }
              //#endregion
        
              //#region movment
              function movement() {
                //campo
                if (local.posizione[0] < -2.7 || local.posizione[0] > 2.8) {
                  local.velocity[0] = 0;
                  local.velocity[1] = 0;
                  if (local.posizione[0] < -2.7) {
                    local.velocity[0] += acc;
                  } else {
                    local.velocity[0] -= acc;
                  }
                }
                if (local.posizione[1] < -1.25 || local.posizione[1] > 1.1) {
                  local.velocity[0] = 0;
                  local.velocity[1] = 0;
                  if (local.posizione[1] < -1.2) {
                    local.velocity[1] += acc;
                  } else {
                    local.velocity[1] -= acc;
                  }
                }
                //direzione
                document.onkeydown = function (tastiera) {
                  tasto = tastiera.keyCode;
                  switch (tastiera.keyCode) {
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
                      local.velocity[0] -= acc / 2;
                      local.velocity[1] += acc / 2;
                      break;
                    case 69:
                      local.velocity[0] += acc / 2;
                      local.velocity[1] += acc / 2;
                      break;
                    case 90:
                      local.velocity[0] -= acc / 2;
                      local.velocity[1] -= acc / 2;
                      break;
                    case 67:
                      local.velocity[0] += acc / 2;
                      local.velocity[1] -= acc / 2;
                      break;
                  }
                  //console.log(velocity);
                };
                //movimento
                switch (tasto) {
                  case 87:
                    local.velocity[0] = 0;
                    local.posizione[1] += local.velocity[1];
                    if (local.velocity[1] > 0) {
                      local.velocity[1] -= dec;
                    }
                    if (local.velocity[1] < 0.002 && local.velocity[1] > 0) {
                      local.velocity[1] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                  case 83:
                    local.velocity[0] = 0;
                    local.posizione[1] += local.velocity[1];
                    if (local.velocity[1] < 0) {
                      local.velocity[1] += dec;
                    }
                    if (local.velocity[1] < 0.002 && local.velocity[1] > 0) {
                      local.velocity[1] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                  case 65:
                    local.velocity[1] = 0;
                    local.posizione[0] += local.velocity[0];
                    if (local.velocity[0] < 0) {
                      local.velocity[0] += dec;
                    }
                    if (local.velocity[0] < 0.002 && local.velocity[0] > 0) {
                      local.velocity[0] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                  case 68:
                    local.velocity[1] = 0;
                    local.posizione[0] += local.velocity[0];
                    if (local.velocity[0] > 0) {
                      local.velocity[0] -= dec;
                    }
                    if (local.velocity[0] < 0.002 && local.velocity[0] > 0) {
                      local.velocity[0] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    //funzione che aggiorna le variabili su host agg(poszione[],velocita[],player,life,)
                    break;
                  case 81:
                    local.posizione[0] += local.velocity[0];
                    local.posizione[1] += local.velocity[1];
                    if (local.velocity[1] > 0) {
                      local.velocity[1] -= dec;
                    }
                    if (local.velocity[1] < 0.002 && local.velocity[1] > 0) {
                      local.velocity[1] = 0;
                    }
                    if (local.velocity[0] < 0) {
                      local.velocity[0] += dec;
                    }
                    if (local.velocity[0] < 0.002 && local.velocity[0] > 0) {
                      local.velocity[0] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                  case 69:
                    local.posizione[0] += local.velocity[0];
                    local.posizione[1] += local.velocity[1];
                    if (local.velocity[1] > 0) {
                      local.velocity[1] -= dec;
                    }
                    if (local.velocity[1] < 0.002 && local.velocity[1] > 0) {
                      local.velocity[1] = 0;
                    }
                    if (local.velocity[0] > 0) {
                      local.velocity[0] -= dec;
                    }
                    if (local.velocity[0] < 0.002 && local.velocity[0] > 0) {
                      local.velocity[0] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                  case 90:
                    local.posizione[0] += local.velocity[0];
                    local.posizione[1] += local.velocity[1];
                    if (local.velocity[0] < 0) {
                      local.velocity[0] += dec;
                    }
                    if (local.velocity[0] < 0.002 && local.velocity[0] > 0) {
                      local.velocity[0] = 0;
                    }
                    if (local.velocity[1] < 0) {
                      local.velocity[1] += dec;
                    }
                    if (local.velocity[1] < 0.002 && local.velocity[1] > 0) {
                      local.velocity[1] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                  case 67:
                    local.posizione[0] += local.velocity[0];
                    local.posizione[1] += local.velocity[1];
                    if (local.velocity[0] > 0) {
                      local.velocity[0] -= dec;
                    }
                    if (local.velocity[0] < 0.002 && local.velocity[0] > 0) {
                      local.velocity[0] = 0;
                    }
                    if (local.velocity[1] < 0) {
                      local.velocity[1] += dec;
                    }
                    if (local.velocity[1] < 0.002 && local.velocity[1] > 0) {
                      local.velocity[1] = 0;
                    }
                    point_[idp-1].position.set(local.posizione[0], local.posizione[1]);
                    break;
                }
              }
        
              //#endregion movment