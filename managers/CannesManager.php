<?php

class CannesManager extends AbstractManager
{

    function cannes(array $donneesQuiz, array $leurres): array
    {
        if (empty($leurres)) {
            return [];
        }

        // 1. Préparation des critères de base (Lieu + Espèce)
        $etendue_eau = ($donneesQuiz['etendue_eau'] === "petite étendue d'eau") ? 1 : 2;
        $espece = $donneesQuiz['poisson_nom'];


        // CORRECTION PUISSANCE MINIMALE POUR SILURE
        // Si c'est du Silure, on interdit les cannes qui finissent en dessous de 80g de puissance max
        // Quitte à ce que la plage basse soit "mauvaise" pour le leurre (on lancera moins loin, mais on sortira le poisson)

        $minPuissanceMax = 0;
        if ($espece === 'silure') {
            $minPuissanceMax = 80; // La canne doit pouvoir monter au moins à 80g (ex: une 30-80g ou 40-100g)
        }

        // 2. On récupère TOUTES les cannes qui ont la bonne ACTION et la bonne LONGUEUR
        // (On ne filtre pas encore par poids)
        $sql = '
            SELECT DISTINCT
                c.id,
                c.action,
                c.poids_mini,
                c.poids_maxi,
                c.longueur,
                c.puissance
            FROM canne c
            JOIN regles_especes_canne re ON c.action = re.action
            WHERE re.espece_cible = :espece
              AND c.etendue_eau = :etendue_eau
              AND c.poids_maxi >= :min_puissance_max 
        ';

        $query = $this->db->prepare($sql);
        $query->execute([
            "espece" => $espece,
            "etendue_eau" => $etendue_eau,
            "min_puissance_max" => $minPuissanceMax
        ]);

        $cannesCandidates = $query->fetchAll(PDO::FETCH_ASSOC);

        // ALGO QUI PERMET DE SELECTIONNER PARMI LES CANNES SELECTIONNEES PAR SQL, CELLE QUI ENGLOBE LE PLUS DE LEURRE DANS SA PLAGE DE PUISSANCE
        // ET AVEC LA PUISSANCE MINIMALE LA PLUS PROCHE DU POIDS LE PLUS FAIBLE DES LEURRES (parce quon cherche toujours à avoir des leurres les moins lourds possibles) 
        $bestCanne = [];
        $maxScore = -1;
        $bestDiffMin = 9999; // Pour départager sur le poids mini

        // On calcule le poids min global des leurres pour le départage
        $poidsLeurreMinGlobal = 9999;
        foreach ($leurres as $typeLeurre => $infosType) {
            if (isset($infosType['donnees']) && is_array($infosType['donnees'])) {
                foreach ($infosType["donnees"] as $donnee) {
                    if ($donnee['poids_leurre'] < $poidsLeurreMinGlobal) $poidsLeurreMinGlobal = $donnee['poids_leurre'];
                }
            }
        }

        foreach ($cannesCandidates as $canne) {
            $score = 0; // Nombre de leurres compatibles

            foreach ($leurres as $typeLeurre => $infosType) {
                if (isset($infosType['donnees']) && is_array($infosType['donnees'])) {
                    foreach ($infosType["donnees"] as $donnee) {
                        $poids = $donnee['poids_leurre'];
                        // Est-ce que cette canne peut lancer ce leurre ?
                        if ($poids >= $canne['poids_mini'] && $poids <= $canne['poids_maxi']) {
                            $score++;
                        }
                    }
                }
            }

            // Calcul de la proximité avec le leurre le plus léger (pour départager)
            $diffMin = abs($canne['poids_mini'] - $poidsLeurreMinGlobal);

            // EST-CE LA MEILLEURE CANNE ?
            // Critère 1 : Celle qui couvre le plus de leurres
            if ($score > $maxScore) {
                $maxScore = $score;
                $bestCanne = $canne;
                $bestDiffMin = $diffMin;
            }
            // Critère 2 (si égalité) : Celle qui est la plus proche du poids mini demandé
            elseif ($score === $maxScore) {
                if ($diffMin < $bestDiffMin) {
                    $bestCanne = $canne;
                    $bestDiffMin = $diffMin;
                }
            }
        }

        return $bestCanne ?: [];
    }
}
