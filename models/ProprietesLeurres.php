<?php
class ProprietesLeurres
{
    private ?int $type_leurre = null;
    private ?string $compatible_encombre = null;
    private ?string $type_texan_conseille = null;
    private ?string $url_photo = null;


    public function getTypeLeurre(): string
    {
        return $this->type_leurre;
    }

    public function getCompatibleEncombre()
    {
        return $this->compatible_encombre;
    }

    public function getTypeTexanConseille()
    {
        return $this->type_texan_conseille;
    }

    public function getUrlPhoto()
    {
        return $this->url_photo;
    }
}
