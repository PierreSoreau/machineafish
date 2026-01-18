<?php
class Alimentation {
    
    private int $id;
    private string $alimentation;
    private string $alt;
    private string $image;
    private int $ordre;


    public function getId(): int { return $this->id; }
    public function getAlimentation(): string { return $this->alimentation; }
    public function getAlt(): string { return $this->alt; }
    public function getImage(): string { return $this->image; }
    public function getOrdre(): int { return $this->ordre; }
}