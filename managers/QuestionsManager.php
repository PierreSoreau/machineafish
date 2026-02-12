<?php

class QuestionsManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function findAll()
    {
        $query = $this->db->prepare('SELECT * FROM questions ORDER BY id ASC ');


        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        $questions = [];

        foreach ($results as $result) {

            $question = new Questions(
                $result["id"],
                $result["contenu_question"],
                $result["options"]
            );

            $questions[] = $question;
        }


        return $questions;
    }

    public function findAllQuestionsImages()
    {

        $query = $this->db->prepare("SELECT * FROM imagesautres WHERE imagesautres.page='questions' ORDER BY imagesautres.ordre ASC");


        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }
}
