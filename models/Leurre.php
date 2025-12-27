<?php
class Leurre {
    public function __construct(
        private int $id,
        private string $nom,
        private float $taille,
        private string $poids_tete_plombee,
        private float $poids_leurre,
        private string $montage,
        private string $profondeur,
        private string $encombrement,
        private string $courant,
        private string $puissance_canne,
        private string $action_canne
    ) {}

    public function getId(): int { return $this->id; }
    public function getNom(): string { return $this->nom; }
    public function getTaille(): float { return $this->taille; }
    public function getPoidsTetePlombee(): string { return $this->poids_tete_plombee; }
    public function getPoidsLeurre(): float { return $this->poids_leurre; }
    public function getMontage(): string { return $this->montage; }
    public function getProfondeur(): string { return $this->profondeur; }
    public function getEncombrement(): string { return $this->encombrement; }
    public function getCourant(): string { return $this->courant; }
    public function getPuissanceCanne(): string { return $this->puissance_canne; }
    public function getActionCanne(): string { return $this->action_canne; }
}