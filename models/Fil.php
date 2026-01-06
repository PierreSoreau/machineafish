<?php
class Fil {
   
        private ?int $id = null;
        private ?string $epaisseur_de_tresse = null;
        private ?string $epaisseur_de_fluorocarbone = null;
        private ?string $gros_specimen = null;
  

    public function getId(): ?int { return $this->id; }
    public function getEpaisseurDeTresse(): ?string { return $this->epaisseur_de_tresse; }
    public function getEpaisseurDeFluorocarbone(): ?string { return $this->epaisseur_de_fluorocarbone; }
    public function getGrosSpecimen(): ?string { return $this->gros_specimen; }
}