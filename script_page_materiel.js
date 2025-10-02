const supabaseClient = supabase.createClient(
    "https://dbaqpiukoronlivotpcl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiYXFwaXVrb3Jvbmxpdm90cGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Nzc1NDEsImV4cCI6MjA2NjQ1MzU0MX0.7kXwZJDAOHZ5Ov9fehi3ORm5nqVDfE_xWfQY_C1FYro"
);
console.log("Connexion Supabase OK :", supabaseClient);

async function get_questions() {
    let { data: questions, error } = await supabaseClient
        .from('questions')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }
    return questions;
}
console.log("récupération des questions ok:", get_questions())

let currentindex = 0;
let questions = [];

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

// Vérifie si l'utilisateur a déjà un ID stocké dans le navigateur
let userID = localStorage.getItem('userID')
if (!userID || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userID)) {
    userID = generateUUID()
    localStorage.setItem('userID', userID)
}

console.log('UserID anonyme :', userID)

async function start_questionnaire() {
    currentindex = 0;
    questions = await get_questions();
    console.log("Questions récupérées :", questions);
    showquestion(currentindex);
}

function showquestion(index) {

    if (index >= questions.length) {
        showResult(userID);
        return;
    }

    let container = document.getElementById('questionnaire');
    if (!container) return;
    container.innerHTML = '';

    let q = questions[index];
    const utilisateur = userID;

    let questionaffiche = document.createElement('h2');
    questionaffiche.textContent = q.contenu_question;
    container.appendChild(questionaffiche);

    let options = [];
    try {
        options = q.options;
    } catch (e) {
        console.error("Options JSON invalide pour la question :", q, e);
    }

    options.forEach(element => {
        const btn = document.createElement('button');
        btn.textContent = element;
        btn.style.margin = '10px';
        btn.style.fontSize = '1.5em';
        btn.onclick = () => {
            saveAnswer(q.id, element, utilisateur);
            currentindex++;
            showquestion(currentindex);
        }
        container.appendChild(btn);
    });

}

async function saveAnswer(questionId, answer, userID) {
    const { data, error } = await supabaseClient
        .from('reponses_utilisateurs')
        .insert([{ questions_id: questionId, reponse: answer, user_id: userID }]);
    if (error) console.error(error);
}

async function getUserAnswers(userID) {

    if (!userID) {
        console.warn("⚠️ Aucun userID défini – réponses par défaut utilisées.");
        return defaultAnswers;
    }
    const { data: reponses, error } = await supabaseClient
        .from('reponses_utilisateurs')
        .select('questions_id, reponse, created_at')
        .eq('user_id', userID)
        .order('created_at', { ascending: false }) // les plus récentes d’abord
        .limit(1000); // maximum autorisé

    if (error) {
        console.error("Erreur récupération réponses :", error);
        return null;
    }

    console.log("voilà les réponses init:", reponses)

    // on garde uniquement la dernière réponse par question
    const lastAnswers = {};
    for (const rep of reponses) {
        if (!lastAnswers[rep.questions_id]) {
            lastAnswers[rep.questions_id] = rep.reponse;
        }
    }

    console.log("voilà les réponses finales:", lastAnswers)

    const answers =
    {
        etendue: lastAnswers[1] || null,
        poisson: lastAnswers[2] || null,
        taillePoisson: lastAnswers[3] || null,
        saison: lastAnswers[4] || null,
        courant: lastAnswers[6] || null,
        encombrement: lastAnswers[7] || null,
    }

    console.log("réponses finales:", answers)

    return answers

}



//---------------TROUVER LES TYPES DE LEURRES ADAPTES A L'UTILISATEUR-----------------------

