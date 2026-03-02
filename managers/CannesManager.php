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
        // ET AVEC L'ECART LE PLUS FAIBLE EN POIDS ENTRE 
        //LE POIDS DU LEURRE LE PLUS LOURD ET LE POIDSMAX QUE LA CANNE ACCEPTE

        // 1. On identifie le besoin RÉEL (Leurre le plus léger et Leurre le plus lourd)
        $poidsLeurreMinGlobal = 9999;
        $poidsLeurreMaxGlobal = -1;

        foreach ($leurres as $typeLeurre => $infosType) {
            if (isset($infosType['donnees']) && is_array($infosType['donnees'])) {
                foreach ($infosType["donnees"] as $donnee) {
                    $poids = $donnee['poids_leurre'];
                    if ($poids < $poidsLeurreMinGlobal) $poidsLeurreMinGlobal = $poids;
                    if ($poids > $poidsLeurreMaxGlobal) $poidsLeurreMaxGlobal = $poids;
                }
            }
        }

        // 2. On cherche la canne parfaite
        $bestCanne = [];
        $meilleurEcartMax = 9999; // On cherche la canne dont le max est juste au-dessus de notre besoin

        foreach ($cannesCandidates as $canne) {
            // CRITÈRE N°1 ABSOLU : La canne DOIT pouvoir lancer le leurre le plus lourd (Sinon elle casse)
            if ($canne['poids_maxi'] >= $poidsLeurreMaxGlobal) {

                // On calcule l'écart entre ce que la canne peut faire au max, et notre leurre le plus lourd
                $ecartMax = $canne['poids_maxi'] - $poidsLeurreMaxGlobal;

                // CRITÈRE N°2 : On prend celle qui est la plus "ajustée" (l'écart le plus petit)
                if ($ecartMax < $meilleurEcartMax) {
                    $meilleurEcartMax = $ecartMax;
                    $bestCanne = $canne;
                }
            }
        }

        // Si aucune canne ne peut lancer le leurre le plus lourd, on prend la plus puissante disponible en secours
        if (empty($bestCanne) && !empty($cannesCandidates)) {
            $bestCanne = $cannesCandidates[0];
            foreach ($cannesCandidates as $canne) {
                if ($canne['poids_maxi'] > $bestCanne['poids_maxi']) {
                    $bestCanne = $canne;
                }
            }
        }

        return $bestCanne;
    }
}
