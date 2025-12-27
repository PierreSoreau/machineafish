<?php
class ReponsesUtilisateurs {
    public function __construct(
        private int $id,
        private int $questions_id,
        private string $reponse,
        private string $user_id,
        private string $created_at
    ) {}

    public function getId(): int { return $this->id; }
    public function getQuestionsId(): int { return $this->questions_id; }
    public function getReponse(): string { return $this->reponse; }
    public function getUserId(): string { return $this->user_id; }
    public function getCreatedAt(): string { return $this->created_at; }
}