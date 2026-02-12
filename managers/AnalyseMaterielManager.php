<?php

class AnalyseMaterielManager extends AbstractManager
{

    public function findInfos()
    {

        $infosdata = '
        SELECT *
        FROM analyse_materiel 
    ';

        $query = $this->db->prepare($infosdata);
        $query->execute();

        $infos = $query->fetchAll(PDO::FETCH_ASSOC);

        return $infos;
    }

    public function findInfosLeurres()
    {

        $infosdata = "
        SELECT *
        FROM analyse_materiel 
        WHERE analyse_materiel.type_materiel='leurre'
        ORDER BY analyse_materiel.id ASC
    ";

        $query = $this->db->prepare($infosdata);
        $query->execute();

        $infos = $query->fetchAll(PDO::FETCH_ASSOC);

        return $infos;
    }
}
