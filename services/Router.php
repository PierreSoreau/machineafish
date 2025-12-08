<?php

class Router
{
    public function handleRequest(array $get) : void
    {
        if(isset($get["route"]))
        {
            if($get["route"] === "brochet")
            {
                $ctrl = new DefaultController();
                $ctrl->brochet();
            }            
        }
        
        else
        {
            $ctrl = new DefaultController();
            $ctrl->home_page();

        }
    }
        


}

?>