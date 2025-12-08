<?php

class DefaultController extends AbstractController
{
    /*public function home() : void
    {
        $ctrl1 = new PlayerManager;
        $ctrl2 = new Player_performanceManager;
        $ctrl3= new GameManager;
        $data1 = $ctrl1->findAll();
        $data2 = $ctrl2->findAll();
        $data3 = $ctrl3->findAll();
        $data=[
            "players" => $data1,
            "performance" =>$data2,
            "game" =>$data3
        ];
        $this->render("home_page", $data);
    }*/

    public function home_page() : void
    {        
        $this->render("home_page", []);
    }

    public function brochet() : void
    {        
        $this->render("brochet", []);
    }

}

    