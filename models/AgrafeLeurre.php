<?php
class AgrafeLeurre {
    public function __construct(
        private int $id,
        private int $leurre_id,
        private int $agrafe_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getLeurreId(): int { return $this->leurre_id; }
    public function getAgrafeId(): int { return $this->agrafe_id; }
}