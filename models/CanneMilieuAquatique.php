<?php
class CanneMilieuAquatique {
    public function __construct(
        private int $id,
        private int $canne_id,
        private int $milieu_id
    ) {}

    public function getId(): int { return $this->id; }
    public function getCanneId(): int { return $this->canne_id; }
    public function getMilieuId(): int { return $this->milieu_id; }
}