<?php
class Alimentation {
    
    private int $id;
    private string $alimentation;
    private ?string $alt=null;
    private ?string $image=null;
    private int $ordre;
    private ?string $video=null;


    public function getId(): int { return $this->id; }
    public function getAlimentation(): string { return $this->alimentation; }
    public function getAlt(): ?string { return $this->alt; }
    public function getImage(): ?string { return $this->image; }
    public function getOrdre(): int { return $this->ordre; }
    public function getVideo(): ?string { return $this->video; }
}