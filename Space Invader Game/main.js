
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#canva');
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

let score = 0; // Initial score
let gameRunning = true; // State of the game loop

function updateScore(points) {
    score += points; // Update score by points
    document.getElementById('score').innerText = `Score: ${score}`; // Update score display
}


// Function to add a star
function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.1, 24, 24);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}
// Add 1000 stars
Array(1000).fill().forEach(addStar);

// Add Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5); // Position the light
scene.add(directionalLight);

const blocks = [];
const aliens = [];
const lasers= [];

const blockPositions = [-5, -3, -1, 1, 3, 5 ]; // Example positions for blocks along the x-axis
blockPositions.forEach(x => {
  const block = createBlockShape(x, 0, 0); // Keeping y constant for a straight line, adjust as needed
  scene.add(block);
  blocks.push(block);
});


function createBlockShape(x, y, z) {
  // Create a shape
  const shape = new THREE.Shape();
  shape.moveTo(-0.3, -1.7); // Move to the first point
  shape.lineTo(0.3, -1.7);  // Line to the next point
  shape.lineTo(0.6, -1.85);
  shape.lineTo(0.6, -2.15);
  shape.lineTo(0.3, -2.15);
  shape.lineTo(0.3, -2.075);
  shape.lineTo(-0.3, -2.075);
  shape.lineTo(-0.3, -2.15);
  shape.lineTo(-0.6, -2.15);
  shape.lineTo(-0.6, -1.85);
  shape.lineTo(-0.3, -1.7); // Close the path

  // Define extrusion settings
  const extrudeSettings = {
    steps: 1,
    depth: 0.2,  // Define the depth of the extrusion
    bevelEnabled: false  // No bevel for simplicity
  };

  // Extrude the shape to create a 3D geometry
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Material
  const material = new THREE.MeshBasicMaterial({ color: 0x36a0a9, side: THREE.DoubleSide });

  // Create a mesh
  const block = new THREE.Mesh(geometry, material);

  // Position the block
  block.position.set(x, y, z);

  return block;
}

  const cannon = createCannonShape(0,-4,0);
  // Cannon movement
  function moveCannon(event) {
    if (event.key === 'ArrowLeft') {
      cannon.position.x -= 0.2;
    } 
    else if (event.key === 'ArrowRight') {
      cannon.position.x += 0.2;
    }
    else if (event.key === 'ArrowUp') {
        cannon.position.y += 0.2;
     }
      else if (event.key === 'ArrowDown') {
        cannon.position.y -= 0.2;
    } else if (event.key === ' ') {
      shootLaser();
    }
  }

function createLaser() {
  const geometry = new THREE.SphereGeometry(0.08,32,16); // Small sphere as laser
  const material = new THREE.MeshBasicMaterial({ color: 0x22c1dd }); // Red color
  const laser = new THREE.Mesh(geometry, material);
  laser.userData.type = 'cannon'; // Identify as cannon laser
  laser.rotation.x = Math.PI / 2; // Orient the cylinder to point out of the cannon
  return laser;
}

function createAlienLaser(x, y, z) {
  const geometry = new THREE.SphereGeometry(0.08, 32, 16); // Small sphere as laser
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  const laser = new THREE.Mesh(geometry, material);
  laser.userData.type = 'alien'; // Identify as alien laser
  laser.position.set(x, y - 0.2, z); // Position slightly below the alien
  return laser;
}

// Function to start automatic shooting
function startAutomaticShooting() {
  const shootingInterval = 300; // 

  setInterval(() => {
      shootLaser();
  }, shootingInterval);
}
// Ensure this function is called after the cannon and scene have been initialized
startAutomaticShooting();

function startAlienShooting() {
  const shootingInterval = 300; // Alien shoots every 1000 ms (1 second)

  setInterval(() => {
    if (aliens.length > 0) {
      const randomIndex = Math.floor(Math.random() * aliens.length);
      const randomAlien = aliens[randomIndex];
      const laser = createAlienLaser(randomAlien.position.x, randomAlien.position.y, randomAlien.position.z);
      scene.add(laser);
      lasers.push(laser);

      // Move this laser downward
      const moveAlienLaser = () => {
        laser.position.y -= 0.1; // Move the laser downward

        if (laser.position.y < -10) { // Adjust based on the scene size
          scene.remove(laser);
        } else {
          requestAnimationFrame(moveAlienLaser);
        }
      };

      requestAnimationFrame(moveAlienLaser);
    }
  }, shootingInterval);
}

startAlienShooting();

