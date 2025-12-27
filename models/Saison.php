<?php
class Saison implements \JsonSerializable{
    public function __construct(
        private string $saison,
        private string $logo
    ) {}

    public function getSaison(): string { return $this->saison; }
    public function getLogo(): string { return $this->logo; }

    public function jsonSerialize(): mixed {
    return [
        'saison' => $this->saison,
        'logo' => $this->logo
        
    ];
}
}