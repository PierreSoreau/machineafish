<?php

class SearchManager extends AbstractManager
{

    public function TriForPoissonPages()
    {

        $stopWords = [
            // --- Articles & Prépositions (Ta base) ---
            'le',
            'la',
            'les',
            'de',
            'du',
            'des',
            'un',
            'une',
            'au',
            'aux',
            'et',
            'est',
            'dans',
            'pour',
            'sur',
            'avec',
            'qui',
            'que',
            'à',
            'en',
            'par',
            'au-dessus',
            'en-dessous',

            // --- Pronoms & Démonstratifs ---
            'il',
            'ils',
            'elle',
            'elles',
            'lui',
            'se',
            'sa',
            'ça',
            'ses',
            'ces',
            'ce',
            'cet',
            'cette',
            'celui',
            'ceux',
            'celles',
            'mon',
            'ton',
            'son',
            'ma',
            'ta',
            'notre',
            'votre',
            'leur',
            'leurs',
            'nos',
            'vos',
            'eux',

            // --- Lettres orphelines (suite au nettoyage des apostrophes l', d', etc.) ---
            'l',
            'd',
            'n',
            's',
            'm',
            't',
            'j',
            'c',
            'qu',

            // --- Mots de liaison & Adverbes courants ---
            'comme',
            'comment',
            'aussi',
            'alors',
            'ainsi',
            'après',
            'avant',
            'donc',
            'ou',
            'où',
            'mais',
            'ni',
            'car',
            'or',
            'puis',
            'quand',
            'si',
            'sans',
            'sous',
            'vers',
            'très',
            'trop',
            'peu',
            'plus',
            'moins',
            'souvent',
            'toujours',
            'parfois',
            'jamais',
            'ici',
            'là',
            'également',

            // --- Verbes communs ---
            'être',
            'avoir',
            'faire',
            'sont',
            'ont',
            'font',
            'fait',
            'avez',
            'suis',
            'es',
            'été',
            'eu',

            // --- Spécifique au code ---
            "temp1",
            "temp2",
            "temp3",
            "temp4"
        ];

        //string_agg permet de rassembler tous les mots d'une même catégorie en une seule cellule 
        //et après faut faire un groupe by une catégorie pour vraiment que l'agrégat s'active
        $query = $this->db->prepare("SELECT poisson.nom,
    STRING_AGG(DISTINCT poisson_description.description, ' ') as toutes_drescription,
    STRING_AGG(DISTINCT alimentation.alt, ' ') as tous_aliments,
    STRING_AGG(DISTINCT habitat.habitat, ' ') as tous_habitats,
    STRING_AGG(DISTINCT spot.alt, ' ') as tous_spots   
    FROM poisson
    LEFT JOIN poisson_description ON poisson.id=poisson_description.poisson_id
    LEFT JOIN poisson_alimentation ON poisson.id=poisson_alimentation.poisson_id
    LEFT JOIN alimentation ON poisson_alimentation.alimentation_id=alimentation.id 
    LEFT JOIN poisson_habitat ON poisson.id=poisson_habitat.poisson_id
    LEFT JOIN habitat ON poisson_habitat.habitat_id=habitat.id
    LEFT JOIN poisson_spot ON poisson.id=poisson_spot.poisson_id
    LEFT JOIN spot ON poisson_spot.spot_id=spot.id
    
    GROUP BY poisson.nom");


        $query->execute();
        $tableaumotsbruts = $query->fetchAll(PDO::FETCH_ASSOC);

        // 3. On construit le dictionnaire de mots uniques
        $dictionnairepoissons = [];

        foreach ($tableaumotsbruts as $row) {

            //on rassemble les données de chaque ligne dans un seul tableau en mettant un espace entre chaque mot

            $grostableau = $row['nom'] . ' ' . $row['toutes_drescription'] . ' ' . $row['tous_aliments'] . ' ' . $row['tous_habitats'] . ' ' . $row['tous_spots'];

            $nomDuPoisson = $row['nom'];
            $dictionnairepoissons[$nomDuPoisson] = [];
            //on retire les ponctuations et on met tout en minuscule en remplaçant les ponctuations par des espaces pour éviter de coller les mots 
            $tableaupropre = str_replace([',', '.', ';', ':'], ' ', mb_strtolower($grostableau));

            //on divise le tableau mot par mot: exemple: on passe de ça ["le brochet roi des lacs"] à ça:  [0 => "le", 1 => "brochet" 2=> "roi", 3 => "des", 4 => "lacs"]

            $mots = explode(' ', $tableaupropre);

            foreach ($mots as $mot) {
                //on supprime les espaces en trop
                $mot = trim($mot);

                //si le mot existe et qu'il n'est pas dans la liste des mots interdits et qu'il peut plus de 2 caractères alors on l'ajoute dans le dictionnaire
                if (!empty($mot) && !in_array($mot, $stopWords) && mb_strlen($mot) > 2) {
                    $dictionnairepoissons[$nomDuPoisson][] = $mot;
                }
            }

            //supprime les doublons de mots 
            $dictionnairepoissons[$nomDuPoisson] = array_unique($dictionnairepoissons[$nomDuPoisson]);
        }

        return $dictionnairepoissons;
    }

    public function TriForTutosPage()
    {

        $stopWords = [
            // --- Articles & Prépositions (Ta base) ---
            'le',
            'la',
            'les',
            'de',
            'du',
            'des',
            'un',
            'une',
            'au',
            'aux',
            'et',
            'est',
            'dans',
            'pour',
            'sur',
            'avec',
            'qui',
            'que',
            'à',
            'en',
            'par',
            'au-dessus',
            'en-dessous',

            // --- Pronoms & Démonstratifs ---
            'il',
            'ils',
            'elle',
            'elles',
            'lui',
            'se',
            'sa',
            'ça',
            'ses',
            'ces',
            'ce',
            'cet',
            'cette',
            'celui',
            'ceux',
            'celles',
            'mon',
            'ton',
            'son',
            'ma',
            'ta',
            'notre',
            'votre',
            'leur',
            'leurs',
            'nos',
            'vos',
            'eux',

            // --- Lettres orphelines (suite au nettoyage des apostrophes l', d', etc.) ---
            'l',
            'd',
            'n',
            's',
            'm',
            't',
            'j',
            'c',
            'qu',

            // --- Mots de liaison & Adverbes courants ---
            'comme',
            'comment',
            'aussi',
            'alors',
            'ainsi',
            'après',
            'avant',
            'donc',
            'ou',
            'où',
            'mais',
            'ni',
            'car',
            'or',
            'puis',
            'quand',
            'si',
            'sans',
            'sous',
            'vers',
            'très',
            'trop',
            'peu',
            'plus',
            'moins',
            'souvent',
            'toujours',
            'parfois',
            'jamais',
            'ici',
            'là',
            'également',

            // --- Verbes communs ---
            'être',
            'avoir',
            'faire',
            'sont',
            'ont',
            'font',
            'fait',
            'avez',
            'suis',
            'es',
            'été',
            'eu',

        ];


        $query = $this->db->prepare("SELECT tutos_videos.description, tutos_videos.categorie       
    FROM tutos_videos");


        $query->execute();
        $tableaumotsbruts = $query->fetchAll(PDO::FETCH_ASSOC);

        $disctionnairetutos = [];


        foreach ($tableaumotsbruts as $row) {

            //on rassemble les données de chaque ligne dans un seul tableau en mettant un espace entre chaque mot
            $grostableau = $row['description'] . ' ' . $row['categorie'];

            //on retire les ponctuations et on met tout en minuscule en remplaçant les ponctuations par des espaces pour éviter de coller les mots 
            $tableaupropre = str_replace([',', '.', ';', ':'], ' ', mb_strtolower($grostableau));

            //on divise le tableau mot par mot: exemple: on passe de ça ["le brochet roi des lacs"] à ça:  [0 => "le", 1 => "brochet" 2=> "roi", 3 => "des", 4 => "lacs"]

            $mots = explode(' ', $tableaupropre);

            foreach ($mots as $mot) {
                //on supprime les espaces en trop
                $mot = trim($mot);

                //si le mot existe et qu'il n'est pas dans la liste des mots interdits et qu'il peut plus de 2 caractères alors on l'ajoute dans le dictionnaire
                if (!empty($mot) && !in_array($mot, $stopWords) && mb_strlen($mot) > 2) {
                    $disctionnairetutos[] = $mot;
                }
            }

            //supprime les doublons de mots 
            $disctionnairetutos = array_unique($disctionnairetutos);
        }

        return $disctionnairetutos;
    }

    public function comparaisonWords(string $wordsuser, array $tabledata)
    {

        $stopWords = [
            // --- Articles & Prépositions (Ta base) ---
            'le',
            'la',
            'les',
            'de',
            'du',
            'des',
            'un',
            'une',
            'au',
            'aux',
            'et',
            'est',
            'dans',
            'pour',
            'sur',
            'avec',
            'qui',
            'que',
            'à',
            'en',
            'par',
            'au-dessus',
            'en-dessous',

            // --- Pronoms & Démonstratifs ---
            'il',
            'ils',
            'elle',
            'elles',
            'lui',
            'se',
            'sa',
            'ça',
            'ses',
            'ces',
            'ce',
            'cet',
            'cette',
            'celui',
            'ceux',
            'celles',
            'mon',
            'ton',
            'son',
            'ma',
            'ta',
            'notre',
            'votre',
            'leur',
            'leurs',
            'nos',
            'vos',
            'eux',

            // --- Lettres orphelines (suite au nettoyage des apostrophes l', d', etc.) ---
            'l',
            'd',
            'n',
            's',
            'm',
            't',
            'j',
            'c',
            'qu',

            // --- Mots de liaison & Adverbes courants ---
            'comme',
            'comment',
            'aussi',
            'alors',
            'ainsi',
            'après',
            'avant',
            'donc',
            'ou',
            'où',
            'mais',
            'ni',
            'car',
            'or',
            'puis',
            'quand',
            'si',
            'sans',
            'sous',
            'vers',
            'très',
            'trop',
            'peu',
            'plus',
            'moins',
            'souvent',
            'toujours',
            'parfois',
            'jamais',
            'ici',
            'là',
            'également',

            // --- Verbes communs ---
            'être',
            'avoir',
            'faire',
            'sont',
            'ont',
            'font',
            'fait',
            'avez',
            'suis',
            'es',
            'été',
            'eu',

        ];

        //on tranforme la recherche en minuscule et on supprime les espaces en trop        
        $wordsuser = mb_strtolower(trim($wordsuser));

        $tableaupropre = str_replace([',', '.', ';', ':'], ' ', $wordsuser);

        // On transforme la phrase en tableau de mots en utilisant les espace comme séparateur ex: le grand brochet ça donne [0=>"le",1=>"grand ...]
        $motsRecherches = explode(' ',  $tableaupropre);

        // 2. On filtre pour enlever les entrées vides (comme les doubles espaces)
        $motsNettoyes = array_filter($motsRecherches);

        // 3. On réindexe le tableau de 0 à X
        $motsFinaux = array_values($motsNettoyes);

        // On filtre pour ne garder que les mots importants (ex: "le brochet" -> "brochet")
        $motsFiltres = array_diff($motsFinaux, $stopWords);


        $tableauDesResultats = [];

        // BOUCLE 1 : On prend chaque mot tapé par l'utilisateur (ex: "Canne", "Brochrt")
        foreach ($motsFiltres as $motUser) {

            // BOUCLE 2 : On parcourt chaque catégorie/page de ta base de données
            // $cleResultat = "Brochet", "materiel", "tutos"...
            // $listeMotsCles = Le tableau des mots associés ['dents', 'eau'...]
            foreach ($tabledata as $cleResultat => $listeMotsCles) {

                // Sécurité : on vérifie que c'est bien un tableau
                if (is_array($listeMotsCles)) {

                    // BOUCLE 3 : On parcourt tous les mots-clés de cette catégorie
                    foreach ($listeMotsCles as $motDatabase) {

                        // Calcul de la distance (nombre de fautes de frappe)
                        $distance = levenshtein($motUser, $motDatabase);

                        if ($distance <= 1) {
                            // 1. On ajoute la catégorie aux résultats
                            $tableauDesResultats[] = $cleResultat;

                            // 2. IMPORTANT : On sort de la boucle 3 (break)
                            // Si on a trouvé que "Brochet" contient "carnassier", 
                            // inutile de tester les 50 autres mots du brochet.
                            // On passe directement à la catégorie suivante (ex: Sandre)
                            break;
                        }
                    }
                }
            }
        }

        // On nettoie les doublons à la fin et on réindexe
        $resultatsUniques = array_unique($tableauDesResultats);
        return array_values($resultatsUniques);
    }

    public function findSpecificCards(array $categories)
    {

        if (empty($categories)) {
            return ["titre" => "Aucun résultat pour la recherche", "image" => "lose_search", "alt" => "logo aucun résultat", "lien" => "/"];
        }

        //on créé une chaîne de caractère de points d'interrogations "?,?,?" 
        //avec le même nombre de points d'interrogations que le nombre de catégories dans $categories 
        //pour préparer la place aux catégories et éviter l'injection SQL par des pirates
        $placeholders = implode(',', array_fill(0, count($categories), '?'));

        $query = $this->db->prepare("SELECT *     
    FROM contenucards
    WHERE contenucards.categorie IN ($placeholders)");


        $query->execute($categories);
        $specificcards = $query->fetchAll(PDO::FETCH_CLASS);

        return $specificcards;
    }
}
