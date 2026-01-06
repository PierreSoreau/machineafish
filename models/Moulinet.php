<?php
class Moulinet {
    
        private ?int $id = null;
        private ?int $taille_bobine = null;
        private ?int $ratio = null;
        private ?string $nom = null;

    public function getId(): ?int { return $this->id; }
    public function getTailleBobine(): ?int { return $this->taille_bobine; }
    public function getRatio(): ?int { return $this->ratio; }
    public function getNom(): ?string { return $this->nom; }
}