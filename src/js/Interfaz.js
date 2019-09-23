import {generarNucleo} from './GeneradorDeNucleos';
import {comenzarEscena, render, scene} from './Escena';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/estilos.css';

var protons, neutrons;

comenzarEscena();

function limpiarElementosEnPantalla(){
  scene.children = scene.children.filter(function f(elemento){return elemento.name !== "isotopo"});
}

