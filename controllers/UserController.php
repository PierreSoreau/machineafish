<?php

class UserController extends AbstractController
{
    
 
    public function brochet() :void 
    {
        $this->render('brochet.html.twig', []);
    }

    public function notFound() : void
    {
        $this->render('notfound.html.twig', []);
    }

    public function home() : void
    {
        $this->render('home_page.html.twig', []);
    }

}