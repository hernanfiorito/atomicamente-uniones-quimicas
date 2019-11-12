const container = document.querySelector('#scene-container');
const canvas = document.querySelector('#c');

const escena = new THREE.Scene();

escena.background = new THREE.Color(0xb4cdff);

const fov = 35;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 100;


const camara = new THREE.PerspectiveCamera(fov, aspect, near, far);

camara.position.set(20, 0, 30);
var atomoA;
var atomoB;

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

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);


var controls = new THREE.OrbitControls(camara, renderer.domElement);
controls.addEventListener('change', render); 
controls.enablePan = false;
controls.minDistance = 0;
controls.maxDistance = 1000;


function render() {
	limpiarTextos();
	generarTexto(atomoA);
	generarTexto(atomoB);
	renderer.render(escena, camara);
}

function graficarUnion(elemento1, elemento2) {
	const group = new THREE.Group();
	group.name = 'union';
	const materialNubeDeElectrones = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false, transparent: true, opacity: 0.4 });

	if (Math.abs(elemento1.electronegatividad - elemento2.electronegatividad) < 2) {
		graficarUnionCovalente(group, materialNubeDeElectrones, elemento1, elemento2);
	} else {
		graficarUnionIonica(group, materialNubeDeElectrones, elemento1, elemento2);
	}

	escena.add(group);
	return group;
}

function graficarUnionCovalente(group, materialNubeDeElectrones, elemento1, elemento2) {
	const geometria_AtomoA = new THREE.SphereBufferGeometry(elemento1.radioAtomico / 80, 40, 40);
	const geometria_AtomoB = new THREE.SphereBufferGeometry(elemento2.radioAtomico / 80, 40, 40);
	const materialAtomo = new THREE.MeshBasicMaterial({ color: 0xffff5a, wireframe: false, transparent: false, opacity: 0.6 });
	atomoA = new THREE.Mesh(geometria_AtomoA, materialAtomo);
	atomoA.name = elemento1.nomenclatura;
	atomoA.carga = '';
	atomoA.position.set(3, 0, 0);
	atomoB = new THREE.Mesh(geometria_AtomoB, materialAtomo);
	atomoB.name = elemento2.nomenclatura;
	atomoB.position.set(-3, 0, 0);
	atomoB.carga = '';

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

	group.add(atomoA);
	group.add(atomoB);
	group.add(cilindro);

}

function generarTexto(atomo){
	const labelContainerElem = document.querySelector('#labels');
	const textoNomenclatura = document.createElement('div');
	const superindiceCarga = document.createElement('sup')
	textoNomenclatura.textContent = atomo.name;
	superindiceCarga.textContent = atomo.carga;
	textoNomenclatura.appendChild(superindiceCarga);
	labelContainerElem.appendChild(textoNomenclatura);
	const tempV = new THREE.Vector3();
	atomo.updateWorldMatrix(true, false);
	atomo.getWorldPosition(tempV);
	tempV.project(camara);
	const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
	
	textoNomenclatura.style.transform = 'translate(-50%, -50%) translate('+ x +'px,'+ y +'px)';
}

function generarPuntosNubeDeElectrones() {
	var puntos = [];
	for (var deg = 0; deg <= 180; deg += 6) {
		var rad = Math.PI * deg / 180;
		var punto = new THREE.Vector2(6 * (0.78 + 0.18 * Math.cos(rad)) * Math.sin(rad), - 6 * Math.cos(rad));
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
	const geometria_AtomoA = new THREE.SphereBufferGeometry(1, 40, 40);
	const geometria_AtomoB = new THREE.SphereBufferGeometry(1, 40, 40);
	const materialAtomo = new THREE.MeshBasicMaterial({ color: 0xffff5a, wireframe: false, transparent: false, opacity: 0.6 });
	atomoA = new THREE.Mesh(geometria_AtomoA, materialAtomo);
	atomoA.name = elemento1.nomenclatura;
	atomoA.carga = '';
	atomoA.position.set(3, 0, 0);
	atomoB = new THREE.Mesh(geometria_AtomoB, materialAtomo);
	atomoB.name = elemento2.nomenclatura;
	atomoB.carga = '';
	atomoB.position.set(-3, 0, 0);

	const geometriaNubeDeElectrones = new THREE.SphereBufferGeometry(2, 40, 40, 0, 2*Math.PI);
	const nubeDeElectrones = new THREE.Mesh(geometriaNubeDeElectrones, materialNubeDeElectrones);
	if(elemento1.electronegatividad > elemento2.electronegatividad){
		nubeDeElectrones.position.set(3, 0, 0);
		atomoB.carga = '+';
		atomoA.carga = '-';
	} else {
		nubeDeElectrones.position.set(-3, 0, 0);
		atomoA.carga = '+';
		atomoB.carga = '-';
	}
	grupo.add(atomoA);
	grupo.add(atomoB);
	grupo.add(nubeDeElectrones);
}

function limpiarTextos(){
	textos = $('#labels');
	textos.html("");
}

function limpiarEscena() {
	limpiarTextos();
	escena.children = escena.children.filter(function f(elemento) { return elemento.name !== "union" && elemento.name !== "ejes" });
}

function mostrarGraficos() {
	limpiarEscena();
	//graficarEjes();
	var x = document.getElementById("elementos").value;
	var grupo = graficarUnion(elementos['cloro'], elementos[x]);
	render();
}

function onResize() {
	camara.aspect = window.innerWidth / window.innerHeight;
	camara.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

$(document).ready(function () {
	mostrarGraficos();
	render();
});

$(document).on('change', '#elementos', function () {
	mostrarGraficos();
});

window.addEventListener('resize', onResize, false);
