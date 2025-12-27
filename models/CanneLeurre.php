<?php
class CanneLeurre {
    public function __construct(
        private int $id,
        private int $canne_id,
        private int $leurre_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getCanneId(): int { return $this->canne_id; }
    public function getLeurreId(): int { return $this->leurre_id; }
}