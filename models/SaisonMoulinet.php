<?php
class SaisonMoulinet {
    public function __construct(
        private int $id,
        private string $saison_id,
        private int $moulinet_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getSaisonId(): string { return $this->saison_id; }
    public function getMoulinetId(): int { return $this->moulinet_id; }
}