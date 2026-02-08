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
}