async function getrecommendedleurre(userID) {
    console.log("🔍 userID au moment d'appel :", userID);
    const answer = await getUserAnswers(userID);

    const { data: poissondata, error } = await supabaseClient
        .from('poisson')
        .select('id')
        .eq('nom', answer.poisson);

    if (error) {
        console.error("Erreur récupération poissonid :", error);
        return [];
    }

    const poissondatafinal = poissondata[0].id;

    const { data: leurreID, error1 } = await supabaseClient
        .from('poisson_leurre')
        .select('leurre_id')
        .eq('poisson_id', poissondatafinal);

    if (error1) {
        console.error("Erreur récupération poissonid :", error1);
        return [];
    }

    const leurreIDfinal = leurreID.map(c => c.leurre_id)

    let query = supabaseClient
        .from('leurre')
        .select('*')
        .in('id', leurreIDfinal);

    const { data: leurres, error2 } = await query;

    if (error2) {
        console.error(error2);
        return [];
    }

    console.log("visuel table leurre filtré:", leurres)

    // On filtre par type de leurre et on garde la taille max pour chaque type
    const maxByType = {};
    leurres.forEach(l => {
        if (!maxByType[l.nom]) {
            // Première occurrence → on crée un tableau avec ce leurre
            maxByType[l.nom] = [l];
        } else {
            const currentMaxSize = maxByType[l.nom][0].taille;
            if (l.taille > currentMaxSize) {
                // Si on trouve une taille plus grande → on remplace par ce seul leurre
                maxByType[l.nom] = [l];
            } else if (l.taille === currentMaxSize) {
                // Si la taille est égale au max existant → on ajoute dans le tableau
                maxByType[l.nom].push(l);
            }
        }
    });

    console.log("valeur maxbytype:", maxByType)

    let result;

    const leurresParPoissonSaison = {
        perche: {
            printemps: ["grub", "shad", "tube bait", "cuillère tournante", "spintail", "lame vibrante"],
            été: ["popper", "frog", "jerkbait", "stickbait", "stickbait", "leurre à hélice", "cuillère tournante", "spintail", "lame vibrante", "grub", "shad"],
            automne: ["chatterbait", "spinnerbait", "lipless", "minnow", "shad", "spintail", "lame vibrante", "grub"],
            hiver: ["shad","jig", "grub"]
        },
        sandre: {
            printemps: ["minnow", "shad","grub"],
            été: ["jerkbait", "swimbait", "spinnerbait", "shad", "lame vibrante"],
            automne: ["crankbait", "tube bait", "lipless", "grub", "shad"],
            hiver: ["grub", "jig", "shad", "lame vibrante"]
        },
        brochet: {
            printemps: ["frog", "jerkbait", "creature", "shad", "spinnerbait", "cuillère tournante", "lame vibrante", "crawler", "grub"],
            été: ["glidebait", "swimbait", "stickbait", "spinnerbait", "shad", "popper", "leurre à hélice", "cuillère tournante", "crawler", "grub"],
            automne: ["crankbait", "stickbait", "lipless", "shad", "swimbait", "jerkbait", "lame vibrante", "grub"],
            hiver: ["shad", "jig", "rubberjig", "grub"]
        },
        silure: {
            printemps: ["glidebait", "swimbait", "shad", "grub"],
            été: ["shad", "jig", "grub"],
            automne: ["rubberjig", "glidebait", "shad", "grub"],
            hiver: ["jig", "rubberjig", "shad", "grub"]
        }
    };

    if (answer.taillePoisson === "oui, je veux mon poisson record") {
        // Résultat : tableau des leurres max par type
        result = Object.values(maxByType).flat();
        console.log("resultat leurre après filtre taille poisson oui:", result);
    }

    else if (answer.taillePoisson === "non, j'aurais tout autant du plaisir à pêcher un poisson de taille modeste") {
        result = leurres.filter(l => {
            const maxLeurre = maxByType[l.nom][0]; // le plus gros leurre de ce type
            return l.taille < maxLeurre.taille; // on garde seulement les plus petits
        });
    }

    console.log("resultat leurre après filtre taille poisson:", result)

    if (leurresParPoissonSaison[answer.poisson]?.[answer.saison]) {
        const saisonLures = leurresParPoissonSaison[answer.poisson][answer.saison].map(l =>
            typeof l === "string" ? l : l.nom);
        result = result.filter(l => saisonLures.includes(l.nom));

    }

    console.log("resultat leurre après filtre saison:", result)

    if (answer.courant && answer.courant === "oui") {
        result = result.filter(l => l.courant === answer.courant || l.courant === "oui et non")
    }

    if (answer.courant && answer.courant === "non") {
        result = result.filter(l => l.courant === answer.courant || l.courant === "oui et non")
    }


    console.log("resultat leurre après filtre courant:", result)

    if (answer.encombrement && answer.encombrement === "oui") {
        result = result.filter(l => l.encombrement === answer.encombrement)
    }

    console.log("resultat leurre après filtre encombrement:", result)

    console.log("voici les leurres adaptés:", result);

    return result;



}

//---------------------------------------------------------------------------------



//---------------TROUVER LES TYPES DE FIL ADAPTES A L'UTILISATEUR-----------------------

async function getrecommendedfil(userID) {
    const answer = await getUserAnswers(userID);

    const { data: poissondata, error } = await supabaseClient
        .from('poisson')
        .select('id')
        .eq('nom', answer.poisson);

    if (error) {
        console.error("Erreur récupération poissonid :", error);
        return [];
    }

    const poissondatafinal = poissondata[0].id;



    const { data: filid, error1 } = await supabaseClient
        .from('poisson_fil')
        .select('fil_id')
        .eq('poisson_id', poissondatafinal);

    if (error1) {
        console.error("Erreur récupération filid :", error1);
        return [];
    }

    const filidfinal = filid.map(c => c.fil_id);

    let query = supabaseClient
        .from('fil')
        .select('*')
        .in('id', filidfinal)

    console.log(answer.taillePoisson)


    if (answer.taillePoisson === "oui, je veux mon poisson record") {
        query = query
            .eq('gros_specimen', "oui");
    }

    else if (answer.taillePoisson === "non, j'aurais tout autant du plaisir à pêcher un poisson de taille modeste") {

        query = query
            .is('gros_specimen', null);
    }

    const { data, error: filFinalError } = await query;
    if (filFinalError) console.error(filFinalError);

    console.log("Poisson choisi :", answer.poisson);
    console.log("Taille poisson :", answer.taillePoisson);
    console.log("Fil IDs :", filidfinal);

    console.log("voici les fils adaptés:", data);

    return data;



}

//---------------------------------------------------------------------------------

//---------------TROUVER LES CANNES ADAPTEES A L'UTILISATEUR-----------------------

