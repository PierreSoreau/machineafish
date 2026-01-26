<?php
class Videos
{
    private ?int $id = null;
    private ?string $url = null;
    private ?string $page = null;


    public function getId(): int
    {
        return $this->id;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function getPage()
    {
        return $this->page;
    }
}
