<?php

// --- Table: agrafe ---
class Agrafe {
    public function __construct(
        private int $id,
        private string $taille
    ) {}

    public function getId(): int { return $this->id; }
    public function getTaille(): string { return $this->taille; }
}