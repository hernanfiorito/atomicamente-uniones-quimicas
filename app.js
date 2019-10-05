// Obtenemos una referencia al elemento contenedor que albergará nuestra escena
const container = document.querySelector('#scene-container');

// Creamos la escena
const escena = new THREE.Scene();

// Configuramos el color del background de la escena
// escena.background = new THREE.Color('black');
// escena.background = new THREE.Color(0xb4cdff);
escena.background = new THREE.Color(0xb4cdff);

// Configuramos los parámetros de la cámara
const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

// Creamos la cámara
const camara = new THREE.PerspectiveCamera(fov, aspect, near, far);

// Cada objeto se crea inicialmente en ( 0, 0, 0 )
// Para ver la escena, movemos la cámara un poco hacia atrás.
camara.position.set(20, 0, 30);

// Creamos el enlace que une los dos átomos


// Creamos un grupo y agregamos todos los componentes.
// Estos componentes pueden ser rotados y escalados como un grupo.


// Agregamos un eje de coordenadas en (0, 0, 0) para ubicar las posiciones (después se eliminará)
function graficarEjes(){
	const ejes = new THREE.Group();
	ejes.name = 'ejes';
	const ejeX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), ejes.position, 5, 0xff0000);
	const ejeY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), ejes.position, 5, 0x00ff00);
	const ejeZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), ejes.position, 5, 0x0000ff);
	ejes.add(ejeX);
	ejes.add(ejeY);
	ejes.add(ejeZ);
	escena.add(ejes);
}	


// create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// add the automatically created <canvas> element to the page
container.appendChild(renderer.domElement);

// ------------------------------------------------------------------------------------------------------------------------
var controls = new THREE.OrbitControls(camara, renderer.domElement);
controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
//controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
//controls.dampingFactor = 0.05;
//controls.screenSpacePanning = false;
controls.minDistance = 0;
controls.maxDistance = 1000;
//controls.maxPolarAngle = Math.PI / 2;

/* ------------------------------------------------------------------------------------------------------------------------ */

function render() {
	renderer.render(escena, camara);
}

window.addEventListener('resize', onResize, false);

