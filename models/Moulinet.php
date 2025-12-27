<?php
class Moulinet {
    public function __construct(
        private int $id,
        private int $taille_bobine,
        private int $ratio,
        private string $nom
    ) {}

    public function getId(): int { return $this->id; }
    public function getTailleBobine(): int { return $this->taille_bobine; }
    public function getRatio(): int { return $this->ratio; }
    public function getNom(): string { return $this->nom; }
}