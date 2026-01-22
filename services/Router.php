<?php

class Router
{
    //private AuthController $ac;
    private UserController $uc;
    public function __construct()
    {
        //$this->ac = new AuthController();
        $this->uc = new UserController();
    }

    public function handleRequest(): void
    {
        $route = $_GET['route'] ?? 'home'; // Par défaut 'home'

        switch ($route) {
            case 'home':
                $this->uc->home();
                break;

            case 'poissons':
                $this->uc->poissons();
                break;

            case 'materiel':
                $this->uc->result();
                break;

            case 'questions':
                $this->uc->questions();
                break;

            case 'brochet':
                $this->uc->descriptionPoisson();
                break;

            case 'silure':
                $this->uc->descriptionPoisson();
                break;

            case 'sandre':
                $this->uc->descriptionPoisson();
                break;

            case 'perche':
                $this->uc->descriptionPoisson();
                break;

            case 'tutoriels':
                $this->uc->tutoriels();
                break;

            default:
                $this->uc->descriptionPoisson();
                break;
        }
    }



    /*else if($_GET['route'] === 'login') {
                $this->ac->login();
            }
            else if($_GET['route'] === 'register') {
                $this->ac->register();
            }
            else if($_GET['route'] === 'logout') {
                $this->ac->logout();
            }
            else if($_GET['route'] === 'profile') {
                $this->uc->profile();
            }*/
}
