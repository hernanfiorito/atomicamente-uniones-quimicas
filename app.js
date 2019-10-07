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
function graficarEjes() {
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
controls.addEventListener('change', render); // call this only in static scenes (i.e., if there is no animation loop)
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

function graficarUnion(elemento1, elemento2) {
	const group = new THREE.Group();
	group.name = 'union';

	const geometria_Atomo = new THREE.SphereBufferGeometry(1, 40, 40);
	const materialNubeDeElectrones = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false, transparent: true, opacity: 0.4 });
	const materialAtomo = new THREE.MeshBasicMaterial({ color: 0xffff5a, wireframe: false, transparent: false, opacity: 0.6 });
	const atomoA = new THREE.Mesh(geometria_Atomo, materialAtomo);
	atomoA.position.set(3, 0, 0);
	const atomoB = new THREE.Mesh(geometria_Atomo, materialAtomo);
	atomoB.position.set(-3, 0, 0);

	if (Math.abs(elemento1.electronegatividad - elemento2.electronegatividad) < 2) {
		graficarUnionCovalente(group, materialNubeDeElectrones, elemento1, elemento2);
	} else {
		graficarUnionIonica(group, materialNubeDeElectrones, elemento1, elemento2);
	}

	group.add(atomoA);
	group.add(atomoB);
	escena.add(group);
	render();
}

function graficarUnionCovalente(group, materialNubeDeElectrones, elemento1, elemento2) {
	const electroneg1 = elemento1.electronegatividad;
	const electroneg2 = elemento2.electronegatividad;

	const geometriaCilindro = new THREE.CylinderBufferGeometry(0.2, 0.2, 6, 32);
	const materialCilindro = new THREE.MeshBasicMaterial({ color: 0xffffff });
	const cilindro = new THREE.Mesh(geometriaCilindro, materialCilindro);
	cilindro.rotation.x += Math.PI / 2;
	cilindro.rotation.z += Math.PI / 2;

	if ((electroneg1 - electroneg2) != 0) {
		graficarUnionCovalentePolar(group, materialNubeDeElectrones)
	} else {
		graficarUnionCovalenteNoPolar(group, materialNubeDeElectrones);
	}
	
	group.add(cilindro);

}

function generarPuntosNubeDeElectrones() {
	var puntos = [];
	for (var deg = 0; deg <= 180; deg += 6) {
		var rad = Math.PI * deg / 180;
		var punto = new THREE.Vector2(4 * (0.72 + 0.3 * Math.cos(rad)) * Math.sin(rad), - 7 * Math.cos(rad));
		puntos.push(punto);
	}
	return puntos;
}

function graficarUnionCovalenteNoPolar(grupo, materialNubeDeElectrones) {
	const geometriaNubeDeElectrones_A = new THREE.SphereBufferGeometry(2, 40, 40, 0, Math.PI);
	const geometriaNubeDeElectrones_B = new THREE.SphereBufferGeometry(2, 40, 40, 0, Math.PI);
	const geometriaConectorNubeElec = new THREE.CylinderBufferGeometry(2, 2, 6, 40, 40, true);

	const nubeDeElectrones_A = new THREE.Mesh(geometriaNubeDeElectrones_A, materialNubeDeElectrones);
	nubeDeElectrones_A.position.set(3, 0, 0);

	const nubeDeElectrones_B = new THREE.Mesh(geometriaNubeDeElectrones_B, materialNubeDeElectrones);
	nubeDeElectrones_B.position.set(-3, 0, 0);

	nubeDeElectrones_A.rotation.y -= 3 * Math.PI / 2;
	nubeDeElectrones_B.rotation.y += 3 * Math.PI / 2;
	const conectorNubeElec = new THREE.Mesh(geometriaConectorNubeElec, materialNubeDeElectrones);
	conectorNubeElec.rotation.z -= Math.PI / 2;

	grupo.add(nubeDeElectrones_A);
	grupo.add(nubeDeElectrones_B);
	grupo.add(conectorNubeElec);
}

function graficarUnionCovalentePolar(grupo, materialNubeDeElectrones) {
	const puntos = generarPuntosNubeDeElectrones();
	geometriaNubeDeElectrones = new THREE.LatheBufferGeometry(puntos, 32);

	const nubeDeElectrones = new THREE.Mesh(geometriaNubeDeElectrones, materialNubeDeElectrones);
	nubeDeElectrones.rotation.x += Math.PI / 2;
	nubeDeElectrones.rotation.z += Math.PI / 2;

	grupo.add(nubeDeElectrones);
}

function graficarUnionIonica(grupo, materialNubeDeElectrones, elemento1, elemento2){
	const geometriaNubeDeElectrones = new THREE.SphereBufferGeometry(2, 40, 40, 0, 2*Math.PI);
	const nubeDeElectrones = new THREE.Mesh(geometriaNubeDeElectrones, materialNubeDeElectrones);
	if(elemento1.electronegatividad > elemento2.electronegatividad){
		nubeDeElectrones.position.set(3, 0, 0);
	} else {
		nubeDeElectrones.position.set(-3, 0, 0);
	}
	grupo.add(nubeDeElectrones);
}

function limpiarEscena() {
	escena.children = escena.children.filter(function f(elemento) { return elemento.name !== "union" });
}

function mostrarGraficos() {
	limpiarEscena();
	graficarEjes();
	var x = document.getElementById("elementos").value;
	graficarUnion(elementos['cloro'], elementos[x]);
}

$(document).ready(function () {
	mostrarGraficos();
});

$(document).on('change', '#elementos', function () {
	mostrarGraficos();
});
