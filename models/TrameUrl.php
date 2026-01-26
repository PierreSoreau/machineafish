<?php
class TrameUrl
{
    private ?int $id = null;
    private ?string $type_trame = null;
    private ?string $contenu = null;
    private ?string $extension = null;

    public function getId(): int
    {
        return $this->id;
    }
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }
    public function getTypeTrame(): string
    {
        return $this->type_trame;
    }

    public function setType_trame($type_trame)
    {
        $this->type_trame = $type_trame;

        return $this;
    }
    public function getContenu(): ?string
    {
        return $this->contenu;
    }
    public function setContenu($contenu)
    {
        $this->contenu = $contenu;

        return $this;
    }
    public function getExtension(): ?string
    {
        return $this->extension;
    }

    public function setExtension($extension)
    {
        $this->extension = $extension;

        return $this;
    }
}
