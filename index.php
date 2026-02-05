<?php
//attention à bien mettre en premier l'autoload avant session start parce que sinon ça essaie de récupérer des instances via la session 
//avant même de savoir comment l'instance est structuré via le détail des classes
require "vendor/autoload.php";

session_start();

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$router = new Router();
$router->handleRequest();
