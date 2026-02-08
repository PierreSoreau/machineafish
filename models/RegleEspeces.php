<?php
class RegleEspeces
{
    private ?int $taille_equivalente_cm = null;
    private ?string $espece_cible = null;
    private ?string $selectivite = null;


    public function getTailleEquivalenteCm()
    {
        return $this->taille_equivalente_cm;
    }

    public function getEspeceCible()
    {
        return $this->espece_cible;
    }

    public function getSelectivite()
    {
        return $this->selectivite;
    }
}
