import {generarAtomos} from './GeneradorDeNucleos';
import {comenzarEscena, render, scene} from './Escena';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/estilos.css';

var protons, neutrons;

comenzarEscena();
mostrarAtomos();

function mostrarAtomos(){
  var union = generarAtomos();
  scene.add(union[0]);
  scene.add(union[1]);
  render();
}

