<?php
class Canne {
    public function __construct(
        private int $id,
        private string $puissance,
        private string $action,
        private int $poids_mini,
        private int $poids_maxi,
        private string $longueur
    ) {}

    public function getId(): int { return $this->id; }
    public function getPuissance(): string { return $this->puissance; }
    public function getAction(): string { return $this->action; }
    public function getPoidsMini(): int { return $this->poids_mini; }
    public function getPoidsMaxi(): int { return $this->poids_maxi; }
    public function getLongueur(): string { return $this->longueur; }
}