function shootLaser() {
  const laser = createLaser();
  
  // 'extrudeDepth' is the depth you used in the cannon's ExtrudeGeometry, need to adjust based on your cannon's design
  const extrudeDepth = 0.2;
  
  laser.position.set(
      cannon.position.x,
      cannon.position.y + (0.1 + extrudeDepth),
      cannon.position.z
  );

  // Add the laser to the scene and track it in the lasers array
  scene.add(laser);
  lasers.push(laser);

  // Define the movement of the laser
  const speed = 1; // Adjust speed as needed
  const laserMovement = () => {
      laser.position.y += speed * 0.05; // positive y-direction is 'forward'

      // Remove the laser if it goes out of bounds
      if (laser.position.y < -10) { // Adjust according to your scene's size
          scene.remove(laser);
      } else {
          requestAnimationFrame(laserMovement); // Continue moving the laser
      }
  };

  requestAnimationFrame(laserMovement); // Start moving the laser
}


  
  document.addEventListener('keydown', moveCannon);
  // adding the cannon 
  scene.add(cannon);

function createCannonShape(x, y, z) {
    const shape = new THREE.Shape();
    // Define the 2D profile of the cannon
    shape.moveTo(0, 0);
    shape.lineTo(0.075, -0.075);
    shape.lineTo(0.075, -0.15);
    shape.lineTo(0.3, -0.15);
    shape.lineTo(0.3, -0.45);
    shape.lineTo(-0.3, -0.45);
    shape.lineTo(-0.3, -0.15);
    shape.lineTo(-0.075, -0.15);
    shape.lineTo(-0.075, -0.075);
    shape.lineTo(0, 0);

    // Define the extrusion settings
    const extrudeSettings = {
        steps: 2, // Number of points used for subdividing segments along the depth of the extrusion
        depth: 0.3, // Depth of the extrusion (making it 3D)
        bevelEnabled: true, // Whether to bevel the edges
        bevelThickness: 0.01, // Thickness of the bevel
        bevelSize: 0.02, // How far the bevel extends
        bevelSegments: 1 // Number of segments for the bevel
    };

    // Create the geometry by extruding the shape
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Apply a material
    const material = new THREE.MeshPhongMaterial({ color: 0x925f44, side: THREE.DoubleSide });

    // Create the mesh object
    const cannon = new THREE.Mesh(geometry, material);
    cannon.position.set(x, y, z);

    return cannon;
}

function createAlienShape(x, y, z) {
  // Create a shape using points defined
  const shape = new THREE.Shape();
  shape.moveTo(0.5, 0.6);
  shape.lineTo(0.8, 0.6);
  shape.lineTo(1.0, 0.4);
  shape.lineTo(1.0, 0.1);
  shape.lineTo(0.9, 0.1);
  shape.lineTo(0.9, 0.3);
  shape.lineTo(0.8, 0.3);
  shape.lineTo(0.8, 0.1);
  shape.lineTo(0.7, 0.1);
  shape.lineTo(0.7, 0.3);
  shape.lineTo(0.6, 0.3);
  shape.lineTo(0.6, 0.1);
  shape.lineTo(0.5, 0.1);
  shape.lineTo(0.5, 0.3);
  shape.lineTo(0.4, 0.3);
  shape.lineTo(0.4, 0.1);
  shape.lineTo(0.3, 0.1);
  shape.lineTo(0.3, 0.4);
  shape.closePath();

  // Define the extrusion settings
  const extrudeSettings = {
      steps: 1,  // number of points used for subdividing segments along the depth
      depth: 0.2,  // depth of the extrusion
      bevelEnabled: false  // disable bevel to keep the alien shape sharp
  };

  // Create a 3D geometry by extruding the shape
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Material
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

  // Create a mesh with the geometry and material
  const alien = new THREE.Mesh(geometry, material);
  alien.position.set(x, y, z);

  return alien;
}

// Function to add a grid of aliens
function addAlienGrid(rows, cols, startX, startY, spacingX, spacingY) {
  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
          const x = startX + j * spacingX;
          const y = startY - i * spacingY;
          const alien = createAlienShape(x, y, 0);
          scene.add(alien);
          aliens.push(alien);
      }
  }
}

//adding the alien grid with 4 rows and 6 column and the x gap is 1.5 and the y gap is 1
addAlienGrid(4,6, -5, 4, 1, 0.7);

let alienSpeed = 0.05;
let alienDirection = 1;


  function createHorizontalLine() {
    const material = new THREE.MeshBasicMaterial({ color: 0x006d77 });
    const borderHeight = 0.1; // Height of the border, adjust as needed
    const borderWidth = 22; // Width of the border, adjust to match your line length
  
    const geometry = new THREE.BoxGeometry(borderWidth, borderHeight, 0);
    const border = new THREE.Mesh(geometry, material);
  
    border.position.set(0, -5, 0); // Position the border as needed
  
    return border;
  }

