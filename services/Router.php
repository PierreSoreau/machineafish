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
        $route = $_GET['route'] ?? ''; // Par défaut 'home'

        switch ($route) {

            case '':
                $this->uc->home();
                break;

            case 'poissons-carnassiers':
                $this->uc->poissons();
                break;

            case 'materiel-peche':
                $this->uc->result();
                break;

            case 'questions-materiel':
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

            case 'tutoriels-peche':
                $this->uc->tutoriels();
                break;
            case 'recherche-peche':
                $this->uc->recherche();
                break;

            case 'mentions-legales':
                $this->uc->mentionslegales();
                break;

            case 'a-propos':
                $this->uc->apropos();
                break;

            default:
                $this->uc->erreur404();
                break;
        }
    }
}
