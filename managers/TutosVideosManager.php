<?php

class TutosVideosManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function findAll()
    {
        $query = $this->db->prepare('SELECT * FROM tutos_videos ');


        $query->execute();
        $tutosdata = $query->fetchAll(PDO::FETCH_CLASS, 'TutosVideos');


        return $tutosdata;
    }
}