async function getrecommendedcanne(userID) {
    const answers = await getUserAnswers(userID);
    const leurres = await getrecommendedleurre(userID)


    const { data: milieuData, error1 } = await supabaseClient
        .from('milieu_aquatique')
        .select('id')
        .eq('milieu', answers.etendue); // etendue = texte de la réponse

    console.log("données milieu:", milieuData)

    if (error1) {
        console.error("Erreur récupération milieu :", error1);
        return [];
    }

    if (!milieuData || milieuData.length === 0) {
        console.log("Aucun milieu trouvé pour cette réponse, utilisateur a pas encore répondu");
        return [];
    }

    const milieuId = milieuData[0].id;

    const { data: canneMilieuData, error2 } = await supabaseClient
        .from('canne_milieu_aquatique')
        .select('canne_id')
        .eq('milieu_id', milieuId);

    console.log("id canne de base canne/milieu:", canneMilieuData)

    if (error2) {
        console.error("Erreur récupération canneid :", error2);
        return [];
    }

    if (!canneMilieuData || canneMilieuData.length === 0) {
        console.log("Aucune canneid trouvé pour cette réponse");
        return [];
    }

    const canneIDmilieu = canneMilieuData.map(cm => cm.canne_id);


    console.log("id canne de base canne/milieu après map:", canneIDmilieu)

    const IDLeurre = leurres.map(l => l.id);

    const { data: canneleurredata, error4 } = await supabaseClient
        .from('canne_leurre')
        .select('canne_id')
        .in('leurre_id', IDLeurre);


    console.log("id canne après filtre leurre:", canneleurredata)

    if (error4) {
        console.error("Erreur récupération canneid :", error4);
        return [];
    }

    if (!canneleurredata || canneleurredata.length === 0) {
        console.log("Aucune canneid trouvé pour cette réponse");
        return [];
    }

    const canneIDleurre = canneleurredata.map(cm => cm.canne_id);

    const canneIDsFinal = canneIDmilieu
        .filter(id => canneIDleurre.includes(id));


    console.log("id des cannes filtrés après filtre milieu et leurres:", canneIDsFinal)



    if (canneIDsFinal.length === 0) return [];

    let query = supabaseClient
        .from('canne')
        .select('*')
        .in('id', canneIDsFinal)

    /*console.log("base des cannes avant filtre taille poisson:", query)

    if (answers.taillePoisson === "oui, je veux mon poisson record" && answers.poisson === "brochet") {

        query = query
            .gte('poids_maxi', 50);

        console.log("canne taille gros et brochet:", query)
    }

    else if (answers.taillePoisson === "oui, je veux mon poisson record" && answers.poisson === "silure") {
        query = query
            .gt('poids_maxi', 50);
    }

    else if (answers.taillePoisson === "oui, je veux mon poisson record" && answers.poisson === "perche") {

        query = query
            .eq('poids_maxi', 35);
    }

    else if (answers.taillePoisson === "oui, je veux mon poisson record" && answers.poisson === "sandre") {

        query = query
            .eq('poids_maxi', 50);
    }

    if (answers.taillePoisson === "non, j'aurais tout autant du plaisir à pêcher un poisson de taille modeste" && answers.poisson === "brochet") {

        query = query
            .lte('poids_maxi', 50);
        
    }

    

    else if (answers.taillePoisson === "non, j'aurais tout autant du plaisir à pêcher un poisson de taille modeste" && answers.poisson === "silure") {
        query = query
            .lt('poids_maxi', 70);
    }

    else if (answers.taillePoisson === "non, j'aurais tout autant du plaisir à pêcher un poisson de taille modeste" && answers.poisson === "perche") {

        query = query
            .lte('poids_maxi', 35);
    }

    else if (answers.taillePoisson === "non, j'aurais tout autant du plaisir à pêcher un poisson de taille modeste" && answers.poisson === "sandre") {

        query = query
            .eq('poids_maxi', 35);
    }*/

    const { data, error } = await query;

    if (error) {
        console.error("Erreur récupération cannes :", error);
        return [];
    }

    console.log("voici les cannes adaptées:", data);

    return data;

}
//---------------------------------------------------------------------------------

//---------------TROUVER LES MOULINETS ADAPTES A L'UTILISATEUR-----------------------

async function getrecommendedmoulinet(userID) {
    const answers = await getUserAnswers(userID);
    const cannes = await getrecommendedcanne(userID);
    const canneID = cannes.map(c => c.id);

    const { data: moulinetID } = await supabaseClient
        .from('canne_moulinet')
        .select('moulinet_id')
        .in('canne_id', canneID);

    const moulinetid = moulinetID.map(c => c.moulinet_id);


    const { data: moulinetsaisonID } = await supabaseClient
        .from('saison_moulinet')
        .select('moulinet_id')
        .eq('saison_id', answers.saison);

    const moulinetsaisonid = moulinetsaisonID.map(s => s.moulinet_id)

    const moulinetIDsFinal = moulinetid
        .filter(id => moulinetsaisonid.includes(id));


    let query = supabaseClient
        .from('moulinet')
        .select('*')
        .in('id', moulinetIDsFinal);

    const { data: moulinetfinal, error: moulinetError } = await query;

    if (moulinetError) {
        console.error(moulinetError);
        return [];
    }

    console.log("voici les moulinets adaptés:", moulinetfinal);

    return moulinetfinal;

}

//---------------------------------------------------------------------------------


//---------------ASSOCIER LES AGRAFES AUX LEURRES FILTRES-----------------------

async function getrecommendedagrafe(userID) {
    const leurresfiltres = await getrecommendedleurre(userID);
    const { data: agrafes, error: erroragrafes } = await supabaseClient
        .from('agrafe')
        .select('*');
    if (erroragrafes) throw erroragrafes;


    const { data: leurresagrafes, error: errorleurresagrafes } = await supabaseClient
        .from('agrafe_leurre')
        .select('*');
    if (errorleurresagrafes) throw errorleurresagrafes;

    const resultat = []; // Ici on va stocker le résultat final

    for (let i = 0; i < leurresfiltres.length; i++) {
        const leurre = leurresfiltres[i]; // on prend un leurre filtré
        let agrafeTrouvee = [];

        // On parcourt toutes les associations
        for (let j = 0; j < leurresagrafes.length; j++) {
            const assoc = leurresagrafes[j];


            // Si cette association correspond à ce leurre
            if (assoc.leurre_id === leurre.id) {

                // On cherche l’agrafe correspondante

                for (let k = 0; k < agrafes.length; k++) {
                    if (agrafes[k].id === assoc.agrafe_id) {
                        agrafeTrouvee.push(agrafes[k].taille);

                    }
                }

            }
        }
        // On ajoute au tableau résultat
        resultat.push({
            id: leurre.id,
            nom: leurre.nom,
            taille: leurre.taille,
            poids_tete_plombee: leurre.poids_tete_plombee,
            poids_leurre: leurre.poids_leurre,
            profondeur_de_nage_leurre: leurre.profondeur,
            montage: leurre.montage,
            agrafe: agrafeTrouvee
        });
    }

    console.log("association des agrafes/leurres:", resultat);

    return resultat

}

