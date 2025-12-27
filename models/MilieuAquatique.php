<?php
class MilieuAquatique {
    public function __construct(
        private int $id,
        private string $milieu
    ) {}

    public function getId(): int { return $this->id; }
    public function getMilieu(): string { return $this->milieu; }
}