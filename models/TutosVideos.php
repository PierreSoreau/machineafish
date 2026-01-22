<?php
class TutosVideos
{
    private ?int $id = null;
    private ?string $categorie = null;
    private ?string $video = null;
    private ?string $description = null;



    public function getId(): int
    {
        return $this->id;
    }
    public function getCategorie(): string
    {
        return $this->categorie;
    }
    public function getVideo(): ?string
    {
        return $this->video;
    }
    public function getDescription(): string
    {
        return $this->description;
    }
}