// Add horizontal line
const line = createHorizontalLine();
scene.add(line);


// Camera position
  camera.position.z = 7;


function animate() {

  if (!gameRunning) return; // Stop the animation loop if game is not running

    requestAnimationFrame(animate);
    // Update each alien's position
    aliens.forEach(alien => {
      alien.position.x += alienSpeed * alienDirection;
    });

    // Change direction if any alien reaches the horizontal boundaries
    if (aliens.some(alien => alien.position.x > 6 || alien.position.x < -7)) {
      alienDirection *= -1;
    }
    checkCollisionForAlien();
    checkCollisionForCannon();
    checkColliaionForBlock();
    renderer.render(scene, camera);
}

function gameWon() {
  gameRunning = false; // Stop the game
  const winText = document.createElement('div');
  winText.style.position = 'absolute';
  winText.style.top = '50%';
  winText.style.left = '50%';
  winText.style.transform = 'translate(-50%, -50%)';
  winText.style.color = 'white';
  winText.style.fontSize = '40px';
  winText.style.zIndex = '1000';
  winText.innerHTML = `Congratulations! You won!  <br>Final Score: ${score}`;
  document.body.appendChild(winText);
}

function gameOver() {
  gameRunning = false; // Stop the game from running
  renderer.setAnimationLoop(null); // Stop the animation loop

  const gameOverText = document.createElement('div');
  gameOverText.style.position = 'absolute';
  gameOverText.style.top = '50%';
  gameOverText.style.left = '50%';
  gameOverText.style.transform = 'translate(-50%, -50%)';
  gameOverText.style.color = 'white';
  gameOverText.style.fontSize = '40px';
  gameOverText.style.zIndex = '1000';
  gameOverText.innerHTML = `Game Over! Try Again? <br> Score: ${score}`;
  document.body.appendChild(gameOverText);

  const restartButton = document.createElement('button');
  restartButton.innerText = 'Restart';
  restartButton.style.position = 'absolute';
  restartButton.style.top = '60%';
  restartButton.style.left = '50%';
  restartButton.style.transform = 'translate(-50%, -50%)';
  restartButton.style.fontSize = '20px';
  restartButton.style.padding = '10px';
  restartButton.style.cursor = 'pointer';
  restartButton.onclick = () => location.reload(); // Reload the page to restart the game
  document.body.appendChild(restartButton);
}

function checkCollisionForAlien() {
  let removeIndices = [];
  for (let i = 0; i < lasers.length; i++) {
    const laserBox = new THREE.Box3().setFromObject(lasers[i]);
    if (lasers[i].userData.type === 'cannon') { // Check if laser is from cannon
      for (let j = 0; j < aliens.length; j++) {
        const alienBox = new THREE.Box3().setFromObject(aliens[j]);
        if (laserBox.intersectsBox(alienBox)) {
          console.log("Collision detected with alien", j);
          scene.remove(aliens[j]);
          aliens.splice(j, 1);
          j--;
          removeIndices.push(i);
          updateScore(10);
          break;
        }
      }
    }
  }
  // Remove lasers that hit aliens
  for (let index of removeIndices.reverse()) {
    scene.remove(lasers[index]);
    lasers.splice(index, 1);
  }
  // Check if there are no more aliens left and declare victory
  if (aliens.length === 0) {
    console.log("You killed all the alien!!!");
    gameWon();
  }
}

function checkCollisionForCannon() {
  for (let i = 0; i < lasers.length; i++) {
    if (lasers[i].userData.type === 'alien') { // Ensure the laser is from an alien
      const laserBox = new THREE.Box3().setFromObject(lasers[i]);
      const cannonBox = new THREE.Box3().setFromObject(cannon);
      if (laserBox.intersectsBox(cannonBox)) {
        console.log("Cannon hit by alien laser!");
        gameOver(); // Call the game over function
        scene.remove(lasers[i]);
        lasers.splice(i, 1);
        break; // Exit the loop since game is over
      }
    }
  }
}

function checkColliaionForBlock(){
  for (let i = 0; i < lasers.length; i++)
  {
    const laserBox = new THREE.Box3().setFromObject(lasers[i]);
    for (let k = 0; k < blocks.length; k++) {
      const blockBox = new THREE.Box3().setFromObject(blocks[k]);
      if (laserBox.intersectsBox(blockBox)) 
      {
          console.log("Collision detected with object", k);
          scene.remove(lasers[i]);
          lasers.splice(i,1);

      }
    }
    
  }
}
animate();

