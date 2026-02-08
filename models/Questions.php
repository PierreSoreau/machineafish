<?php
class Questions implements \JsonSerializable
{
    public function __construct(
        private int $id,
        private string $contenu_question,
        private string $options
    ) {}

    public function getId(): int
    {
        return $this->id;
    }
    public function getContenuQuestion(): string
    {
        return $this->contenu_question;
    }
    public function getOptions(): string
    {
        return $this->options;
    }
    // méthode qui permet de lire les objets de la classe questions par json_encode() 
    //parce que vu que les attributs sont private par défaut il ne peut pas les lire
    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'contenu_question' => $this->contenu_question,
            'options' => $this->options
        ];
    }
}
