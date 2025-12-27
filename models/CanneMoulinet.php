<?php
class CanneMoulinet {
    public function __construct(
        private int $id,
        private int $canne_id,
        private int $moulinet_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getCanneId(): int { return $this->canne_id; }
    public function getMoulinetId(): int { return $this->moulinet_id; }
}