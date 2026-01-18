<?php

// --- Table: habitat ---
class Habitat {
   
        private int $id;
        private string $habitat;
        private string $alt;
        private string $image;



    public function getId(): int { return $this->id; }
    public function getHabitat(): string { return $this->habitat; }
    public function getAlt(): string { return $this->alt; }
    public function getImage(): string { return $this->image; }
}