//---------------------------------------------------------------------------------

//---------------ASSOCIER LA CANNE AUX LEURRES/AGRAFES FILTRES-----------------------

async function assoccanneleurres(userID) {
    const cannes = await getrecommendedcanne(userID);
    const leurres = await getrecommendedagrafe(userID);
    const result = [];
    for (let i = 0; i < cannes.length; i++) {
        const canne = cannes[i]
        let leurreadaptes = [];

        const { data: leurrescannes, error: errorleurrescannes } = await supabaseClient
            .from('canne_leurre')
            .select('*');
        if (errorleurrescannes) throw errorleurrescannes;


        // On parcourt toutes les associations
        for (let j = 0; j < leurrescannes.length; j++) {
            const assoc = leurrescannes[j];


            // Si cette association correspond à cette canne
            if (assoc.canne_id === canne.id) {

                // On cherche les leurres correspondants

                for (let k = 0; k < leurres.length; k++) {
                    if (leurres[k].id === assoc.leurre_id) {
                        leurreadaptes.push(leurres[k]);

                    }
                }

            }
        }

        result.push({
            id: canne.id,
            puissance: canne.puissance,
            action: canne.action,
            longueur: canne.longueur,
            poids_mini: canne.poids_mini,
            poids_maxi: canne.poids_maxi,
            leurre: leurreadaptes
        })



    }

    console.log("associations cannes/leurres:", result);
    return result;
}

//--------------------------------------------------------------------------------------------

//---------------ASSOCIER LE MOULINET AUX CANNE/LEURRES/AGRAFES FILTRES-----------------------

async function assocmoulinetcanne(userID) {
    const moulinetfiltres = await getrecommendedmoulinet(userID)
    const assocanneleurre = await assoccanneleurres(userID)

    const { data: cannemoulinet, error } = await supabaseClient
        .from('canne_moulinet')
        .select('*')
    if (error) throw error;

    const resultat = []; // Ici on va stocker le résultat final

    for (let i = 0; i < assocanneleurre.length; i++) {
        const asso = assocanneleurre[i];
        let moulinetTrouve = [];

        // On parcourt toutes les associations
        for (let j = 0; j < cannemoulinet.length; j++) {
            const assoc = cannemoulinet[j];



            if (assoc.canne_id === asso.id) {

                // On cherche le moulinet correspondant

                for (let k = 0; k < moulinetfiltres.length; k++) {
                    if (moulinetfiltres[k].id === assoc.moulinet_id) {
                        moulinetTrouve.push(moulinetfiltres[k]);

                    }
                }

                console.log("à quoi ressemble leurres adapte:", asso)

                // On ajoute au tableau résultat

            }

        }
        resultat.push({
            id: asso.id,
            puissance: asso.puissance,
            action: asso.action,
            longueur: asso.longueur,
            poids_mini: asso.poids_mini,
            poids_maxi: asso.poids_maxi,
            leurres: Array.isArray(asso.leurre) ? asso.leurre : [],
            moulinets: moulinetTrouve
        });
    }

    console.log("associations cannes/leurres/moulinet/agrafes:", resultat);

    return resultat



}
//--------------------------------------------------------------------------------------------
//---------------ASSOCIER LE FIL AUX MOULINET/CANNE/LEURRES-AGRAFES FILTRES-----------------------

async function assocfil(userID) {
    const filfiltre = await getrecommendedfil(userID)
    console.log("filfiltre :", filfiltre);

    const assoc = await assocmoulinetcanne(userID)
    console.log("assoc avant map :", assoc);

    let resultat = assoc.map(item => ({
        ...item,
        fil: filfiltre
    }))

    console.log("association fil/moulinet/canne/leurres/agrafes:", resultat)

    return resultat
}

function getLeurreImage(nom) {
    const { data } = supabaseClient
        .storage
        .from("images_leurres")
        .getPublicUrl(`${normalizeFileName(nom)}`);

    return data.publicUrl;
}

function normalizeFileName(nom) {
    return nom
        .toLowerCase()
        .normalize("NFD")               // enlève les accents
        .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
        .replace(/\s+/g, "-")            // espaces -> tirets
        + ".webp";                        // extension fixe
}



