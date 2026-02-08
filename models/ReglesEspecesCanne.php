<?php
class RegleEspecesCanne
{
    private ?int $id = null;
    private ?string $espece_cible = null;
    private ?string $action = null;


    public function getId()
    {
        return $this->id;
    }

    public function getEspeceCible()
    {
        return $this->espece_cible;
    }

    public function getAction()
    {
        return $this->action;
    }
}
