<?php

class RecettesManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function findRecepiesByFishName(string $poisson)
    {

        $query = $this->db->prepare("SELECT 
        r.titre, 
        r.difficulte, 
        r.temps_preparation, 
        r.prix,
        r.image_plat, 
        r.alt AS alt_recette,
        r.resume, 
        p.nom AS nom_poisson,
        recette_ustensiles.quantite_ustensile,
        recettes_ingredients.quantite_ingredient,
        recettes_ingredients.unite_quantite,
        u.nom AS nom_ustensile, 
        u.image AS image_ustensile, 
        u.alt AS alt_ustensile, 
        i.nom AS nom_ingredient, 
        i.image AS image_ingredient, 
        i.alt AS alt_ingredient 
        FROM recettes r
        JOIN poisson p ON recettes.poisson_id=poisson.id 
        JOIN recettes_ingredients ON recettes.id=recettes_ingredients.recette_id
        JOIN ingredients i ON recettes_ingredients.ingredient_id=ingredient.id
        JOIN recette_ustensiles ON recettes.id=recette_ustensiles.recette_id
        JOIN ustensile u ON recette_ustensiles.ustensile_id=u.id
        WHERE poisson.nom= :name
         ");
        $query->execute(["name" => $poisson]);

        $recepies = $query->fetchAll(PDO::FETCH_ASSOC);

        //là à ce stade le tableau renvoyé ne sera bien construit  
        //parce qu'on aura une ligne par ingrédient par exemple
        //on va donc le transformer en un tableau associatif de ce genre:
        /*[
    [
        'titre' => 'Brochet au beurre blanc',
        'difficulte' => 'Moyenne',
        'temps_preparation' => '45 min',
        'prix' => 'Abordable',
        'image_plat' => 'brochet-beurre.jpg',
        'alt_recette' => 'Plat de brochet',
        'resume' => 'Un grand classique de la cuisine française.',
        'nom_poisson' => 'Brochet',
        'ingredients' => [
            [
                'nom' => 'Beurre',
                'quantite' => 200,
                'unite' => 'grammes',
                'image' => 'beurre.jpg',
                'alt' => 'Plaquette de beurre'
            ],
            [
                'nom' => 'Echalotes',
                'quantite' => 3,
                'unite' => 'pièces',
                'image' => 'echalote.jpg',
                'alt' => 'Échalotes fraîches'
            ],
            [
                'nom' => 'Vin blanc',
                'quantite' => 15,
                'unite' => 'cl',
                'image' => 'vin.jpg',
                'alt' => 'Bouteille de vin blanc'
            ]
        ],
        'ustensiles' => [
            [
                'nom' => 'Casserole en cuivre',
                'quantite' => 1,
                'image' => 'casserole.jpg',
                'alt' => 'Petite casserole'
            ],
            [
                'nom' => 'Fouet',
                'quantite' => 1,
                'image' => 'fouet.jpg',
                'alt' => 'Fouet de cuisine'
            ]
        ]
    ]
]*/

        $finalRecepiesTable = [];



        foreach ($recepies as $recepie) {

            $titleRecepie = $recepie["titre"];


            if (!isset($finalRecepiesTable[$titleRecepie])) {
                $finalRecepiesTable[$titleRecepie] = [
                    "titre"             => $recepie["titre"],
                    'difficulte'        => $recepie['difficulte'],
                    'temps_preparation' => $recepie['temps_preparation'],
                    'prix'              => $recepie['prix'],
                    'image_plat'        => $recepie['image_plat'],
                    'alt_recette'       => $recepie['alt_recette'],
                    'resume'            => $recepie['resume'],
                    'nom_poisson'       => $recepie['nom_poisson'],
                    'ingredients'       => [],
                    'ustensiles'        => []

                ];
            }

            $finalRecepiesTable[$titleRecepie]["ingredients"][$recepie["nom_ingredient"]] = [
                'nom'      => $recepie["nom_ingredient"],
                'quantite' => $recepie['quantite_ingredient'],
                'unite'    => $recepie['unite_quantite'],
                'image'    => $recepie['image_ingredient'],
                'alt'      => $recepie['alt_ingredient']
            ];

            $finalRecepiesTable[$titleRecepie]["ustensiles"][$recepie["nom_ustensile"]] = [
                'nom'      => $recepie["nom_ustensile"],
                'quantite' => $recepie['quantite_ustensile'],
                'image'    => $recepie['image_ustensile'],
                'alt'      => $recepie['alt_ustensile']
            ];

            //array_values permet de supprimer les clés string et de les transformer comme ça:


            /*// APRÈS LE NETTOYAGE (array_values)
$finalRecepiesTable = [
    0 => [                   // ✨ La clé brochet au beurre blanc a été écrasée par 0
        'titre' => 'Brochet au beurre blanc',
        'ingredients' => [
            0 => [           // ✨ La clé "Beurre" a été écrasée par 0
                'nom' => 'Beurre',
                'quantite' => 200
            ],
            1 => [           // ✨ La clé "Echalotes" a été écrasée par 1
                'nom' => 'Echalotes',
                'quantite' => 3
            ]
        ]
    ]
];*/
        }
        $finalList = [];

        foreach ($finalRecepiesTable as $recette) {
            $recette["ingredients"] = array_values($recette["ingredients"]);
            $recette["ustensiles"] = array_values($recette["ustensiles"]);
            $finalList[] = $recette;
        }


        return $finalList;
    }
}
