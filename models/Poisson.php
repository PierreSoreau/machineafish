<?php
class Poisson implements \JsonSerializable{
    public function __construct(
        private int $id,
        private string $nom,
        private string $logo,
        private string $image
        
    ) {}

    public function getId(): int { return $this->id; }
    public function getNom(): string { return $this->nom; }
    public function getLogo(): string { return $this->logo; }
    public function getimage(): string { return $this->image; }

    public function jsonSerialize(): mixed {
    return [
        'id' => $this->id,
        'nom' => $this->nom,
        'logo' => $this->logo,
        'image' => $this->image
    ];
}
}