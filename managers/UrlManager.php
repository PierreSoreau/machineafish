<?php

class UrlManager extends AbstractManager
{


    public function findExtensionByType(string $type_trame): string
    {

        $query = $this->db->prepare(
            'SELECT trame_url.extension   
            FROM  trame_url
            WHERE  trame_url.type_trame = :type_trame      
        '
        );
        $query->execute(['type_trame' => $type_trame]);

        $extension = $query->fetchColumn();



        return $extension;
    }

    public function findContenuByType(string $type_trame): string
    {

        $query = $this->db->prepare(
            'SELECT trame_url.contenu   
            FROM  trame_url
            WHERE  trame_url.type_trame = :type_trame      
        '
        );
        $query->execute(['type_trame' => $type_trame]);

        $contenu = $query->fetchColumn();



        return $contenu;
    }

    public function findVideoByPage(string $page): string
    {
        $query = $this->db->prepare(
            'SELECT videos.url   
            FROM  videos
            WHERE  videos.page = :page      
        '
        );
        $query->execute(['page' => $page]);

        $url = $query->fetchColumn();

        return $url;
    }

    public function findImageByTheme(string $theme): string
    {
        $query = $this->db->prepare(
            'SELECT imagesautres.url   
            FROM  imagesautres
            WHERE  imagesautres.theme = :theme      
        '
        );
        $query->execute(['theme' => $theme]);

        $url = $query->fetchColumn();

        return $url;
    }

    public function findImageByPage(string $page)
    {
        $query = $this->db->prepare(
            'SELECT imagesautres.url   
            FROM  imagesautres
            WHERE  imagesautres.page = :page     
        '
        );
        $query->execute(['page' => $page]);

        $url = $query->fetchAll(PDO::FETCH_ASSOC);

        return $url;
    }
}
