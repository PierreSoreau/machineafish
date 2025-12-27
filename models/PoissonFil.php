<?php
class PoissonFil {
    public function __construct(
        private int $id,
        private int $fil_id,
        private int $poisson_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getFilId(): int { return $this->fil_id; }
    public function getPoissonId(): int { return $this->poisson_id; }
}