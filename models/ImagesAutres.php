<?php
class ImagesAutres
{
    private ?int $id = null;
    private ?string $page = null;
    private ?string $theme = null;
    private ?string $url = null;


    public function getId(): int
    {
        return $this->id;
    }

    public function getTheme()
    {
        return $this->theme;
    }

    public function getPage()
    {
        return $this->page;
    }

    public function getUrl()
    {
        return $this->url;
    }
}
