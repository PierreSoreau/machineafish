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
            case 'recherche':
                $this->uc->recherche();
                break;

            case 'mentions_legales':
                $this->uc->mentionslegales();
                break;

            case 'a_propos':
                $this->uc->apropos();
                break;

            default:
                $this->uc->erreur404();
                break;
        }
    }
}