async function infoleurre(asso) {
    const texan = "shad_texan"
    const non_texan = "shad"
    let html = "";
    html += `
    <div class="items">
    <div id="itemsleurres">`

    // On groupe les variantes par nom de leurre
    const groupedLeurres = {};
    asso.leurres.forEach(leurre => {
        if (!groupedLeurres[leurre.nom]) {
            groupedLeurres[leurre.nom] = {
                image_url: getLeurreImage(leurre.nom),
                variantes: []
            };
        }
        groupedLeurres[leurre.nom].variantes.push({
            taille: leurre.taille,
            poids_tete_plombee: leurre.poids_tete_plombee,
            poids_leurre: leurre.poids_leurre,
            profondeur_de_nage_leurre: leurre.profondeur_de_nage_leurre,
            montage: leurre.montage,
            agrafe: leurre.agrafe
        });
    });


    // Génération HTML pour chaque leurre
    Object.keys(groupedLeurres).forEach(nom => {
        const leurre = groupedLeurres[nom];
        const idTable = `leurre-${asso.id}-${nom.replace(/\s+/g, '-')}-table`; // id unique pour lightbox

        // 1️⃣ Image cliquable
        const htmlImage = `
        <div class="zoomable" data-table="${idTable}">
          <img src="${leurre.image_url}" alt="${nom}">
          <h3>${nom}</h3>
        </div>        
        `;

        // 2️⃣ Tableau caché pour lightbox
        const htmlTable = `
        <table id="${idTable}" class="hidden leurre-variants">
            <thead>
              <tr>
                <th>Taille du leurre</th>
                <th>Poids tête plombée</th>
                <th>Poids leurre</th>
                <th>Profondeur de nage du leurre</th>
                <th>Montage</th>
                <th>Agrafe(s)</th>
              </tr>
            </thead>
            <tbody>
              ${leurre.variantes
                .sort((a, b) => {
                    if (a.taille !== b.taille) return a.taille - b.taille;
                    if (a.poids_leurre !== b.poids_leurre) return a.poids_leurre - b.poids_leurre;
                    return a.montage.localeCompare(b.montage);
                })
                //le "?" dans le deuxième td de map veut dire si la condition écrite avant est vraie alors on fait ce qui suit et le ":" veut dire sinon on fait la suite 
                .map(v => `
                    <tr>
                      <td>${nom === "cuillère tournante" ? v.taille : v.taille + "cm"}</td>                      
                      <td>${v.poids_tete_plombee === "pas de tête plombée" ? v.poids_tete_plombee : v.poids_tete_plombee + "g"}</td> 
                      <td>${v.poids_leurre}g</td>
                      <td>${v.profondeur_de_nage_leurre}</td>
                      <td>${v.montage}</td>
                      <td>${v.agrafe}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>`;

        html += htmlImage + htmlTable;
    });

    html += `
    </div>
    <div data-target="lightbox2" data-content1="infossupleurretext" class="infossup">
        <h3>En savoir plus</h3>
    </div>
    </div>

    `

    html += `
    <div id="infossupleurretext" class="hidden explications">
        <h3>Montage texan</h3><br>
    <p>Le montage dit "texan" s'utilise sur les leurres souples pour des milieux encombrés (branches immergées,algues,roches...) pour éviter de perdre le leurre en l'accrochant à un obstacle dans l'eau. 
    L'hameçon du leurre est piqué dans le corps du leurre souple de manière à ce que la pointe de l’hameçon soit cachée dans la gomme du leurre. L'hameçon ne ressort que lors du ferrage du poisson.</p><br>
    <div id="photos_montage">
    <div id="texan" class="montage">    
    <img src="${getLeurreImage(texan)}" alt="montage texan">
    <p>Montage texan</p>
    </div>
    <div id="montage classique" class="montage">
    <img src="${getLeurreImage(non_texan)}" alt="montage classique hameçon apparent">
    <p>Montage classique hameçon apparent</p>
    </div>
    </div>
    </div>

    `




    return html;
}




async function infocanne(asso) {
    const canne = "canne";
    const idTable = `canne-${asso.id}-table`;
    const puissance_canne = "puissance_canne";
    const action_canne = "action_canne";

    // 1️⃣ Partie affichée : image cliquable
    const htmlImage = `
    <div class="items">
    <div class="zoomable" data-table="${idTable}">
        <img src="${getLeurreImage(canne)}" alt="canne">
    </div>
    <div data-content1="infossupcannetext1" data-content2="infossupcannetext2" data-target="lightbox2" class="infossup">
        <h3>En savoir plus</h3>
    </div>
    </div>
    `;

    // 2️⃣ Tableau détaillé caché pour lightbox
    const variantes = [{
        longueur: asso.longueur,
        poids_mini: asso.poids_mini,
        poids_maxi: asso.poids_maxi,
        action: asso.action
    }];

    const htmlTable = `
    <table id="${idTable}" class="hidden leurre-variants">
        <thead>
            <tr>
                <th>Longueur</th>
                <th>Puissance</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${variantes.map(v => `
                <tr>
                    <td>${v.longueur}</td>
                    <td>${v.poids_mini}g-${v.poids_maxi}g</td>
                    <td>${v.action}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>`;

    const htmlExplicationtext1 = `
    <div id="infossupcannetext1" class="hidden explications">   
    <h3>Puissance d'une canne</h3>

    <p>La puissance d'une canne correspond:</p><br>

    <p>-au poids maximal du leurre que peut gérer la canne sans qu'elle ne risque de se casser ou de se fragiliser</p>
    <p>-au poids minimal du leurre que peut gérer la canne sans que l'animation du leurre soit difficile ou que lancer le leurre devienne compliqué</p><br>

    <p>La puissance de la canne est directement écrite sur la canne prêt de la zone d'accroche du moulinet.</p><br>

    <img src="${getLeurreImage(puissance_canne)}" alt="puissance_canne">
    </div>`


    const htmlExplicationtext2 = `
    <div id="infossupcannetext2" class="hidden explications">
    <h3>Action d'une canne</h3><br>

    <img src="${getLeurreImage(action_canne)}" alt="action_canne"><br>

    <p>L’action d’une canne décrit la manière dont la canne se plie ou fléchit sous la tension lorsqu’on lance un leurre ou qu’on combat un poisson</p><br>

    <p>1) Action dite <span class="rouge">"fast ou action de pointe"</span>, la canne se plie seulement à son sommet.</p><br>

    <p>Ces cannes sont vraiment adaptées pour ferrer des poissons qui ont une machoire dure.
    Pour le sandre qui a une machoire relativement rigide, l'hameçon va se planter plus facilement qu'avec les autres actions plus fexibles.<p>
    <p>Elles permettent aussi de lancer plus loin les leurres légers</p>
    <p>Elles ne sont en revanche pas recommandées pour le combat de gros poissons. Les chocs du combat sont peu absorbés, ce qui rend très physique la remontée du poisson, 
    et il y a un risque de perdre le poisson par un simple coup de tête.</p><br>   
    
    <p>2) Action dite <span class="rouge">"regular ou medium ou semi-parabolique ou moderate"</span>. La canne fléchit jusqu'à sa moitié supérieure.</p><br>

    <p>C'est une action de canne polyvalente. Elle absorbe mieux les coups de tête des poissons et fatigue moins le bras qu'une canne fast lors du combat. 
    Une action donc plutôt dédiée pour les gros spécimens. Seul bémol, il y a plus de risque de raté lors du ferrage par rapport à une action fast.</p><br>

    <p>3) Action dite <span class="rouge">"parabolique ou slow"</span>. La canne fléchit sur toute sa longeur.</p><br>

    <p>C'est une action de canne presque absente pour la pêche aux leurres. 
    Elle est plutôt présente sur les cannes à pêche à l'anglaise (=pêche aux petits poissons), où on cherche de la finesse dans la sensation de la touche et de l'efficacité dans le lancer sans trop de mouvement de bras.</p>

    

    </div>   
    
    `

    // Retourne les deux parties
    return htmlImage + htmlTable + htmlExplicationtext1 + htmlExplicationtext2;
}

async function infofil(asso) {
    const fluoro = "fluorocarbone";
    const tresse = "tresse";
    const idTable = `fil-${asso.id}-table`;
    const CDL1 = "corps_de_ligne1"
    const CDL2 = "corps_de_ligne2"
    const backing = "backing_nylon"
    const BDL = "bas_de_ligne_fluoro"


    // Images cliquables
    const htmlImage = `
    <div class="itemfil">
        <div class="fluoro zoomable" data-table="${idTable}">
            <img src="${getLeurreImage(fluoro)}" alt="nylon">
            <p>1.nylon<p>
        </div>
        <div class="plus">
        <i class="fa-solid fa-plus"></i>
        </div>       
        <div class="fluoro zoomable" data-table="${idTable}">
            <img src="${getLeurreImage(tresse)}" alt="tresse">
            <p>2.tresse<p>
        </div>
        <div class="plus">
        <i class="fa-solid fa-plus"></i>
        </div>
        <div class="fluoro zoomable" data-table="${idTable}">
            <img src="${getLeurreImage(fluoro)}" alt="fluoro">
            <p>3.fluorocarbone<p>
        </div>
        <div data-content1="infossupfiltext" data-content2="infossupfilimg" data-target="lightbox2" class="infossup">
        <h3>En savoir plus</h3>
        </div> 

    </div>`;

    // Tableau caché
    const variantes = [{
        epaisseur_de_tresse: asso.fil[0].epaisseur_de_tresse,
        epaisseur_de_tresse: asso.fil[0].epaisseur_de_tresse,
        epaisseur_de_fluorocarbone: asso.fil[0].epaisseur_de_fluorocarbone
    }];

    const htmlTable = `
    <table id="${idTable}" class="hidden leurre-variants">
        <thead>
            <tr>
                <th>Epaisseur de nylon</th>                
                <th>Epaisseur de tresse</th>
                <th>Epaisseur de fluorocarbone</th>
            </tr>
        </thead>
        <tbody>
            ${variantes.map(v => `
                <tr> 
                    <td>${v.epaisseur_de_tresse}mm</td>                   
                    <td>${v.epaisseur_de_tresse}mm</td>
                    <td>${v.epaisseur_de_fluorocarbone}mm</td>
                </tr>
            `).join("")}
        </tbody>
    </table>`;

    const htmlExplicationtext = `
    <div id="infossupfiltext" class="hidden explications">   
    <p>Pour remplir de fils la bobine du moulinet, il faut 3 types de fils:</p><br>

    <p><span class="rouge">1)</span> Du <span class="rouge">nylon</span> pour débuter, 5 à 10 tours de bobine suffisent.C'est le <span class="rouge">backing</span>. 
    Ce nylon va permettre d'éviter que la tresse glisse sur la bobine en cas de forte tension du fil. On relie le nylon à la bobine via un <span class="rouge">noeud de BACKING</span>. 
    Son épaisseur doit être la même que celle de la tresse.</p><br>

    <p><span class="rouge">2)</span> De la <span class="rouge">tresse</span> ensuite. C'est le <span class="rouge">corps de ligne</span>. La tresse s'est répandue sur le marché depuis quelques années pour plusieurs raisons:<p><br>

    <p>-elle permet de <span class="rouge">ressentir plus les touches</span> de poisson qu'un nylon classique parce qu'elle est moins élastique.</p>

    <p>-elle s'<span class="rouge">use moins vite</span> dans le temps</p>

    <p>-elle permet de <span class="rouge">lancer plus loin</span> parce qu'elle est moins élastique et d'un diamètre plus fin que le nylon.</p><br>

    <p>On relie donc la tresse au nylon via un <span class="rouge">noeud ALBRIGHT</span>. On remplit ensuite l'entièreté de la bobine jusqu'à atteindre 2mm entre le fil et le bord de la bobine.</p><br>

    <span class="rouge">3)</span>On fini par du <span class="rouge">fluorocarbone</span>. C'est le <span class="rouge">bas de ligne</span>. La tresse n'étant pas du tout discrète dans l'eau, il faut donc rajouter du fluorocarbone sur la bobine qui est lui complètement <span class="rouge">transparent dans l'eau</span>. 
    On le préfère au nylon car plus résistant à l'abrasion et à l'usure du temps. Sa longueur doit être de 1 à 2m. Il se raccorde à la tresse avec un <span class="rouge">noeud ALBRIGHT</span>.
    </div>`

    const htmlExplicationimg = `
    <div id="infossupfilimg" class="hidden explications">
    <img src="${getLeurreImage(backing)}" alt="backing_fluoro" class=synthese>
    <img src="${getLeurreImage(CDL1)}" alt="corps_de_ligne" class=synthese>
    <img src="${getLeurreImage(CDL2)}" alt="corps_de_ligne" class=synthese>
    <img src="${getLeurreImage(BDL)}" alt="bas_de_ligne" class=synthese>
    </div>
    
    
    `


    return htmlImage + htmlTable + htmlExplicationtext + htmlExplicationimg;
}

async function infomoulinet(asso) {

    const photomoulinet = "moulinet"
    const image_url = getLeurreImage(photomoulinet)
    const idTable = `moulinet - ${asso.id}-table `;
    const ratiomoulinet = "ratio_sur_moulinet"
    const ratioboite = "ratio_sur_boite"
    const taillebobinemoulinet="taille_bobine_sur_moulinet"
    const taillebobineboite="taille_bobine_sur_boite"




    const htmlImage = `
            <div class="items">
            <div class="zoomable" data-table="${idTable}">
                <img src="${image_url}" alt="moulinet">
            </div>
            <div data-target="lightbox2" data-content1="infossupmoulinettext1" data-content2="infossupmoulinettext2" class="infossup">
                <h3>En savoir plus</h3>
            </div> 
            </div>          
            `;

    let htmlTable = `        
                    <table id="${idTable}" class="hidden leurre-variants">
                        <thead>
                            <tr>
                                <th>Taille de la bobine</th>
                                <th>Ratio</th>
                            </tr>
                        </thead>
                        <tbody>`;


    const groupedMoulinets = {};
    asso.moulinets.forEach(moulinet => {
        if (!groupedMoulinets[moulinet.id]) {
            groupedMoulinets[moulinet.id] = { variantes: [] };

        }

        groupedMoulinets[moulinet.id].variantes.push({
            taille_bobine: moulinet.taille_bobine,
            ratio: moulinet.ratio
        });
    });

    // Génération HTML pour chaque leurre
    Object.keys(groupedMoulinets).forEach(id => {
        const moulinet = groupedMoulinets[id];

        htmlTable += moulinet.variantes.map(v => `
                <tr>
                  <td>${v.taille_bobine}</td>
                  <td>${v.ratio}</td>                  
                </tr>
              `).join("");

    });

    htmlTable += `
                        </tbody>
                    </table>
                `

    const htmlzoom = ` 
    <div id="infossupmoulinettext1" class="hidden explications">
    <h3>Ratio du moulinet</h3><br>
    <p>Le ratio du moulinet représente le nombre de tour que la bobine fait en un seul tour de manivelle. On retrouve cette donnée sur la boîte du moulinet et le moulinet.</p><br>
    
    <div id="photos_ratio">

    <div id="ratio_sur_moulinet" class="ratio">
    <img src="${getLeurreImage(ratiomoulinet)}" alt="ratio sur moulinet">
    </div>

    <div id="ratio_sur_boite" class="ratio">
    <img src="${getLeurreImage(ratioboite)}" alt="ratio sur boite">
    </div>

    </div><br>

    <p>5.1:1 par exemple signifie qu'en 1 tour de manivelle la bobine fait 5.1 tours ce qui correspond à une récupération plutôt lente. 
    Plus le nombre est élevé plus la récupération des leurres est rapide. On va donc privilégier des ratios faibles pour l'hiver afin d'animer lentement les leurres ou sur des pêches avec des gros leurres pour moins se fatiguer.</p> 
    
    </div>

    <div id="infossupmoulinettext2" class="hidden explications">
    <h3>taille de la bobine du moulinet</h3><br>

    <p>Les tailles de bobine de moulinet sont représentées par des nombres qui n'ont pas d'unité particulière. C'est uniquement une convention des fabricants. 
    On retrouve cette donnée sur les boîtes du moulinet ou le moulinet lui-même. </p><br>

    <div id="photos_taille_bobine">
    <div class="moulinet">

    <img src="${getLeurreImage(taillebobinemoulinet)}" alt="taille bobine sur moulinet">

    </div>

    <div class="moulinet">

    <img src="${getLeurreImage(taillebobineboite)}" alt="taille bobine sur boite"><br>

    </div>

    </div>

    <P>Plus le nombre est élevé plus la taille de la bobine est grosse et plus les poissons que l'on veut pêcher seront gros.</p><br>

    Pour pêcher des petits poissons on va privilégier des petits moulinets (1000 ou 2000). 
    La raison vient du fait que pour ce type de pêche, on utilise des cannes légères. 
    Si on mettait un gros moulinet la canne serait donc déséquilibré et on serait pas souple sur nos lancers. 
    Les freins sur ces moulinets sont aussi plus puissants ce qui risquerait de décrocher un petit poisson à cause d’une traction trop brutale. 
    Du fait de la grosse taille de la bobine cela ramènerait trop de fil par tour de manivelle. Cela entraînerait une animation trop rapide du leurre et donc pas naturelle.
    Enfin, un gros moulinet est fait pour accueillir du fil épais. Si on mettait du fil fin dessus, il risquerait de mal s'enrouler et de s'emmêler.</p><br>

    <p>L'inverse est aussi vrai. Pour pêcher des grands poissons on va privilégier des gros moulinets(5000-7000). C'est le raisonnement inverse des petits moulinets.</p>   

    </div>  
    
    `


    return htmlImage + htmlTable + htmlzoom
}

function attachRelanceBtn() {
    const btn = document.getElementById('relance_questionnaire');
    if (btn) {
        btn.addEventListener('click', start_questionnaire);
    }
}

function initLightbox() {

    const closeBtn = document.getElementsByClassName("close-lightbox");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTable = document.getElementById("lightbox-table");
    const lightbox2 = document.getElementById("lightbox2");



    // Toutes les miniatures avec data-table
    document.querySelectorAll(".zoomable, .fluoro.zoomable").forEach(el => {
        const tableId = el.dataset.table; // l’id du tableau associé
        const table = document.getElementById(tableId);

        const img = el.querySelector("img"); // l'image cliquable
        if (!img) return;

        img.addEventListener("click", () => {
            // Injecter l'image dans la lightbox
            lightboxImg.innerHTML = img.outerHTML;
            if (table) {
                lightboxTable.innerHTML = table.outerHTML;
                // Retirer 'hidden' pour que le tableau s'affiche dans la lightbox
                lightboxTable.querySelector("table")?.classList.remove("hidden");
            } else {
                lightboxTable.innerHTML = "<p>Aucun tableau</p>";
            }

            // Afficher la lightbox
            lightbox.classList.remove("hidden");
        });
    });

    document.querySelectorAll(".infossup").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const lightbox = document.getElementById(targetId);
            const body = lightbox.querySelector(".lightbox2-body");

            // Reset du contenu
            body.innerHTML = "";

            // Récupérer tous les data-content*
            Object.keys(btn.dataset).forEach(key => {
                if (key.startsWith("content")) {
                    const contentId = btn.dataset[key];
                    const original = document.getElementById(contentId);
                    if (original) {
                        const cloned = original.cloneNode(true);
                        cloned.classList.remove("hidden");
                        cloned.querySelectorAll(".hidden").forEach(el => el.classList.remove("hidden"));
                        body.appendChild(cloned);
                    }
                }
            });

            // Affiche la lightbox
            lightbox.classList.remove("hidden");
        });
    });

    // Fermer
    document.querySelectorAll(".close-lightbox").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".lightbox2").classList.add("hidden");
        });
    });



    // Fermer avec le bouton ×
    Array.from(closeBtn).forEach(btn => {
        btn.addEventListener("click", () => {
            lightbox.classList.add("hidden"); l
        });
    });

    // Fermer en cliquant sur le fond
    lightbox.addEventListener("click", (e) => {
        if (e.target.id === "lightbox") {
            lightbox.classList.add("hidden");
        }
    });


    // Fermer en cliquant sur le fond
    lightbox2.addEventListener("click", (e) => {
        if (e.target.id === "lightbox2") {
            lightbox2.classList.add("hidden");
        }
    });

}

