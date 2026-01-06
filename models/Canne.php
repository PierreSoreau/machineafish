<?php
class Canne {
    
        private ?int $id = null;
        private ?string $puissance = null;
        private ?string $action = null;
        private ?int $poids_mini = null;
        private ?int $poids_maxi = null;
        private ?string $longueur = null;
    

    public function getId(): ?int { return $this->id; }
    public function getPuissance(): ?string { return $this->puissance; }
    public function getAction(): ?string { return $this->action; }
    public function getPoidsMini(): ?int { return $this->poids_mini; }
    public function getPoidsMaxi(): ?int { return $this->poids_maxi; }
    public function getLongueur(): ?string { return $this->longueur; }
}