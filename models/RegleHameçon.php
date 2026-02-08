<?php
class RegleHameçon
{
    private ?int $taille_reelle_cm = null;
    private ?string $taille_tp = null;
    private ?string $taille_texan = null;
    private ?string $taille_agrafe = null;



    public function getTailleReelleCm()
    {
        return $this->taille_reelle_cm;
    }

    public function getTailleTp()
    {
        return $this->taille_tp;
    }

    public function getTailleTexan()
    {
        return $this->taille_texan;
    }

    public function getTailleAgrafe()
    {
        return $this->taille_agrafe;
    }
}