async function showResult(userID) {
    const assoc = await assocfil(userID);
    console.log("Résultat de assocfil :", assoc);
    const container = document.getElementById('questionnaire');
    const questions = await get_questions();
    const answers = await getUserAnswers(userID);

    let html = '';

    html += `<div id=recap_reponsesetphoto>
                <div id=recap_reponses>`


    const questionsbis = questions.map(question => question.contenu_question)
    const answersbis = Object.values(answers)

    for (let i = 0; i < questionsbis.length; i++) {
        html += `
                <div class=result-questions>
                    <p>${questionsbis[i]}</p>
                </div>
                <div class=result-answers>
                    <p>${answersbis[i]}</p>
                </div>        
                    
                `

    }

    html += `
    </div>
    <div id=photo_poisson>
        <img src="${getLeurreImage(answersbis[1])}" alt="photo_poisson">
        <h2>Pêche ${answersbis[1]}</h2>
        <h2>-</h2>
        
    </div>
    <div id=relance_questionnaire>
    <h2>Cliquez ici pour relancer le questionnaire</h2>
    </div>   
    </div>
    <div id=phrase_introduction>
    <h2> Voici le materiel adapté à vos besoins:</h2>
    </div>
    `



    if (assoc && assoc.length > 0) {

        html += `


            
        <table class="result-table">
            <thead>
                <tr>
                    <th>Les Fils</th>
                    <th>Les Cannes</th>
                    <th>Les Leurres</th>
                    <th>Les Moulinets</th>

                </tr>
            </thead>
            <tbody>`;


        for (const asso of assoc) {
            const leurresHTML = await infoleurre(asso);
            const canneHTML = await infocanne(asso);
            const filHTML = await infofil(asso);
            const moulinetHTML = await infomoulinet(asso);

            html += `
                <tr>
                    <td>
                        <div class="leurres-content">
                            ${filHTML}
                        </div>
                    </td>
                    <td>
                        <div class="leurres-content">
                            ${canneHTML}
                        </div>
                    </td>
                    <td>
                        <div class="leurres-content">
                            ${leurresHTML}
                        </div>
                    </td>
                    <td>
                        <div class="leurres-content">
                            ${moulinetHTML}
                        </div>
                    </td>
                </tr>`

        }

        html += `
            <div id="lightbox" class="lightbox hidden">
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <div class="lightbox-body">
                        <div id="lightbox-img"></div>
                        <div id="lightbox-table"></div>
                    </div>
                </div>
            </div>`

        html += `
            <div id="lightbox2" class="lightbox2 hidden">
                <div class="lightbox-content">
                    <span class="close-lightbox">&times;</span>
                    <div class="lightbox2-body">                        
                    </div>
                </div>
            </div>
            
                
                
                
                
        </tbody></table>`;

    }



    container.innerHTML = html;

    initLightbox();


    attachRelanceBtn();


    return html;


}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM prêt, lancement du questionnaire");
    start_questionnaire();
});