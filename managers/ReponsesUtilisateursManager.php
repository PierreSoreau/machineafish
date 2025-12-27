<?php

class ReponsesUtilisateursManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function saveAll(array $answers, string $userId ):void
    {
        $query = $this->db->prepare('INSERT INTO reponses_utilisateurs(questions_id, reponse, user_id, created_at) VALUES (:questions_id, :reponse, :user_id, NOW()) ');
           

        foreach ($answers as $questionId => $reponse) { 
            $parameters = [
            "questions_id" => $questionId,
            "reponse" => $reponse,
            "user_id"=>$userId            

        ];                
            
            $query->execute($parameters);
        }          
        

        
    }
}



?>