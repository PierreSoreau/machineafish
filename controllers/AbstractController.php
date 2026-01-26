<?php

class AbstractController
{
    private \Twig\Environment $twig;
    protected \PDO $db;
    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader('templates');
        $twig = new \Twig\Environment($loader, [
            'debug' => true,
        ]);

        //j'ai instancié UrlManager directement dans AbstractController pour l'ajouter dans addGlobal de twig 
        //et ainsi pouvoir voir accès directement aux données que renvoie findImageByPage("header") sur chacune des pages 
        //sans que je sois obligé d'instancier dans chacune des fonctions relatives aux pages dans mon Usercontroller

        $url = new UrlManager();
        $logosite = $url->findImageByTheme("logo_site");
        $logorechercher = $url->findImageByTheme("logo_rechercher");
        $fondcailloux = $url->findImageByTheme("fond_riviere_cailloux");
        $extensionurl = $url->findExtensionByType("image");
        $contenuurl = $url->findContenuByType("image");
        $twig->addGlobal('repeat', [
            "logosite" => $logosite,
            "logorechercher" => $logorechercher,
            "fondcailloux" => $fondcailloux,
            "extensionurl" => $extensionurl,
            "contenuurl" => $contenuurl
        ]);

        $twig->addExtension(new \Twig\Extension\DebugExtension());
        $this->twig = $twig;
    }

    protected function render(string $template, array $data): void
    {
        echo $this->twig->render($template, $data);
    }

    protected function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }
}