function onResize() {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

render();

function graficarUnion(elemento1, elemento2){
	if(elemento1.electronegatividad - elemento2.electronegatividad < 2){
		graficarUnionCovalente(elemento1, elemento2);
	} /*else {
		graficarUnionIonica(elemento1, elemento2);
	}*/
	
	/*console.log('Electronegatividad ' + elemento1.nombre, elemento1.electronegatividad);
	console.log('Electronegatividad ' + elemento2.nombre, elemento2.electronegatividad);

	const group = new THREE.Group();
	group.name = 'union';

	const materialNubeDeElectrones = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: false, transparent: true, opacity: 0.4});
	const materialAtomo = new THREE.MeshBasicMaterial({color: 0xffff5a, wireframe: false, transparent: false, opacity: 0.6});
	
	const geometriaNubeDeElectrones_A = new THREE.SphereBufferGeometry(3, 40, 40, 0, Math.PI * 2, 0,  Math.PI/2 + Math.PI/3.7);
	const geometriaNubeDeElectrones_B = new THREE.SphereBufferGeometry(2, 40, 40, 0, Math.PI * 2, 0,  Math.PI/2 + Math.PI/3.7);
	const geometria_Atomo = new THREE.SphereBufferGeometry(1, 40, 40);

	const nubeDeElectrones_A = new THREE.Mesh(geometriaNubeDeElectrones_A, materialNubeDeElectrones);
	nubeDeElectrones_A.position.set(1.5, 0, 0);
	const atomoA = new THREE.Mesh(geometria_Atomo, materialAtomo);
	atomoA.position.set(1.5, 0, 0);
	const nubeDeElectrones_B = new THREE.Mesh(geometriaNubeDeElectrones_B, materialNubeDeElectrones);
	nubeDeElectrones_B.position.set(-1.5, 0, 0);
	const atomoB = new THREE.Mesh(geometria_Atomo, materialAtomo);
	atomoB.position.set(-1.5, 0, 0);
	nubeDeElectrones_A.rotation.z += 3 * Math.PI / 2;
	nubeDeElectrones_B.rotation.z -= 3 * Math.PI / 2;

	const geometriaCilindro = new THREE.CylinderBufferGeometry(0.2, 0.2, 2.5, 32 );
	const materialCilindro = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	const cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro );
	cilindro.rotation.x += Math.PI / 2;
	cilindro.rotation.z += Math.PI / 2;

	group.add(nubeDeElectrones_A);
	group.add(atomoA);
	group.add(nubeDeElectrones_B);
	group.add(atomoB);
	group.add(cilindro);
	escena.add(group);

	render();*/
}

function graficarUnionCovalente(elemento1, elemento2){
	const electroneg1 = elemento1.electronegatividad;
	const electroneg2 = elemento2.electronegatividad;
	console.log('Electronegatividad ' + elemento1.nombre, electroneg1);
	console.log('Electronegatividad ' + elemento2.nombre, electroneg2);

	const group = new THREE.Group();
	group.name = 'union';

	const materialNubeDeElectrones = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: false, transparent: true, opacity: 0.4});
	const materialAtomo = new THREE.MeshBasicMaterial({color: 0xffff5a, wireframe: false, transparent: false, opacity: 0.6});
	
	if((electroneg1 - electroneg2) != 0){
		const elemMasElectroNeg = Math.max(electroneg1, electroneg2)
		
		const geometriaNubeDeElectrones_A = new THREE.SphereBufferGeometry(2, 40, 40, 0, Math.PI);
		const geometriaNubeDeElectrones_B = new THREE.SphereBufferGeometry(2 * elemMasElectroNeg, 40, 40, 0, Math.PI);
		const geometriaConectorNubeElec = new THREE.CylinderBufferGeometry(2, 2 * elemMasElectroNeg, (2.5 * elemMasElectroNeg) + (Math.PI/2), 40, 40, true);
		const geometria_Atomo = new THREE.SphereBufferGeometry(1, 40, 40);

		const nubeDeElectrones_A = new THREE.Mesh(geometriaNubeDeElectrones_A, materialNubeDeElectrones);
		nubeDeElectrones_A.position.set(1.5 * elemMasElectroNeg, 0, 0);
		const atomoA = new THREE.Mesh(geometria_Atomo, materialAtomo);
		atomoA.position.set(1.5 * elemMasElectroNeg, 0, 0);
		const nubeDeElectrones_B = new THREE.Mesh(geometriaNubeDeElectrones_B, materialNubeDeElectrones);
		nubeDeElectrones_B.position.set(-1.5 * elemMasElectroNeg, 0, 0);
		const atomoB = new THREE.Mesh(geometria_Atomo, materialAtomo);
		atomoB.position.set(-1.5 * elemMasElectroNeg, 0, 0);
		nubeDeElectrones_A.rotation.y -= 3 * Math.PI / 2;
		nubeDeElectrones_B.rotation.y += 3 * Math.PI / 2;
		const conectorNubeElec = new THREE.Mesh(geometriaConectorNubeElec, materialNubeDeElectrones);
		conectorNubeElec.rotation.z -= Math.PI / 2;

		const geometriaCilindro = new THREE.CylinderBufferGeometry(0.2, 0.2, 2.5 * elemMasElectroNeg, 32 );
		const materialCilindro = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		const cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro );
		cilindro.rotation.x += Math.PI / 2;
		cilindro.rotation.z += Math.PI / 2;

		group.add(nubeDeElectrones_A);
		group.add(atomoA);
		group.add(nubeDeElectrones_B);
		group.add(atomoB);
		group.add(cilindro);
		group.add(conectorNubeElec);
		escena.add(group);

	} else {
		const geometriaNubeDeElectrones_A = new THREE.SphereBufferGeometry(2, 40, 40, 0, Math.PI);
		const geometriaNubeDeElectrones_B = new THREE.SphereBufferGeometry(2, 40, 40, 0, Math.PI);
		const geometriaConectorNubeElec = new THREE.CylinderBufferGeometry(2, 2, 3, 40, 40, true);
		const geometria_Atomo = new THREE.SphereBufferGeometry(1, 40, 40);

		const nubeDeElectrones_A = new THREE.Mesh(geometriaNubeDeElectrones_A, materialNubeDeElectrones);
		nubeDeElectrones_A.position.set(1.5, 0, 0);
		const atomoA = new THREE.Mesh(geometria_Atomo, materialAtomo);
		atomoA.position.set(1.5, 0, 0);
		const nubeDeElectrones_B = new THREE.Mesh(geometriaNubeDeElectrones_B, materialNubeDeElectrones);
		nubeDeElectrones_B.position.set(-1.5, 0, 0);
		const atomoB = new THREE.Mesh(geometria_Atomo, materialAtomo);
		atomoB.position.set(-1.5, 0, 0);
		nubeDeElectrones_A.rotation.y -= 3 * Math.PI / 2;
		nubeDeElectrones_B.rotation.y += 3 * Math.PI / 2;
		const conectorNubeElec = new THREE.Mesh(geometriaConectorNubeElec, materialNubeDeElectrones);
		conectorNubeElec.rotation.z -= Math.PI / 2;

		const geometriaCilindro = new THREE.CylinderBufferGeometry(0.2, 0.2, 2.5, 32 );
		const materialCilindro = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		const cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro );
		cilindro.rotation.x += Math.PI / 2;
		cilindro.rotation.z += Math.PI / 2;

		group.add(nubeDeElectrones_A);
		group.add(atomoA);
		group.add(nubeDeElectrones_B);
		group.add(atomoB);
		group.add(cilindro);
		group.add(conectorNubeElec);
		escena.add(group);
	}
	render();
}

function limpiarEscena(){
	escena.children = escena.children.filter(function f(elemento){return elemento.name !== "union"});
}

function mostrarGraficos(){
	limpiarEscena();
	graficarEjes();
	var x = document.getElementById("elementos").value;
	graficarUnion(elementos['cloro'], elementos[x]);
}

$(document).ready(function(){
	mostrarGraficos();
});

$(document).on('change','#elementos',function() {
	mostrarGraficos();
});
