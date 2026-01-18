<?php
class Spot {    
        private int $id;
        private string $spot;
        private ?string $alt=null;
        private string $image;

 

    public function getId(): int { return $this->id; }
    public function getSpot(): string { return $this->spot; }
    public function getAlt(): ?string { return $this->alt; }
    public function getImage(): string { return $this->image; }
}