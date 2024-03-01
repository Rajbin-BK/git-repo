
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

const blockPositions = [-4, -2, 0, 2, 4 ]; // Example positions for blocks along the x-axis
blockPositions.forEach(x => {
  const block = createBlockShape(x, 0, 0); // Keeping y constant for a straight line, adjust as needed
  scene.add(block);
  blocks.push(block);
});


// Function to create an block shape
function createBlockShape(x, y, z) {
  const points = [];
  points.push(new THREE.Vector3(-0.3, -1.7, 0)); // A
  points.push(new THREE.Vector3(0.3, -1.7, 0)); //  B
  points.push(new THREE.Vector3(0.6, -1.85, 0)); //  C
  points.push(new THREE.Vector3(0.6, -2.15, 0)); //  D
  points.push(new THREE.Vector3(0.3, -2.15, 0)); //  E
  points.push(new THREE.Vector3(0.3, -2.075, 0)); //  F
  points.push(new THREE.Vector3(-0.3, -2.075, 0)); // g
  points.push(new THREE.Vector3(-0.3, -2.15, 0)); // h
  points.push(new THREE.Vector3(-0.6, -2.15, 0)); // i
  points.push(new THREE.Vector3(-0.6, -1.85, 0 )); // j
  points.push(new THREE.Vector3(-0.3, -1.7, 0)); // a
  
  const shape = new THREE.Shape(points);
  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({ color: 0xaacc00, side: THREE.DoubleSide });
  const block = new THREE.Mesh(geometry, material);
  
  block.position.x = x;
  block.position.y = y;
  block.position.z = z;
  
  return block;
  }

function createLaser() {
  const geometry = new THREE.SphereGeometry(0.08,32,16); // Small sphere as laser
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  const laser = new THREE.Mesh(geometry, material);
  laser.rotation.x = Math.PI / 2; // Orient the cylinder to point out of the cannon
  return laser;
}

// Function to start automatic shooting
function startAutomaticShooting() {
  const shootingInterval = 200; // Time in milliseconds between shots, e.g., 1000ms = 1 second

  setInterval(() => {
      shootLaser();
  }, shootingInterval);
}

// Ensure this function is called after the cannon and scene have been initialized
startAutomaticShooting();

function shootLaser() {
  const laser = createLaser();
  laser.position.set(cannon.position.x, cannon.position.y-2.5); // Assume cannon's current position

  scene.add(laser);
  lasers.push(laser);

  // Define the movement of the laser
  const speed = 5; // Adjust speed as needed
  const laserMovement = () => {
      laser.position.y += speed * 0.05; // Example: move upwards

      // Remove the laser if it goes out of bounds
      if (laser.position.y > 10) { // Example: boundary check
          scene.remove(laser); // Remove laser from the scene
      } else {
          requestAnimationFrame(laserMovement); // Continue moving the laser
      }
  };

  requestAnimationFrame(laserMovement); // Start moving the laser
}

const cannon = createCannonShape(0,0,0);
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
  
  document.addEventListener('keydown', moveCannon);
  // adding the cannon 
  scene.add(cannon);

// Function to create an cannon shape
function createCannonShape(x, y,z) {
  const points = [];
  points.push(new THREE.Vector3(0, -2.85, 0)); // Top of the head A
  points.push(new THREE.Vector3(0.075, -2.925, 0 )); // Right head B
  points.push(new THREE.Vector3(0.075,-3, 0)); // Right body C
  points.push(new THREE.Vector3(0.3, -3, 0)); // Bottom D
  points.push(new THREE.Vector3(0.3, -3.30, 0)); // Left body E
  points.push(new THREE.Vector3(-0.3, -3.30, 0)); // Left head F
  points.push(new THREE.Vector3(-0.3, -3, 0)); // g
  points.push(new THREE.Vector3(-0.075, -3, 0)); // h
  points.push(new THREE.Vector3(-0.075, -2.925, 0)); // i
  points.push(new THREE.Vector3(0, -2.85, 0)); // a
  
  const shape = new THREE.Shape(points);
  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({ color: 0xc8b6ff, side: THREE.DoubleSide });
  const cannon = new THREE.Mesh(geometry, material);
  
  cannon.position.x = x;
  cannon.position.y = y;
  cannon.position.z = z;
  
  return cannon;
  }

  // Function to create an ALIEN shape
  function createAlienShape(x, y , z) {
   const points = [];
   points.push(new THREE.Vector3(0.5,0.6, 0 ));  //A
   points.push(new THREE.Vector3(0.8,0.6, 0)); //B
   points.push(new THREE.Vector3(1  ,0.4, 0)); //  C
   points.push(new THREE.Vector3(1  ,0.1, 0)); // D
   points.push(new THREE.Vector3(0.9,0.1, 0)); //  E
   points.push(new THREE.Vector3(0.9,0.3, 0)); // F
   points.push(new THREE.Vector3(0.8,0.3, 0)); // g
   points.push(new THREE.Vector3(0.8,0.1, 0)); // h
   points.push(new THREE.Vector3(0.7,0.1, 0)); // i
   points.push(new THREE.Vector3(0.7,0.3, 0)); // j
   points.push(new THREE.Vector3(0.6,0.3, 0)); // k
   points.push(new THREE.Vector3(0.6,0.1, 0)); // k
   points.push(new THREE.Vector3(0.5,0.1, 0)); // l
   points.push(new THREE.Vector3(0.5,0.3, 0)); // m
   points.push(new THREE.Vector3(0.4,0.3, 0)); // n
   points.push(new THREE.Vector3(0.4,0.1, 0)); // o
   points.push(new THREE.Vector3(0.3,0.1, 0)); // p
   points.push(new THREE.Vector3(0.3,0.4, 0)); // q
   points.push(new THREE.Vector3(0.5,0.6, 0 )); //A
  
   const shape = new THREE.Shape(points);
   const geometry = new THREE.ShapeGeometry(shape);
   const material = new THREE.MeshBasicMaterial({ color: 0x7251b5, side: THREE.DoubleSide });
   const alien = new THREE.Mesh(geometry, material);
   
   alien.position.x = x;
   alien.position.y = y;
   alien.position.z = z;
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
  
    border.position.set(0, -3.5, 0); // Position the border as needed
  
    return border;
  }

// Add horizontal line
const line = createHorizontalLine();
scene.add(line);


// Camera position
  camera.position.z = 7;


function animate() {
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
    checkColliaionForBlock();

    renderer.render(scene, camera);
}

function checkCollisionForAlien() {
  for (let i = 0; i < lasers.length; i++)
  {
    const laserBox = new THREE.Box3().setFromObject(lasers[i]);
    for (let j = 0; j < aliens.length; j++) {
      const alienBox = new THREE.Box3().setFromObject(aliens[j]);
      if (laserBox.intersectsBox(alienBox)) 
      {
          console.log("Collision detected with object", j);
          //scene.remove(aliens[j]);
          scene.remove(lasers[i]);
          lasers.splice(i,1);
          updateScore(10);
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

