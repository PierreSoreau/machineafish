<?php
class PoissonLeurre {
    public function __construct(
        private int $id,
        private int $leurre_id,
        private int $poisson_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getLeurreId(): int { return $this->leurre_id; }
    public function getPoissonId(): int { return $this->poisson_id; }
}