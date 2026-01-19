<?php
class Poisson {
    
        private ?int $id=null;
        private ?string $nom=null;
        private ?string $logo=null;
        private ?string $image=null;
        private ?string $image_presentation=null;
        private ?string $image_reproduction=null;
        private ?string $video_food=null;
        private ?string $description_food=null;
        private ?string $video_reprod=null;
        
    

    public function getId(): ?int { return $this->id; }
    public function getNom(): ?string { return $this->nom; }
    public function getLogo(): ?string { return $this->logo; }
    public function getImage(): ?string { return $this->image; }
    public function getImagePresentation(): ?string { return $this->image_presentation; }
    public function getImageReproduction(): ?string { return $this->image_reproduction; }
    public function getVideoFood(): ?string { return $this->video_food; }
    public function getDescriptionFood(): ?string { return $this->description_food; }
    public function getVideoReprod(): ?string { return $this->video_reprod; }

    
}
