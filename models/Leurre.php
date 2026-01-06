<?php
class Leurre {
   
        private ?int $id = null;
        private ?string $nom = null;
        private ?float $taille = null;
        private ?string $poids_tete_plombee = null;
        private ?float $poids_leurre = null;
        private ?string $montage = null;
        private ?string $profondeur = null;
        private ?string $encombrement = null;
        private ?string $courant = null;
        private ?string $puissance_canne = null;
        private ?string $action_canne = null;
  

    public function getId(): ?int { return $this->id; }
    public function getNom(): ?string { return $this->nom; }
    public function getTaille(): ?float { return $this->taille; }
    public function getPoidsTetePlombee(): ?string { return $this->poids_tete_plombee; }
    public function getPoidsLeurre(): ?float { return $this->poids_leurre; }
    public function getMontage(): ?string { return $this->montage; }
    public function getProfondeur(): ?string { return $this->profondeur; }
    public function getEncombrement(): ?string { return $this->encombrement; }
    public function getCourant(): ?string { return $this->courant; }
    public function getPuissanceCanne(): ?string { return $this->puissance_canne; }
    public function getActionCanne(): ?string { return $this->action_canne; }
}