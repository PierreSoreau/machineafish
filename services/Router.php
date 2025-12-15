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

    public function handleRequest() : void
    {
        if(!empty($_GET['route'])) {
             if($_GET['route'] === 'brochet') {
                $this->uc->brochet();
            }
            /*else if($_GET['route'] === 'sandre') {
                $this->uc->sandre();
            }*/
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
            /*else if($_GET['route'] === 'carnassiers') {
                $this->uc->carnassiers();
            }

            else if($_GET['route'] === 'silure') {
                $this->uc->silure();
            }
            else if($_GET['route'] === 'perche') {
                $this->uc->perche();
            }

            else if($_GET['route'] === 'materiel') {
                $this->uc->materiel();
            }

            else if($_GET['route'] === 'tutoriels') {
                $this->uc->tutoriels();
            }*/
            
            else
            {
                $this->uc->notFound();
            }
        }
        else
        {
            $this->uc->home();
        }
    }
}
