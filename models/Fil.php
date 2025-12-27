<?php
class Fil {
    public function __construct(
        private int $id,
        private string $epaisseur_de_tresse,
        private string $epaisseur_de_fluorocarbone,
        private string $gros_specimen
    ) {}

    public function getId(): int { return $this->id; }
    public function getEpaisseurDeTresse(): string { return $this->epaisseur_de_tresse; }
    public function getEpaisseurDeFluorocarbone(): string { return $this->epaisseur_de_fluorocarbone; }
    public function getGrosSpecimen(): string { return $this->gros_specimen; }
}