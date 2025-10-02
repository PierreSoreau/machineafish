/*const cookies=document.getElementById("cookies")

cookies.innerHTML+=`

<h2>machine@fish respecte votre vie privée</h2><br>
<p>Afin de rendre votre expérience sur mon site unique et agréable, il m'est nécessaire de suivre son fonctionnement et en mesurer l'audience via des cookies statistiques.</p><br>
<div id=divbutton>
<button onclick="acceptCookies()" id="accepter">Accepter</button>
<button onclick="declineCookies()" id="refuser">Refuser</button>
</div>

`
function acceptCookies() {
  setCookie("cookies_accepted", "true", 365); //crée un cookie qui s'appelle cookies_accepted, sa valeur vaut true et il va rester en stock dans le navigateur un an
  document.getElementById('background_cookies').style.display = 'none';
  loadGoogleAnalytics(); // on charge Google Analytics seulement si accepté
}

function declineCookies() {
  setCookie("cookies_accepted", "false", 365); //crée un cookie qui s'appelle cookies_accepted, sa valeur vaut false et il va rester en stock dans le navigateur un an
  document.getElementById('background_cookies').style.display = 'none';
  loadBasicAnalytics(); // si refus, on charge ton suivi maison
}

/*Cette fonction lit un cookie existant.

document.cookie renvoie tous les cookies sous forme de chaîne ("cookie1=val1; cookie2=val2")

value.split(; ${name}=) cherche le cookie dont le nom est name.

Si le cookie existe, il renvoie sa valeur ; sinon null.

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;  
}

/*fonction qui lance google analytics

function loadGoogleAnalytics() {
  let ga = document.createElement('script');
  ga.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
  ga.async = true;
  document.head.appendChild(ga);

  ga.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  };
}

/*fonction qui lance une analyse du suivi du site en basique sans le consentement des gens

function loadBasicAnalytics() {
    const anonId = getOrCreateAnonId()
    fetch("/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id:anonId, // identifiant unique anonymisé
      page: window.location.pathname, //la page qu'il a consulté
      referrer: document.referrer,//la page qu'il a consulté avant
      timestamp: Date.now()//la date de la consultation
    })
  });
}

/*fonction qui charge google analytics ou l'analyse basique en fonction du cookie qui a été enregistré, 
et ferme en automatique dès l'ouverture de la page le bandeau demande de cookie si on a déjà répondu à la demande

window.onload = function() {
  const choice = getCookie("cookies_accepted");
  if (choice === "true") {
    document.getElementById('background_cookies').style.display = 'none';
    loadGoogleAnalytics();
  } else if (choice === "false") {
    document.getElementById('background_cookies').style.display = 'none';
    loadBasicAnalytics();
  }
};

/*fonction de création d'un cookie sécruisé
function setCookie(name, value, days) {
  document.cookie = `${name}=${value}; path=/; max-age=${days*24*60*60}; Secure; SameSite=Lax`;
}

/*crée un cookie technique qui enregistre un identifiant anonyme

function getOrCreateAnonId() {
  let id = getCookie("anon_id");
  if (!id) {
    // Génère un identifiant unique aléatoire
    id = crypto.randomUUID(); 
    // Stocke dans un cookie technique sécurisé pour 1 an
    setCookie("anon_id", id, 365);
  }
  return id;
}




